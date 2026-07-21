# MixLab 饮料实验簿

一个收集便利店饮料搭配、查看配方并记录个人评分的中英双语网站。访客可浏览公开配方；登录后可添加自定义配方和保存评分。

A clean full-stack starter running on
[vinext](https://github.com/cloudflare/vinext), with optional Cloudflare D1 and
Drizzle support.

## Prerequisites

- Node.js `>=22.13.0`

## Quick Start

```bash
npm install
npm run dev
npm run build
```

This starter does not use `wrangler.jsonc`.

## Included Shape

- edit site code under `app/`
- `.openai/hosting.json` declares optional Sites D1 and R2 bindings
- `vite.config.ts` simulates declared bindings for local development
- `db/schema.ts` starts intentionally empty
- `examples/d1/` contains an optional D1 example surface
- `drizzle.config.ts` supports local migration generation when needed

## Workspace Auth Headers

OpenAI workspace sites can read the current user's email from
`oai-authenticated-user-email`.

SIWC-authenticated workspace sites may also receive
`oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty
`name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by
`oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Optional Dispatch-Owned ChatGPT Sign-In

Import the ready-to-use helpers from `app/chatgpt-auth.ts` when the site needs
optional or required ChatGPT sign-in:

- Use `getChatGPTUser()` for optional signed-in UI.
- Use `requireChatGPTUser(returnTo)` for server-rendered pages that should send
  anonymous visitors through Sign in with ChatGPT.
- Use `chatGPTSignInPath(returnTo)` and `chatGPTSignOutPath(returnTo)` for
  browser links or actions.
- Pass a same-origin relative `returnTo` path for the destination after sign-in
  or sign-out. The helper validates and safely encodes it.
- Mark protected pages with `export const dynamic = "force-dynamic"` because
  they depend on per-request identity headers.

Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, the
OAuth cookies, and identity header injection. Do not implement app routes for
those reserved paths. Routes that do not import and call the helper remain
anonymous-compatible.

SIWC establishes identity only; it does not prove workspace membership. Use the
Sites hosting platform's access policy controls for workspace-wide restrictions,
or enforce explicit server-side membership or allowlist checks.

Use SIWC for account pages, user-specific dashboards, saved records, and write
actions tied to the current ChatGPT user. Leave public content anonymous.

## Useful Commands

- `npm run dev`: start local development
- `npm run build`: verify the vinext build output
- `npm test`: build the starter and verify its rendered loading skeleton
- `npm run db:generate`: generate Drizzle migrations after schema changes

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started/d1-new)

## Retail Package Photo Credits

Recipe cards use the original bottle, can, carton, cup, or packet that a shopper would recognize on a convenience-store shelf. Fresh lychee is the only unpackaged ingredient photo.

- Master Kong Jasmine Clear Tea and tea series — [Cozy Nook Asian Grocer](https://cozy-nook.com.au/products/master-kong-iced-tea-series-500ml)
- Master Kong Green Tea — [Asian Grocery UK](https://asiangroceryuk.com/products/master-kong-green-tea-500ml)
- Oriental Leaf jasmine and black tea — [Weee! jasmine tea](https://www.sayweee.com/zh/product/Oriental-Leaf-Jasmine-Tea-500ml/2989064) and [Weee! black tea](https://www.sayweee.com/zh/product/Oriental-Leaf-Black-Tea-500ml/2989065)
- Wangzai Milk — [Want Want flagship store](https://mall.iopenmall.tw/023053/index.php?action=product_detail&prod_no=P2305302988490)
- Daily C grape and orange juice — [Tmall listing mirror](https://tao.hooos.com/goods_yWnVZRtRt2dge6QWPHo52TvtA-rkOPPMuM7kdw4jwcX.html) and [Suning](https://product.suning.com/0000000000/12423638723.html)
- Tea Pi Grapefruit Jasmine Tea — [Umall](https://www.umall.com.au/products/nongfu-spring-tea-pi-grapefruit-jasmine-tea-500ml)
- Suntory Oolong Tea — [Sing Kee Foods](https://singkeefoods.co.uk/gb/drinks/6956-suntory-oolong-tea-sugar-free-500ml.html)
- Water Soluble C100 Blood Orange — [Exotic Snacks Company](https://exoticsnacks.com/products/water-soluble-c100-fruit-juice-vitamin-c-supplement-445ml)
- Yili Pure Milk — [MzSale](https://www.mzsale.com/goods.php?id=133842)
- Oreo Original — [American Uncle](https://americanuncleshop.fr/products/oreo-original-da-116g)
- Minute Maid Juicy Peach — [Minute Maid China](https://www.coca-cola.com/cn/zh/brands/minute-maid)
- Häagen-Dazs Vanilla — [FairPrice](https://www.fairprice.com.sg/product/haagen-dazs-mini-cups-ice-cream-vanilla-100ml-13129037)
- Fino Thick Coconut Milk — [Topfoo](https://www.topfoo.com/zh/products/fn-coconut-milk-12boxes-1l-case)
- UCC BLACK coffee — [Buy123](https://www.buy123.com.tw/site/sku/2187945)
- Sprite — [Powell's Supermarkets](https://powellsnl.ca/product/sprite-AH8pwxu6wm/)
- Yakult — [LuLu Hypermarket UAE](https://gcc.luluhypermarket.com/en-ae/yakult-milk-drink-5-x-80-ml/p/792359/)
- Fresh lychee — [The Matter of Food / Unsplash](https://unsplash.com/photos/brown-and-pink-round-fruit-on-white-table-9TboYEv1uZo)
