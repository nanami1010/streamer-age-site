import {
  getDeviceProduct,
  isDeviceProductId,
  type DeviceProductId
} from "./device-products.ts";

export type AmazonAffiliateLinkSource =
  | "associates-toolbar"
  | "mobile-getlink";

export interface AmazonAffiliateLinkConfig {
  url: string;
  issuedBy: AmazonAffiliateLinkSource;
}

export interface DeviceAffiliateLinkConfig {
  amazon?: AmazonAffiliateLinkConfig;
}

export interface ResolvedDeviceAffiliateLinks {
  amazon?: string;
}

export type DeviceAffiliateLinksByProduct = Readonly<
  Partial<Record<DeviceProductId, DeviceAffiliateLinkConfig>>
>;

// Amazonアソシエイト参加後、公式のリンク作成機能で発行したURLだけを登録する。
// 表示名ではなく、src/config/device-products.ts の安定したproductIdをキーにする。
export const DEVICE_AFFILIATE_LINKS: DeviceAffiliateLinksByProduct =
  Object.freeze({});

// 楽天は発行HTMLの実物と利用条件を確認するまで、URL抽出や独自aタグ描画を実装しない。
export const RAKUTEN_AFFILIATE_IMPLEMENTATION_STATUS =
  "pending-issued-code-review" as const;

const AMAZON_ALLOWED_HOSTS = new Set([
  "amazon.co.jp",
  "www.amazon.co.jp",
  "amzn.asia",
  "amzn.to"
]);

function validateAmazonAffiliateLink(config: AmazonAffiliateLinkConfig): string {
  const parsed = new URL(config.url);

  if (parsed.protocol !== "https:") {
    throw new Error("Amazonの商品リンクはHTTPS URLで指定してください");
  }

  if (!AMAZON_ALLOWED_HOSTS.has(parsed.hostname.toLowerCase())) {
    throw new Error(`Amazonの商品リンクとして許可されていないホストです: ${parsed.hostname}`);
  }

  if (
    (parsed.hostname === "amazon.co.jp" || parsed.hostname === "www.amazon.co.jp") &&
    !parsed.searchParams.get("tag")
  ) {
    throw new Error("Amazon.co.jpの通常URLにはアソシエイトタグが必要です");
  }

  return config.url;
}

export function getDeviceAffiliateLinks(
  productId: string,
  linksByProduct: DeviceAffiliateLinksByProduct = DEVICE_AFFILIATE_LINKS
): ResolvedDeviceAffiliateLinks | null {
  const product = getDeviceProduct(productId);
  if (!product || !isDeviceProductId(productId)) {
    throw new Error(`製品台帳に登録されていないproductIdです: ${productId}`);
  }

  const configured = linksByProduct[productId];
  if (!configured?.amazon) return null;

  if (product.identityStatus !== "confirmed") {
    throw new Error(
      `商品同一性の確認が完了していない製品には商品リンクを設定できません: ${productId}`
    );
  }

  return {
    amazon: validateAmazonAffiliateLink(configured.amazon)
  };
}
