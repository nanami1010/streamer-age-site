import type { DeviceSourceType } from "../config/device-sources";

export interface DeviceDateFields {
  sourceType: DeviceSourceType;
  usageConfirmedAt?: string;
  sourceUpdatedAt?: string;
  lastVerifiedAt: string;
}

export interface VisibleDeviceDateItem {
  kind: "usageConfirmedAt" | "sourceUpdatedAt" | "lastVerifiedAt";
  label: string;
  dateTime: string;
  formattedDate: string;
}

export function formatDeviceDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  return `${year}年${month}月${day}日`;
}

export function formatDeviceDateTime(dateTime: string): string {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(dateTime));
}

export function getVisibleDeviceDateItems({
  sourceType,
  usageConfirmedAt,
  sourceUpdatedAt,
  lastVerifiedAt
}: DeviceDateFields): VisibleDeviceDateItem[] {
  const items: VisibleDeviceDateItem[] = [];

  if (usageConfirmedAt) {
    items.push({
      kind: "usageConfirmedAt",
      label: "使用確認日",
      dateTime: usageConfirmedAt,
      formattedDate: formatDeviceDate(usageConfirmedAt)
    });
  }

  if (sourceUpdatedAt) {
    items.push({
      kind: "sourceUpdatedAt",
      label:
        sourceType === "channelCommand"
          ? "公開コマンド更新日"
          : "出典更新日",
      dateTime: sourceUpdatedAt,
      formattedDate: formatDeviceDateTime(sourceUpdatedAt)
    });
  }

  if (items.length === 0) {
    items.push({
      kind: "lastVerifiedAt",
      label: "出典確認日",
      dateTime: lastVerifiedAt,
      formattedDate: formatDeviceDate(lastVerifiedAt)
    });
  }

  return items;
}
