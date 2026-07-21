<div align="right">

[![简体中文](https://img.shields.io/badge/语言-简体中文-f6c945?style=for-the-badge)](./README.md)
[![English](https://img.shields.io/badge/Language-English-24292f?style=for-the-badge)](./README.en.md)

</div>

# MixLab Drink Notebook

MixLab is a bilingual web project for collecting convenience-store drink combinations. Visitors can browse recipes and see the original retail packaging for each ingredient. Signed-in users can add their own combinations and record tasting ratings.

**Live site: [mixlab-drink-notes.pht358501.chatgpt.site](https://mixlab-drink-notes.pht358501.chatgpt.site)**

## Features

- 16 convenience-store drink recipes and inspirations
- Filters for milky tea, fruit soda, cultured-milk tea, and refreshing tea
- Ingredient ratios, preparation steps, and tasting notes
- Simplified Chinese and English interface
- Read-only recipe browsing for guests
- Custom recipes and ratings for signed-in users
- Original retail package images on recipe cards
- Responsive desktop and mobile layouts

> The current sign-in flow is provided by ChatGPT Sites. Custom recipes and ratings are stored in the current browser. The project can later move to Firebase Authentication and a cloud database for email registration and cross-device syncing.

## Technology

- [React 19](https://react.dev/)
- [Next.js 16](https://nextjs.org/)
- [Vinext](https://github.com/cloudflare/vinext)
- [Vite](https://vite.dev/)
- [Cloudflare Workers](https://workers.cloudflare.com/)-compatible runtime
- TypeScript

## Run Locally

### Requirements

- Node.js 22.13.0 or newer
- npm

### Install and start

```bash
git clone https://github.com/Will-P77/mixlab.git
cd mixlab
npm install
npm run dev
```

Open the local URL printed in the terminal after the development server starts.

## Commands

```bash
npm run dev          # Start the local development server
npm run build        # Create a production build
npm test             # Build and run tests
npm run lint         # Check code quality
npm run db:generate  # Generate Drizzle migrations after schema changes
```

## Project Structure

```text
MixLab/
├── app/                 # Pages, styles, and API routes
├── public/
│   ├── ingredients/     # Ingredient images
│   └── packages/        # Original retail package images
├── tests/               # Rendering and session tests
├── worker/              # Cloudflare Worker entry point
├── db/                  # Optional database schema
├── examples/d1/         # Cloudflare D1 example
├── package.json
└── vite.config.ts
```

## Authentication and Data

The current production site uses identity headers supplied by ChatGPT Sites:

- Guests can only browse recipes.
- Signed-in users can add recipes and ratings.
- Custom data is stored in browser `localStorage`.
- Local data does not automatically sync after clearing browser storage or changing devices.

For an independent Cloudflare Workers deployment, Firebase Authentication can provide email registration, sign-in, verification emails, and password resets. Firestore or Cloudflare D1 can provide persistent user data.

## Image Policy

Recipe cards prioritize the original bottle, can, carton, cup, or packet that shoppers can recognize on a convenience-store shelf. Fresh lychee is currently the only unpackaged ingredient photograph.

The Daily C grape juice image has been cleaned of Tmall branding, prices, discounts, mascot artwork, shopping-cart artwork, and other retailer promotions.

## Retail Package Photo Credits

- Master Kong Jasmine Clear Tea series — [Cozy Nook Asian Grocer](https://cozy-nook.com.au/products/master-kong-iced-tea-series-500ml)
- Master Kong Green Tea — [Asian Grocery UK](https://asiangroceryuk.com/products/master-kong-green-tea-500ml)
- Oriental Leaf jasmine and black tea — [Weee! jasmine tea](https://www.sayweee.com/zh/product/Oriental-Leaf-Jasmine-Tea-500ml/2989064), [Weee! black tea](https://www.sayweee.com/zh/product/Oriental-Leaf-Black-Tea-500ml/2989065)
- Wangzai Milk — [Want Want flagship store](https://mall.iopenmall.tw/023053/index.php?action=product_detail&prod_no=P2305302988490)
- Daily C grape and orange juice — [Archived product listing](https://tao.hooos.com/goods_yWnVZRtRt2dge6QWPHo52TvtA-rkOPPMuM7kdw4jwcX.html), [Suning](https://product.suning.com/0000000000/12423638723.html)
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

## License and Usage

The project code may be used for learning and personal projects. Product names, trademarks, and package imagery remain the property of their respective brands and image sources.
