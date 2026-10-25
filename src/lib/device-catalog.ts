import type { Streamer } from "./streamers";

type Device = NonNullable<Streamer["devices"]>[number];

export interface DeviceUsageRecord {
  streamerName: string;
  streamerSlug: string;
  sourceUrl: string;
  usageConfirmedAt?: string;
  lastVerifiedAt: string;
}

export interface DeviceCatalogItem {
  id: string;
  type: string;
  manufacturer: string;
  productName: string;
  usages: DeviceUsageRecord[];
}

function normalizeIdentityPart(value: string): string {
  return value.trim();
}

function createIdentityKey(device: Device): string {
  return [device.type, device.manufacturer, device.productName]
    .map(normalizeIdentityPart)
    .join("\u001f");
}

function createStableId(device: Device): string {
  return createIdentityKey(device)
    .replace(/[^a-z0-9\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-|-$/g, "");
}

export function createDeviceCatalog(streamers: Streamer[]): DeviceCatalogItem[] {
  const catalog = new Map<string, DeviceCatalogItem>();

  for (const streamer of streamers) {
    for (const device of streamer.devices ?? []) {
      const identityKey = createIdentityKey(device);
      const item = catalog.get(identityKey) ?? {
        id: createStableId(device),
        type: device.type,
        manufacturer: device.manufacturer,
        productName: device.productName,
        usages: []
      };

      item.usages.push({
        streamerName: streamer.name,
        streamerSlug: streamer.slug,
        sourceUrl: device.sourceUrl,
        usageConfirmedAt: device.usageConfirmedAt,
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
