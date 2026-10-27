export const DEVICE_SOURCE_TYPES = [
  "directStatement",
  "ownedDeviceList",
  "channelCommand",
  "officialMaterial"
] as const;

export type DeviceSourceType = (typeof DEVICE_SOURCE_TYPES)[number];

const DEVICE_SOURCE_LABELS: Record<DeviceSourceType, string> = {
  directStatement: "本人の直接発言・動画",
  ownedDeviceList: "本人管理サイトのデバイス一覧",
  channelCommand: "配信チャンネルの公開コマンド",
  officialMaterial: "その他の公式資料"
};

export function getDeviceSourceLabel(sourceType: DeviceSourceType): string {
  return DEVICE_SOURCE_LABELS[sourceType];
}

const DEVICE_SOURCE_BADGE_LABELS: Record<DeviceSourceType, string> = {
  directStatement: "本人発言・動画",
  ownedDeviceList: "本人管理サイト",
  channelCommand: "公開コマンド",
  officialMaterial: "公式資料"
};

export function getDeviceSourceBadgeLabel(
  sourceType: DeviceSourceType
): string {
  return DEVICE_SOURCE_BADGE_LABELS[sourceType];
}
