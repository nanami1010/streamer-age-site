export const CONTACT_TYPE_LABELS = {
  correction: "掲載情報の訂正",
  deletion: "削除依頼",
  other: "その他"
} as const;

export const CONTACT_LIMITS = {
  name: 80,
  email: 254,
  messageMin: 10,
  messageMax: 4000,
  requestBytes: 32_768,
  turnstileToken: 2048
} as const;

const CONTACT_ACTION = "contact";
const EMAIL_PATTERN = /^[^\s@\r\n]+@[^\s@\r\n]+\.[^\s@\r\n]+$/;

type ContactType = keyof typeof CONTACT_TYPE_LABELS;

interface ContactInput {
  type: ContactType;
  name: string;
  replyEmail: string;
  message: string;
  turnstileToken: string;
  website: string;
}

interface EmailAddress {
  email: string;
  name?: string;
}

export interface ContactEmailMessage {
  to: string;
  from: EmailAddress;
  replyTo: EmailAddress;
  subject: string;
  text: string;
}

interface ContactEmailBinding {
  send(message: ContactEmailMessage): Promise<unknown>;
}

interface ContactRateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

export interface ContactRuntime {
  CONTACT_FORM_ENABLED?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
  TURNSTILE_SECRET_KEY?: string;
  CONTACT_EMAIL?: ContactEmailBinding;
  CONTACT_RATE_LIMITER?: ContactRateLimiter;
}

interface TurnstileResult {
  success: boolean;
  hostname?: string;
  action?: string;
}

interface ContactDependencies {
  verifyTurnstile?: (
    token: string,
    secret: string
  ) => Promise<TurnstileResult>;
}

function jsonResponse(
  status: number,
  body: Record<string, unknown>
): Response {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store"
    }
  });
}

function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isEmail(value: string): boolean {
  return value.length <= CONTACT_LIMITS.email && EMAIL_PATTERN.test(value);
}

function hasCompleteConfiguration(runtime: ContactRuntime): boolean {
  return Boolean(
    runtime.CONTACT_FORM_ENABLED === "true" &&
      runtime.TURNSTILE_SECRET_KEY &&
      runtime.CONTACT_TO_EMAIL &&
      runtime.CONTACT_FROM_EMAIL &&
      isEmail(runtime.CONTACT_TO_EMAIL) &&
      isEmail(runtime.CONTACT_FROM_EMAIL) &&
      runtime.CONTACT_EMAIL &&
      runtime.CONTACT_RATE_LIMITER
  );
}

function validateInput(formData: FormData): {
  input: ContactInput | null;
  fieldErrors: Record<string, string>;
} {
  const input = {
    type: readText(formData, "type"),
    name: readText(formData, "name"),
    replyEmail: readText(formData, "replyEmail"),
    message: readText(formData, "message").replace(/\r\n?/g, "\n"),
    turnstileToken: readText(formData, "cf-turnstile-response"),
    website: readText(formData, "website")
  };
  const fieldErrors: Record<string, string> = {};

  if (!(input.type in CONTACT_TYPE_LABELS)) {
    fieldErrors.type = "問い合わせの種類を選択してください。";
  }
  if (input.name.length > CONTACT_LIMITS.name || /[\r\n\0]/.test(input.name)) {
    fieldErrors.name = `お名前は${CONTACT_LIMITS.name}文字以内で入力してください。`;
  }
  if (!isEmail(input.replyEmail)) {
    fieldErrors.replyEmail = "返信先メールアドレスを正しく入力してください。";
  }
  if (
    input.message.length < CONTACT_LIMITS.messageMin ||
    input.message.length > CONTACT_LIMITS.messageMax ||
    input.message.includes("\0")
  ) {
    fieldErrors.message = `問い合わせ内容は${CONTACT_LIMITS.messageMin}〜${CONTACT_LIMITS.messageMax}文字で入力してください。`;
  }
  if (
    !input.turnstileToken ||
    input.turnstileToken.length > CONTACT_LIMITS.turnstileToken
  ) {
    fieldErrors.turnstile = "確認操作を完了してください。";
  }

  return {
    input:
      Object.keys(fieldErrors).length === 0
        ? (input as ContactInput)
        : null,
    fieldErrors
  };
}

async function verifyTurnstile(
  token: string,
  secret: string
): Promise<TurnstileResult> {
  const body = new FormData();
  body.set("secret", secret);
  body.set("response", token);
  body.set("idempotency_key", crypto.randomUUID());

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body
    }
  );

  if (!response.ok) return { success: false };
  return (await response.json()) as TurnstileResult;
}

async function hashRateLimitKey(replyEmail: string): Promise<string> {
  const bytes = new TextEncoder().encode(replyEmail.toLowerCase());
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const hash = Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");

  return `contact:${hash}`;
}

function buildEmail(input: ContactInput, runtime: ContactRuntime): ContactEmailMessage {
  const typeLabel = CONTACT_TYPE_LABELS[input.type];
  const name = input.name || "未入力";

  return {
    to: runtime.CONTACT_TO_EMAIL!,
    from: {
      email: runtime.CONTACT_FROM_EMAIL!,
      name: "STREAMER DB"
    },
    replyTo: {
      email: input.replyEmail,
      ...(input.name ? { name: input.name } : {})
    },
    subject: `[STREAMER DB] ${typeLabel}`,
    text: [
      `問い合わせの種類: ${typeLabel}`,
      `お名前: ${name}`,
      `返信先メールアドレス: ${input.replyEmail}`,
      "",
      "問い合わせ内容:",
      input.message
    ].join("\n")
  };
}

export async function processContactRequest(
  request: Request,
  runtime: ContactRuntime,
  dependencies: ContactDependencies = {}
): Promise<Response> {
  if (!hasCompleteConfiguration(runtime)) {
    return jsonResponse(503, {
      success: false,
      message: "現在、問い合わせの送信機能は準備中です。"
    });
  }

  const requestUrl = new URL(request.url);
  const origin = request.headers.get("Origin");
  if (origin && origin !== requestUrl.origin) {
    return jsonResponse(403, {
      success: false,
      message: "このページから送信してください。"
    });
  }

  const contentLength = Number(request.headers.get("Content-Length") ?? 0);
  if (contentLength > CONTACT_LIMITS.requestBytes) {
    return jsonResponse(413, {
      success: false,
      message: "入力内容が長すぎます。"
    });
  }

  const contentType = request.headers.get("Content-Type") ?? "";
  if (
    !contentType.startsWith("multipart/form-data") &&
    !contentType.startsWith("application/x-www-form-urlencoded")
  ) {
    return jsonResponse(415, {
      success: false,
      message: "送信形式を確認してください。"
    });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonResponse(400, {
      success: false,
      message: "入力内容を読み取れませんでした。"
    });
  }

  const { input, fieldErrors } = validateInput(formData);
  if (!input) {
    return jsonResponse(400, {
      success: false,
      message: "入力内容をご確認ください。",
      fieldErrors
    });
  }

  if (input.website) {
    return jsonResponse(200, {
      success: true,
      message: "お問い合わせを受け付けました。"
    });
  }

  let turnstileResult: TurnstileResult;
  try {
    const verifier = dependencies.verifyTurnstile ?? verifyTurnstile;
    turnstileResult = await verifier(
      input.turnstileToken,
      runtime.TURNSTILE_SECRET_KEY!
    );
  } catch {
    return jsonResponse(503, {
      success: false,
      message: "確認処理を完了できませんでした。時間をおいて再度お試しください。"
    });
  }

  if (
    !turnstileResult.success ||
    turnstileResult.action !== CONTACT_ACTION ||
    turnstileResult.hostname !== requestUrl.hostname
  ) {
    return jsonResponse(400, {
      success: false,
      message: "確認に失敗しました。確認操作をやり直してください。"
    });
  }

  try {
    const rateLimitKey = await hashRateLimitKey(input.replyEmail);
    const rateLimit = await runtime.CONTACT_RATE_LIMITER!.limit({
      key: rateLimitKey
    });
    if (!rateLimit.success) {
      return jsonResponse(429, {
        success: false,
        message: "短時間の送信回数が上限に達しました。時間をおいて再度お試しください。"
      });
    }
  } catch {
    return jsonResponse(503, {
      success: false,
      message: "現在送信できません。時間をおいて再度お試しください。"
    });
  }

  try {
    await runtime.CONTACT_EMAIL!.send(buildEmail(input, runtime));
  } catch {
    return jsonResponse(502, {
      success: false,
      message: "送信できませんでした。時間をおいて再度お試しください。"
    });
  }

  return jsonResponse(200, {
    success: true,
    message: "お問い合わせを受け付けました。"
  });
}
