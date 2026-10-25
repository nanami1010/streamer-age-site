export interface DeviceIdentity {
  type: string;
  manufacturer: string;
  productName: string;
}

export interface DeviceAffiliateLinks {
  amazon?: string;
  rakuten?: string;
}

type LegacyDeviceAffiliateLinks = DeviceIdentity & {
  affiliateUrl?: string | null;
  affiliateLinks?: {
    amazon?: string | null;
    rakuten?: string | null;
  };
};

export interface ResolvedDeviceAffiliateLinks extends DeviceAffiliateLinks {
  generic?: string;
}

export function createDeviceProductKey(device: DeviceIdentity): string {
  return [device.type, device.manufacturer, device.productName]
    .map((value) => value.trim())
    .join("\u001f");
}

// 提携後、公式のリンク作成機能で発行したURLだけを製品単位で登録する。
// キーにカテゴリー・メーカー・製品名を含め、似た型番や世代を統合しない。
export const DEVICE_AFFILIATE_LINKS: Readonly<
  Record<string, DeviceAffiliateLinks>
> = Object.freeze({});

function validateAffiliateUrl(url: string, merchant: string): string {
  const parsed = new URL(url);

  if (parsed.protocol !== "https:") {
    throw new Error(`${merchant}の商品リンクはHTTPS URLで指定してください`);
  }

  return url;
}

export function getDeviceAffiliateLinks(
  device: LegacyDeviceAffiliateLinks,
  linksByProduct: Readonly<Record<string, DeviceAffiliateLinks>> = DEVICE_AFFILIATE_LINKS
): ResolvedDeviceAffiliateLinks | null {
  const configured = linksByProduct[createDeviceProductKey(device)];
  const amazon = configured?.amazon ?? device.affiliateLinks?.amazon ?? undefined;
  const rakuten = configured?.rakuten ?? device.affiliateLinks?.rakuten ?? undefined;
  const generic = device.affiliateUrl ?? undefined;

  if (!amazon && !rakuten && !generic) return null;

  return {
    ...(amazon ? { amazon: validateAffiliateUrl(amazon, "Amazon") } : {}),
    ...(rakuten ? { rakuten: validateAffiliateUrl(rakuten, "楽天市場") } : {}),
    ...(generic ? { generic: validateAffiliateUrl(generic, "商品") } : {})
  };
}
