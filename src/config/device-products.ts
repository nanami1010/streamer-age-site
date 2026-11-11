export const DEVICE_PRODUCT_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type DeviceProductIdentityStatus = "confirmed" | "needs-review";

export interface DeviceProductCommerceIdentifiers {
  modelNumber?: string;
  jan?: string;
  asin?: string;
  rakutenProductCode?: string;
}

export interface DeviceProductDefinition {
  productId: string;
  type: string;
  manufacturer: string;
  productName: string;
  identityStatus: DeviceProductIdentityStatus;
  commerceIdentifiers?: DeviceProductCommerceIdentifiers;
}

function defineProduct<const ProductId extends string>(
  productId: ProductId,
  type: string,
  manufacturer: string,
  productName: string,
  identityStatus: DeviceProductIdentityStatus = "confirmed",
  commerceIdentifiers?: DeviceProductCommerceIdentifiers
): DeviceProductDefinition & { productId: ProductId } {
  return {
    productId,
    type,
    manufacturer,
    productName,
    identityStatus,
    ...(commerceIdentifiers ? { commerceIdentifiers } : {})
  };
}

export const DEVICE_PRODUCTS = Object.freeze([
  defineProduct("finalmouse-slx-nightfall", "マウス", "Finalmouse", "SLX Nightfall"),
  defineProduct("skypad-2", "マウスパッド", "SkyPAD", "2.0"),
  defineProduct(
    "sony-inzone-m10s-sdm-27q10s",
    "モニター",
    "Sony",
    "INZONE M10S（SDM-27Q10S）",
    "needs-review"
  ),
  defineProduct(
    "apple-earpods-3-5mm",
    "イヤホン",
    "Apple",
    "EarPods with 3.5mm Headphone Plug"
  ),
  defineProduct("razer-deathadder-v3-pro", "マウス", "Razer", "DeathAdder V3 Pro"),
  defineProduct("vaxee-pa-winter22", "マウスパッド", "VAXEE", "PA Winter22"),
  defineProduct(
    "bose-quietcomfort-20",
    "イヤホン",
    "Bose",
    "QuietComfort 20（QC20）",
    "needs-review"
  ),
  defineProduct(
    "pulsar-x2-crazylight-medium",
    "マウス",
    "Pulsar",
    "X2 CrazyLight Medium"
  ),
  defineProduct("pulsar-pcmk-3-he-60", "キーボード", "Pulsar", "PCMK 3 HE 60"),
  defineProduct(
    "sony-inzone-h5-wh-g500",
    "ヘッドセット",
    "Sony",
    "INZONE H5（WH-G500）",
    "needs-review"
  ),
  defineProduct(
    "logicool-pro-x-superlight-magenta",
    "マウス",
    "Logicool G",
    "PRO X SUPERLIGHT Magenta"
  ),
  defineProduct("logicool-pro-kda", "キーボード", "Logicool G", "PRO K/DA"),
  defineProduct("logicool-g840-magenta", "マウスパッド", "Logicool G", "G840 Magenta"),
  defineProduct(
    "razer-viper-v3-pro-faker-edition",
    "マウス",
    "Razer",
    "Viper V3 Pro Faker Edition"
  ),
  defineProduct(
    "vspo-kisaragi-ren-keyboard",
    "キーボード",
    "VSPO! GEAR",
    "ゲーミングキーボード 如月れんモデル",
    "needs-review"
  ),
  defineProduct(
    "sony-inzone-buds-wf-g700n",
    "イヤホン",
    "Sony",
    "INZONE Buds（WF-G700N）",
    "needs-review"
  ),
  defineProduct(
    "sony-inzone-m10s-ii-sdm-27q102",
    "モニター",
    "Sony",
    "INZONE M10S II（SDM-27Q102）"
  ),
  defineProduct("neumann-bcm-104", "マイク", "Neumann", "BCM 104"),
  defineProduct("vaxee-np-01s-v3", "マウス", "VAXEE", "NP-01S V3"),
  defineProduct("zenaim-60", "キーボード", "ZENAIM", "ZENAIM 60%"),
  defineProduct("benq-zowie-xl2566x-plus", "モニター", "BenQ ZOWIE", "XL2566X+"),
  defineProduct("vaxee-pd155-plus", "マウスパッド", "VAXEE", "PD155+"),
  defineProduct("sony-inzone-e9", "イヤホン", "Sony", "INZONE E9"),
  defineProduct("skypad-3-xl", "マウスパッド", "SkyPAD", "3.0 XL"),
  defineProduct(
    "logicool-pro-x-superlight-2-white",
    "マウス",
    "Logicool G",
    "PRO X SUPERLIGHT 2 White"
  ),
  defineProduct(
    "steelseries-apex-pro-tkl-jp",
    "キーボード",
    "SteelSeries",
    "Apex Pro TKL（日本語配列）",
    "needs-review"
  ),
  defineProduct(
    "shure-se846-clear",
    "イヤホン",
    "Shure",
    "SE846 Clear",
    "needs-review"
  ),
  defineProduct("audio-technica-at2035", "マイク", "Audio-Technica", "AT2035"),
  defineProduct("yamaha-ag03", "オーディオインターフェース", "Yamaha", "AG03"),
  defineProduct(
    "lethal-gaming-gear-saturn-pro",
    "マウスパッド",
    "Lethal Gaming Gear",
    "Saturn Pro",
    "needs-review"
  ),
  defineProduct(
    "logicool-pro-wireless-gaming-mouse",
    "マウス",
    "Logicool G",
    "PRO Wireless Gaming Mouse"
  ),
  defineProduct(
    "logicool-pro-x-gaming-keyboard",
    "キーボード",
    "Logicool G",
    "PRO X Gaming Keyboard",
    "needs-review"
  ),
  defineProduct(
    "steelseries-arctis-5-black-2019",
    "ヘッドセット",
    "SteelSeries",
    "Arctis 5 Black 2019 Edition"
  ),
  defineProduct(
    "artisan-99-shiki-matcha",
    "マウスパッド",
    "ARTISAN",
    "99式 抹茶",
    "needs-review"
  ),
  defineProduct(
    "endgame-gear-op1-wired",
    "マウス",
    "Endgame Gear",
    "OP1（有線）",
    "needs-review"
  ),
  defineProduct(
    "logicool-pro-x2-superstrike",
    "マウス",
    "Logicool G",
    "PRO X2 SUPERSTRIKE"
  ),
  defineProduct("shure-mv7", "マイク", "Shure", "MV7"),
  defineProduct("hitscan-hyperlight", "マウス", "Hitscan", "Hyperlight"),
  defineProduct(
    "artisan-ninja-fx-zero-soft",
    "マウスパッド",
    "ARTISAN",
    "NINJA FX ZERO SOFT",
    "needs-review"
  ),
  defineProduct("shure-sm7db", "マイク", "Shure", "SM7dB"),
  defineProduct(
    "finalmouse-ultralightx",
    "マウス",
    "Finalmouse",
    "UltralightX",
    "needs-review"
  ),
  defineProduct(
    "fumo-saya-odin-gaming-2xl",
    "マウスパッド",
    "Fumo Collection",
    "沙耶の唄 × ふもコレ ゲーミングマウスパッド Odin Gaming 2XL"
  ),
  defineProduct(
    "realforce-gx1-keyboard",
    "キーボード",
    "REALFORCE",
    "GX1 Keyboard",
    "needs-review"
  ),
  defineProduct("blue-mouse", "マイク", "Blue Microphones", "Mouse"),
  defineProduct(
    "herman-miller-logitech-g-embody-gaming-chair",
    "ゲーミングチェア",
    "Herman Miller × Logitech G",
    "Embody Gaming Chair"
  ),
  defineProduct(
    "sony-ilme-fx3",
    "カメラ",
    "Sony",
    "FX3（ILME-FX3）",
    "confirmed",
    { modelNumber: "ILME-FX3" }
  ),
  defineProduct(
    "magewell-pro-capture-dual-hdmi",
    "キャプチャーボード",
    "Magewell",
    "Pro Capture Dual HDMI",
    "confirmed",
    { modelNumber: "11080" }
  ),
  defineProduct(
    "grapht-command-trigger-for-pc",
    "コントローラー",
    "GRAPHT",
    "Command Trigger for PC",
    "needs-review"
  ),
  defineProduct(
    "astro-a50-gen4",
    "ヘッドセット",
    "ASTRO Gaming",
    "A50 Wireless + Base Station（Gen 4）",
    "needs-review"
  ),
  defineProduct(
    "razer-viper-v3-pro-sentinels-edition",
    "マウス",
    "Razer",
    "Viper V3 Pro Sentinels Edition"
  ),
  defineProduct("asus-rog-falcata", "キーボード", "ASUS ROG", "ROG Falcata"),
  defineProduct("benq-zowie-u2", "マウス", "BenQ ZOWIE", "U2"),
  defineProduct(
    "logicool-g640-esl-edition",
    "マウスパッド",
    "Logicool G",
    "G640 ESL Edition"
  ),
  defineProduct(
    "64-audio-fourte-blanc",
    "イヤホン",
    "64 Audio",
    "Fourté Blanc"
  ),
  defineProduct(
    "xraypad-aqua-control-plus",
    "マウスパッド",
    "X-Raypad",
    "Aqua Control+",
    "needs-review"
  ),
  defineProduct(
    "herman-miller-embody-chair",
    "ゲーミングチェア",
    "Herman Miller",
    "Embody Chair",
    "needs-review"
  )
] satisfies readonly DeviceProductDefinition[]);

export type DeviceProductId = (typeof DEVICE_PRODUCTS)[number]["productId"];

export function createDeviceIdentityKey(device: {
  type: string;
  manufacturer: string;
  productName: string;
}): string {
  return [device.type, device.manufacturer, device.productName]
    .map((value) => value.trim())
    .join("\u001f");
}

function createProductRegistry(products: readonly DeviceProductDefinition[]) {
  const byId: Record<string, DeviceProductDefinition> = {};
  const identityKeys = new Set<string>();

  for (const product of products) {
    if (!DEVICE_PRODUCT_ID_PATTERN.test(product.productId)) {
      throw new Error(`不正なデバイス製品IDです: ${product.productId}`);
    }

    if (byId[product.productId]) {
      throw new Error(`デバイス製品IDが重複しています: ${product.productId}`);
    }

    const identityKey = createDeviceIdentityKey(product);
    if (identityKeys.has(identityKey)) {
      throw new Error(
        `同じデバイス製品が複数のIDに登録されています: ${product.manufacturer} ${product.productName}`
      );
    }

    const identifiers = product.commerceIdentifiers;
    if (identifiers?.modelNumber !== undefined && identifiers.modelNumber.trim() === "") {
      throw new Error(`型番が空です: ${product.productId}`);
    }
    if (identifiers?.jan !== undefined && !/^(?:\d{8}|\d{13})$/.test(identifiers.jan)) {
      throw new Error(`JANは8桁または13桁の数字で指定してください: ${product.productId}`);
    }
    if (identifiers?.asin !== undefined && !/^[A-Z0-9]{10}$/.test(identifiers.asin)) {
      throw new Error(`ASINは10桁の半角英大文字・数字で指定してください: ${product.productId}`);
    }
    if (
      identifiers?.rakutenProductCode !== undefined &&
      identifiers.rakutenProductCode.trim() === ""
    ) {
      throw new Error(`楽天の商品識別情報が空です: ${product.productId}`);
    }

    byId[product.productId] = Object.freeze({
      ...product,
      ...(identifiers
        ? { commerceIdentifiers: Object.freeze({ ...identifiers }) }
        : {})
    });
    identityKeys.add(identityKey);
  }

  return Object.freeze(byId);
}

export const DEVICE_PRODUCTS_BY_ID = createProductRegistry(DEVICE_PRODUCTS);

export function getDeviceProduct(productId: string): DeviceProductDefinition | undefined {
  return DEVICE_PRODUCTS_BY_ID[productId];
}

export function isDeviceProductId(productId: string): productId is DeviceProductId {
  return getDeviceProduct(productId) !== undefined;
}

export function deviceMatchesProductDefinition(device: {
  productId: string;
  type: string;
  manufacturer: string;
  productName: string;
}): boolean {
  const product = getDeviceProduct(device.productId);
  return Boolean(
    product &&
      createDeviceIdentityKey(product) === createDeviceIdentityKey(device)
  );
}
