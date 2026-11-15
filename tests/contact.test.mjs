import assert from "node:assert/strict";
import test from "node:test";
import {
  CONTACT_LIMITS,
  processContactRequest
} from "../src/lib/contact.ts";

function createFormBody(overrides = {}) {
  return new URLSearchParams({
    type: "correction",
    name: "テスト利用者",
    replyEmail: "visitor@example.com",
    targetReference: "SHAKA / https://example.com/streamers/shaka/",
    agencyName: "サンプル事務所",
    agencyUrl: "https://agency.example.com/",
    message: "掲載情報の訂正について確認をお願いします。",
    "cf-turnstile-response": "test-token",
    ...overrides
  });
}

function createRequest(overrides = {}, options = {}) {
  const body = options.body ?? createFormBody(overrides);
  const headers = new Headers({
    "Content-Type": "application/x-www-form-urlencoded",
    Origin: "https://example.com"
  });

  for (const [name, value] of Object.entries(options.headers ?? {})) {
    if (value === null) {
      headers.delete(name);
    } else {
      headers.set(name, value);
    }
  }

  return new Request("https://example.com/api/contact", {
    method: "POST",
    headers,
    body
  });
}

function createRuntime(overrides = {}) {
  return {
    CONTACT_FORM_ENABLED: "true",
    CONTACT_TO_EMAIL: "owner@example.com",
    CONTACT_FROM_EMAIL: "contact@example.com",
    TURNSTILE_SECRET_KEY: "test-secret",
    CONTACT_EMAIL: {
      async send() {
        return { messageId: "test-message" };
      }
    },
    CONTACT_RATE_LIMITER: {
      async limit() {
        return { success: true };
      }
    },
    ...overrides
  };
}

const validTurnstile = async () => ({
  success: true,
  hostname: "example.com",
  action: "contact"
});

test("設定不足時はメールを送らず503を返す", async () => {
  let sent = false;
  const runtime = createRuntime({
    CONTACT_FORM_ENABLED: undefined,
    CONTACT_EMAIL: {
      async send() {
        sent = true;
      }
    }
  });

  const response = await processContactRequest(createRequest(), runtime, {
    verifyTurnstile: validTurnstile
  });

  assert.equal(response.status, 503);
  assert.equal(sent, false);
});

test("必須項目と文字数をサーバー側で検証する", async () => {
  let verified = false;
  const response = await processContactRequest(
    createRequest({ type: "", replyEmail: "", message: "" }),
    createRuntime(),
    {
      verifyTurnstile: async () => {
        verified = true;
        return validTurnstile();
      }
    }
  );
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.success, false);
  assert.ok(body.fieldErrors.type);
  assert.ok(body.fieldErrors.replyEmail);
  assert.ok(body.fieldErrors.message);
  assert.equal(verified, false);
});

test("訂正・削除依頼では対象情報を必須とする", async () => {
  for (const type of ["correction", "deletion"]) {
    const response = await processContactRequest(
      createRequest({ type, targetReference: "" }),
      createRuntime(),
      { verifyTurnstile: validTurnstile }
    );
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.ok(body.fieldErrors.targetReference);
  }
});

test("その他では対象情報を任意として受け付ける", async () => {
  const response = await processContactRequest(
    createRequest({ type: "other", targetReference: "" }),
    createRuntime(),
    { verifyTurnstile: validTurnstile }
  );

  assert.equal(response.status, 200);
});

test("所属事務所URLと単一行項目を検証する", async () => {
  const invalidUrlResponse = await processContactRequest(
    createRequest({ agencyUrl: "javascript:alert(1)" }),
    createRuntime(),
    { verifyTurnstile: validTurnstile }
  );
  const invalidUrlBody = await invalidUrlResponse.json();
  assert.equal(invalidUrlResponse.status, 400);
  assert.ok(invalidUrlBody.fieldErrors.agencyUrl);

  const injectionResponse = await processContactRequest(
    createRequest({ agencyName: "サンプル事務所\r\nBcc: attacker@example.com" }),
    createRuntime(),
    { verifyTurnstile: validTurnstile }
  );
  const injectionBody = await injectionResponse.json();
  assert.equal(injectionResponse.status, 400);
  assert.ok(injectionBody.fieldErrors.agencyName);

  const overLimitResponse = await processContactRequest(
    createRequest({
      targetReference: "a".repeat(501),
      agencyName: "a".repeat(121)
    }),
    createRuntime(),
    { verifyTurnstile: validTurnstile }
  );
  const overLimitBody = await overLimitResponse.json();
  assert.equal(overLimitResponse.status, 400);
  assert.ok(overLimitBody.fieldErrors.targetReference);
  assert.ok(overLimitBody.fieldErrors.agencyName);
});

test("送信先を固定し、利用者のアドレスはReply-Toだけに使用する", async () => {
  let sentMessage;
  let sendCount = 0;
  const runtime = createRuntime({
    CONTACT_EMAIL: {
      async send(message) {
        sendCount += 1;
        sentMessage = message;
        return { messageId: "test-message" };
      }
    }
  });

  const response = await processContactRequest(createRequest(), runtime, {
    verifyTurnstile: validTurnstile
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.equal(sendCount, 1);
  assert.equal(sentMessage.to, "owner@example.com");
  assert.equal(sentMessage.from.email, "contact@example.com");
  assert.equal(sentMessage.from.name, "STREAMER AGE");
  assert.equal(sentMessage.replyTo.email, "visitor@example.com");
  assert.equal(sentMessage.subject, "[STREAMER AGE] 掲載情報の訂正");
  assert.match(
    sentMessage.text,
    /対象の配信者名または掲載ページURL: SHAKA \/ https:\/\/example\.com\/streamers\/shaka\//
  );
  assert.match(sentMessage.text, /所属事務所名: サンプル事務所/);
  assert.match(
    sentMessage.text,
    /所属事務所の公式サイトURL: https:\/\/agency\.example\.com\//
  );
  assert.match(sentMessage.text, /本人確認済み情報ではありません/);
  assert.match(sentMessage.text, /掲載情報の訂正について/);
});

test("Turnstile検証に失敗した送信を拒否する", async () => {
  const response = await processContactRequest(createRequest(), createRuntime(), {
    verifyTurnstile: async () => ({ success: false })
  });

  assert.equal(response.status, 400);
});

test("送信回数の上限を超えた場合は429を返す", async () => {
  const runtime = createRuntime({
    CONTACT_RATE_LIMITER: {
      async limit({ key }) {
        assert.match(key, /^contact:[a-f0-9]{64}$/);
        assert.doesNotMatch(key, /visitor@example\.com/);
        return { success: false };
      }
    }
  });

  const response = await processContactRequest(createRequest(), runtime, {
    verifyTurnstile: validTurnstile
  });

  assert.equal(response.status, 429);
});

test("メール配送に失敗した場合は成功を返さない", async () => {
  const runtime = createRuntime({
    CONTACT_EMAIL: {
      async send() {
        throw new Error("test failure");
      }
    }
  });

  const response = await processContactRequest(createRequest(), runtime, {
    verifyTurnstile: validTurnstile
  });

  assert.equal(response.status, 502);
  assert.equal((await response.json()).success, false);
});

test("メールヘッダーに使う入力の改行と文字数超過を拒否する", async () => {
  let sendCount = 0;
  const runtime = createRuntime({
    CONTACT_EMAIL: {
      async send() {
        sendCount += 1;
      }
    }
  });

  const cases = [
    { values: { name: "利用者\r\nBcc: attacker@example.com" }, field: "name" },
    {
      values: { replyEmail: "visitor@example.com\r\nBcc: attacker@example.com" },
      field: "replyEmail"
    },
    { values: { name: "a".repeat(CONTACT_LIMITS.name + 1) }, field: "name" },
    {
      values: { message: "a".repeat(CONTACT_LIMITS.messageMax + 1) },
      field: "message"
    }
  ];

  for (const { values, field } of cases) {
    const response = await processContactRequest(
      createRequest(values),
      runtime,
      { verifyTurnstile: validTurnstile }
    );
    const body = await response.json();
    assert.equal(response.status, 400);
    assert.ok(body.fieldErrors[field]);
  }

  assert.equal(sendCount, 0);
});

test("Turnstileのhostname・action不一致と通信失敗を拒否する", async () => {
  let sendCount = 0;
  const runtime = createRuntime({
    CONTACT_EMAIL: {
      async send() {
        sendCount += 1;
      }
    }
  });
  const cases = [
    {
      verifyTurnstile: async () => ({
        success: true,
        hostname: "attacker.example",
        action: "contact"
      }),
      expectedStatus: 400
    },
    {
      verifyTurnstile: async () => ({
        success: true,
        hostname: "example.com",
        action: "other"
      }),
      expectedStatus: 400
    },
    {
      verifyTurnstile: async () => {
        throw new Error("Turnstile unavailable");
      },
      expectedStatus: 503
    }
  ];

  for (const { verifyTurnstile, expectedStatus } of cases) {
    const response = await processContactRequest(createRequest(), runtime, {
      verifyTurnstile
    });
    assert.equal(response.status, expectedStatus);
    assert.equal((await response.json()).success, false);
  }

  assert.equal(sendCount, 0);
});

test("レート制限サービスのエラー時はメールを送らず503を返す", async () => {
  let sendCount = 0;
  const runtime = createRuntime({
    CONTACT_RATE_LIMITER: {
      async limit() {
        throw new Error("rate limiter unavailable");
      }
    },
    CONTACT_EMAIL: {
      async send() {
        sendCount += 1;
      }
    }
  });

  const response = await processContactRequest(createRequest(), runtime, {
    verifyTurnstile: validTurnstile
  });

  assert.equal(response.status, 503);
  assert.equal((await response.json()).success, false);
  assert.equal(sendCount, 0);
});

test("不正または欠落したOriginを拒否する", async () => {
  let verified = 0;
  let sendCount = 0;
  const runtime = createRuntime({
    CONTACT_EMAIL: {
      async send() {
        sendCount += 1;
      }
    }
  });

  for (const origin of ["https://attacker.example", null]) {
    const response = await processContactRequest(
      createRequest({}, { headers: { Origin: origin } }),
      runtime,
      {
        verifyTurnstile: async () => {
          verified += 1;
          return validTurnstile();
        }
      }
    );
    assert.equal(response.status, 403);
  }

  assert.equal(verified, 0);
  assert.equal(sendCount, 0);
});

test("ハニーポット入力は外部処理を呼ばず一般的な成功応答を返す", async () => {
  let verified = 0;
  let limited = 0;
  let sent = 0;
  const runtime = createRuntime({
    CONTACT_RATE_LIMITER: {
      async limit() {
        limited += 1;
        return { success: true };
      }
    },
    CONTACT_EMAIL: {
      async send() {
        sent += 1;
      }
    }
  });

  const response = await processContactRequest(
    createRequest({ website: "https://spam.example/" }),
    runtime,
    {
      verifyTurnstile: async () => {
        verified += 1;
        return validTurnstile();
      }
    }
  );
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.equal(verified, 0);
  assert.equal(limited, 0);
  assert.equal(sent, 0);
});

test("Content-Lengthの有無にかかわらず上限内の本文を受け付ける", async () => {
  let sent = 0;
  const runtime = createRuntime({
    CONTACT_EMAIL: {
      async send() {
        sent += 1;
      }
    }
  });
  const body = createFormBody({ type: "other", targetReference: "" });
  const bodyText = body.toString();
  const byteLength = new TextEncoder().encode(bodyText).byteLength;

  const withoutLength = createRequest(
    {},
    { body, headers: { "Content-Length": null } }
  );
  assert.equal(withoutLength.headers.get("Content-Length"), null);
  const withoutLengthResponse = await processContactRequest(withoutLength, runtime, {
    verifyTurnstile: validTurnstile
  });

  const withLengthResponse = await processContactRequest(
    createRequest({}, {
      body: bodyText,
      headers: { "Content-Length": String(byteLength) }
    }),
    runtime,
    { verifyTurnstile: validTurnstile }
  );

  assert.equal(withoutLengthResponse.status, 200);
  assert.equal(withLengthResponse.status, 200);
  assert.equal(sent, 2);
});

test("ブラウザと同じmultipart/form-dataの正常な問い合わせを受け付ける", async () => {
  let sent = 0;
  const runtime = createRuntime({
    CONTACT_EMAIL: {
      async send() {
        sent += 1;
      }
    }
  });
  const formData = new FormData();
  for (const [name, value] of createFormBody()) {
    formData.set(name, value);
  }
  const request = createRequest({}, {
    body: formData,
    headers: {
      "Content-Type": null,
      "Content-Length": null
    }
  });

  assert.match(
    request.headers.get("Content-Type") ?? "",
    /^multipart\/form-data;\s*boundary=/
  );
  const response = await processContactRequest(request, runtime, {
    verifyTurnstile: validTurnstile
  });

  assert.equal(response.status, 200);
  assert.equal(sent, 1);
});

test("本文は上限ちょうどを許可し、宣言値または実本文の1バイト超過を拒否する", async () => {
  let verified = 0;
  let sent = 0;
  const runtime = createRuntime({
    CONTACT_EMAIL: {
      async send() {
        sent += 1;
      }
    }
  });
  const dependencies = {
    verifyTurnstile: async () => {
      verified += 1;
      return validTurnstile();
    }
  };
  const baseBody = createFormBody({ type: "other", targetReference: "" }).toString();
  const paddingPrefix = `${baseBody}&padding=`;
  const prefixBytes = new TextEncoder().encode(paddingPrefix).byteLength;
  const exactLimitBody = `${paddingPrefix}${"a".repeat(
    CONTACT_LIMITS.requestBytes - prefixBytes
  )}`;
  const oneByteOverBody = `${exactLimitBody}a`;

  assert.equal(
    new TextEncoder().encode(exactLimitBody).byteLength,
    CONTACT_LIMITS.requestBytes
  );
  assert.equal(
    new TextEncoder().encode(oneByteOverBody).byteLength,
    CONTACT_LIMITS.requestBytes + 1
  );

  const exactLimit = await processContactRequest(
    createRequest({}, {
      body: exactLimitBody,
      headers: { "Content-Length": null }
    }),
    runtime,
    dependencies
  );

  const declaredTooLarge = await processContactRequest(
    createRequest({}, {
      headers: { "Content-Length": String(CONTACT_LIMITS.requestBytes + 1) }
    }),
    runtime,
    dependencies
  );
  const actualTooLarge = await processContactRequest(
    createRequest({}, {
      body: oneByteOverBody,
      headers: { "Content-Length": null }
    }),
    runtime,
    dependencies
  );
  const invalidLength = await processContactRequest(
    createRequest({}, { headers: { "Content-Length": "invalid" } }),
    runtime,
    dependencies
  );

  assert.equal(exactLimit.status, 200);
  assert.equal(declaredTooLarge.status, 413);
  assert.equal(actualTooLarge.status, 413);
  assert.equal(invalidLength.status, 400);
  assert.equal(verified, 1);
  assert.equal(sent, 1);
});

test("不正なContent-Typeと解析不能なフォームを拒否する", async () => {
  let sent = 0;
  const runtime = createRuntime({
    CONTACT_EMAIL: {
      async send() {
        sent += 1;
      }
    }
  });

  const invalidType = await processContactRequest(
    createRequest({}, { headers: { "Content-Type": "text/plain" } }),
    runtime,
    { verifyTurnstile: validTurnstile }
  );
  const disguisedType = await processContactRequest(
    createRequest({}, {
      headers: { "Content-Type": "application/x-www-form-urlencoded-evil" }
    }),
    runtime,
    { verifyTurnstile: validTurnstile }
  );
  const invalidMultipart = await processContactRequest(
    createRequest({}, {
      body: "not-multipart",
      headers: { "Content-Type": "multipart/form-data" }
    }),
    runtime,
    { verifyTurnstile: validTurnstile }
  );

  assert.equal(invalidType.status, 415);
  assert.equal(disguisedType.status, 415);
  assert.equal(invalidMultipart.status, 400);
  assert.equal(sent, 0);
});

test("API応答はキャッシュを禁止し秘密情報を含めない", async () => {
  const response = await processContactRequest(createRequest(), createRuntime(), {
    verifyTurnstile: validTurnstile
  });
  const responseText = await response.text();

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.doesNotMatch(responseText, /owner@example\.com|contact@example\.com|test-secret/);
});
