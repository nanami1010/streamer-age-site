import type { Streamer } from "./streamers";
import {
  getDeviceAffiliateLinks,
  type ResolvedDeviceAffiliateLinks
} from "../config/device-affiliate-links.ts";
import {
  deviceMatchesProductDefinition,
  getDeviceProduct,
  type DeviceProductCommerceIdentifiers,
  type DeviceProductIdentityStatus
} from "../config/device-products.ts";
import type { DeviceSourceType } from "../config/device-sources.ts";

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
  productId: string;
  type: string;
  manufacturer: string;
  productName: string;
  identityStatus: DeviceProductIdentityStatus;
  commerceIdentifiers?: DeviceProductCommerceIdentifiers;
  affiliateLinks: ResolvedDeviceAffiliateLinks | null;
  usages: DeviceUsageRecord[];
}

export function createDeviceCatalog(streamers: Streamer[]): DeviceCatalogItem[] {
  const catalog = new Map<string, DeviceCatalogItem>();

  for (const streamer of streamers) {
    for (const device of streamer.devices ?? []) {
      const product = getDeviceProduct(device.productId);
      if (!product || !deviceMatchesProductDefinition(device)) {
        throw new Error(
          `productIdとデバイス情報が一致しません: ${device.productId}`
        );
      }

      const item = catalog.get(device.productId) ?? {
        productId: product.productId,
        type: product.type,
        manufacturer: product.manufacturer,
        productName: product.productName,
        identityStatus: product.identityStatus,
        commerceIdentifiers: product.commerceIdentifiers,
        affiliateLinks: getDeviceAffiliateLinks(device.productId),
        usages: []
      };

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
      catalog.set(device.productId, item);
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
