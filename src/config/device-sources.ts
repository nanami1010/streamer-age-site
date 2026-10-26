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

export function getDeviceSourceCaution(
  sourceType: DeviceSourceType
): string | null {
  if (sourceType !== "channelCommand") return null;

  return "公開コマンドへの掲載情報です。本人が直接入力・発言した情報とは限りません。現在も使用しているかは未確認です。";
}
