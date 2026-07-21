import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

async function requestSession(headers = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("session-test", `${process.pid}-${Date.now()}-${Math.random()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/api/session", { headers }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the MixLab product shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /混点 MixLab/);
  assert.match(html, /今天，混点什么？/);
  assert.match(html, /茉莉清茶/);
  assert.match(html, /葡萄茶云乌龙/);
  assert.match(html, /冰摇葡萄乌龙/);
  assert.match(html, /16<\/b><span>份网络灵感/);
  assert.match(html, /\/packages\/masterkong-jasmine\.webp/);
  assert.match(html, /\/packages\/wangzai-milk\.webp/);
  assert.match(html, /\/packages\/dailyc-grape-clean\.webp/);
  assert.match(html, /康师傅茉莉清茶/);
  assert.match(html, /便利店商品原包装/);
  assert.doesNotMatch(html, /\/drinks\//);
  assert.doesNotMatch(html, /\/ingredients\/(?:tea|milk|grapes)\.jpg/);
  assert.doesNotMatch(html, /\/packages\/dailyc-grape\.webp/);
  assert.match(html, /Switch to English/);
  assert.match(html, /\/signin-with-chatgpt\?return_to=%2F/);
  assert.match(html, /当前为访客只读模式/);
  assert.match(html, /登录后可评分并保存记录/);
  assert.doesNotMatch(html, /贴一张自己的配方/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("session endpoint distinguishes guests and signed-in visitors", async () => {
  const guestResponse = await requestSession();
  assert.deepEqual(await guestResponse.json(), { user: null });

  const signedInResponse = await requestSession({
    "oai-authenticated-user-email": "mixer@example.com",
    "oai-authenticated-user-full-name": "Mix%20Tester",
    "oai-authenticated-user-full-name-encoding": "percent-encoded-utf-8",
  });
  assert.deepEqual(await signedInResponse.json(), {
    user: {
      displayName: "Mix Tester",
      email: "mixer@example.com",
      fullName: "Mix Tester",
    },
  });
});
