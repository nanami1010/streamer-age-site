import type { Streamer } from "./streamers";
import {
  createDeviceProductKey,
  getDeviceAffiliateLinks,
  type ResolvedDeviceAffiliateLinks
} from "../config/device-affiliate-links.ts";
import type { DeviceSourceType } from "../config/device-sources.ts";

type Device = NonNullable<Streamer["devices"]>[number];

export interface DeviceUsageRecord {
  streamerName: string;
  streamerSlug: string;
  sourceUrl: string;
  sourceType: DeviceSourceType;
  sourceCommand?: string;
  usageConfirmedAt?: string;
  sourceUpdatedAt?: string;
  verificationNote?: string;
  lastVerifiedAt: string;
}

export interface DeviceCatalogItem {
  id: string;
  type: string;
  manufacturer: string;
  productName: string;
  affiliateLinks: ResolvedDeviceAffiliateLinks | null;
  usages: DeviceUsageRecord[];
}

function createStableId(device: Device): string {
  return createDeviceProductKey(device)
    .replace(/[^a-z0-9\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-|-$/g, "");
}

export function createDeviceCatalog(streamers: Streamer[]): DeviceCatalogItem[] {
  const catalog = new Map<string, DeviceCatalogItem>();

  for (const streamer of streamers) {
    for (const device of streamer.devices ?? []) {
      const identityKey = createDeviceProductKey(device);
      const affiliateLinks = getDeviceAffiliateLinks(device);
      const item = catalog.get(identityKey) ?? {
        id: createStableId(device),
        type: device.type,
        manufacturer: device.manufacturer,
        productName: device.productName,
        affiliateLinks,
        usages: []
      };

      if (
        item.affiliateLinks &&
        affiliateLinks &&
        JSON.stringify(item.affiliateLinks) !== JSON.stringify(affiliateLinks)
      ) {
        throw new Error(
          `同一製品に異なる商品リンクが登録されています: ${device.manufacturer} ${device.productName}`
        );
      }

      item.affiliateLinks ??= affiliateLinks;

      item.usages.push({
        streamerName: streamer.name,
        streamerSlug: streamer.slug,
        sourceUrl: device.sourceUrl,
        sourceType: device.sourceType,
        sourceCommand: device.sourceCommand,
        usageConfirmedAt: device.usageConfirmedAt,
        sourceUpdatedAt: device.sourceUpdatedAt,
        verificationNote: device.verificationNote,
        lastVerifiedAt: device.lastVerifiedAt
      });
      catalog.set(identityKey, item);
    }
  }

  return Array.from(catalog.values())
    .map((item) => ({
      ...item,
      usages: item.usages.sort((a, b) =>
        a.streamerName.localeCompare(b.streamerName, "ja")
      )
    }))
    .sort((a, b) =>
      a.type.localeCompare(b.type, "ja") ||
      a.manufacturer.localeCompare(b.manufacturer, "ja") ||
      a.productName.localeCompare(b.productName, "ja")
    );
}
