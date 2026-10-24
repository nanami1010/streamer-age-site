import assert from "node:assert/strict";
import test from "node:test";
import { processContactRequest } from "../src/lib/contact.ts";

function createRequest(overrides = {}) {
  const body = new URLSearchParams({
    type: "correction",
    name: "テスト利用者",
    replyEmail: "visitor@example.com",
    message: "掲載情報の訂正について確認をお願いします。",
    "cf-turnstile-response": "test-token",
    ...overrides
  });

  return new Request("https://example.com/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Origin: "https://example.com"
    },
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
    createRequest({ replyEmail: "invalid", message: "短い" }),
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
  assert.ok(body.fieldErrors.replyEmail);
  assert.ok(body.fieldErrors.message);
  assert.equal(verified, false);
});

test("送信先を固定し、利用者のアドレスはReply-Toだけに使用する", async () => {
  let sentMessage;
  const runtime = createRuntime({
    CONTACT_EMAIL: {
      async send(message) {
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
  assert.equal(sentMessage.to, "owner@example.com");
  assert.equal(sentMessage.from.email, "contact@example.com");
  assert.equal(sentMessage.replyTo.email, "visitor@example.com");
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
