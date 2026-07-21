<div align="right">

[![简体中文](https://img.shields.io/badge/语言-简体中文-f6c945?style=for-the-badge)](./README.md)
[![English](https://img.shields.io/badge/Language-English-24292f?style=for-the-badge)](./README.en.md)

</div>

# MixLab 饮料实验簿

MixLab 是一个收集便利店饮料搭配的中英双语 Web 项目。你可以浏览饮料配方、查看原材料的便利店商品包装，并在登录后添加自己的搭配和记录品尝评分。

**在线体验：[mixlab-drink-notes.pht358501.chatgpt.site](https://mixlab-drink-notes.pht358501.chatgpt.site)**

## 功能

- 收录 16 份便利店饮料搭配灵感
- 按奶香茶饮、果味汽水、乳酸茶和清爽茶饮筛选
- 展示配方比例、制作步骤和饮用提示
- 支持简体中文与英文切换
- 访客可以查看全部公开配方
- 登录用户可以添加自定义配方并记录评分
- 配方卡使用便利店可购买商品的原包装图片
- 适配桌面和移动设备

> 当前登录由 ChatGPT Sites 提供；自定义配方和评分保存在当前浏览器中。项目后续可以迁移到 Firebase Authentication 和云端数据库，实现邮箱注册与跨设备同步。

## 技术栈

- [React 19](https://react.dev/)
- [Next.js 16](https://nextjs.org/)
- [Vinext](https://github.com/cloudflare/vinext)
- [Vite](https://vite.dev/)
- [Cloudflare Workers](https://workers.cloudflare.com/) 兼容运行环境
- TypeScript

## 本地运行

### 环境要求

- Node.js 22.13.0 或更高版本
- npm

### 安装与启动

```bash
git clone https://github.com/Will-P77/mixlab.git
cd mixlab
npm install
npm run dev
```

开发服务器启动后，根据终端显示的本地地址访问网站。

## 常用命令

```bash
npm run dev          # 启动本地开发环境
npm run build        # 创建生产构建
npm test             # 构建并运行测试
npm run lint         # 检查代码规范
npm run db:generate  # 修改数据库结构后生成 Drizzle 迁移
```

## 项目结构

```text
MixLab/
├── app/                 # 页面、样式和 API 路由
├── public/
│   ├── ingredients/     # 原材料图片
│   └── packages/        # 便利店商品原包装图片
├── tests/               # 渲染与会话测试
├── worker/              # Cloudflare Worker 入口
├── db/                  # 可选数据库结构
├── examples/d1/         # Cloudflare D1 示例
├── package.json
└── vite.config.ts
```

## 登录和数据

当前线上版本通过 ChatGPT Sites 注入的身份信息区分访客和登录用户：

- 访客只能浏览配方。
- 登录用户可以添加配方和评分。
- 自定义数据使用浏览器 `localStorage` 保存。
- 清除浏览器数据或更换设备后，本地数据不会自动同步。

计划部署到独立 Cloudflare Workers 环境时，可以使用 Firebase Authentication 提供邮箱注册、登录、验证邮件和密码重置，并使用 Firestore 或 Cloudflare D1 保存用户数据。

## 图片说明

配方卡优先使用购物者能在便利店货架上辨认的原装瓶、罐、盒、杯或包装。鲜荔枝是目前唯一使用未包装食材照片的配方材料。

味全每日 C 葡萄汁图片已经移除天猫超市、价格、折扣、吉祥物和购物车等促销元素。

## 商品图片来源

- 康师傅茉莉清茶系列 — [Cozy Nook Asian Grocer](https://cozy-nook.com.au/products/master-kong-iced-tea-series-500ml)
- 康师傅绿茶 — [Asian Grocery UK](https://asiangroceryuk.com/products/master-kong-green-tea-500ml)
- 东方树叶茉莉花茶与红茶 — [Weee! 茉莉花茶](https://www.sayweee.com/zh/product/Oriental-Leaf-Jasmine-Tea-500ml/2989064)、[Weee! 红茶](https://www.sayweee.com/zh/product/Oriental-Leaf-Black-Tea-500ml/2989065)
- 旺仔牛奶 — [旺旺旗舰店](https://mall.iopenmall.tw/023053/index.php?action=product_detail&prod_no=P2305302988490)
- 味全每日 C 葡萄汁与橙汁 — [商品页存档](https://tao.hooos.com/goods_yWnVZRtRt2dge6QWPHo52TvtA-rkOPPMuM7kdw4jwcX.html)、[苏宁](https://product.suning.com/0000000000/12423638723.html)
- 茶π西柚茉莉花茶 — [Umall](https://www.umall.com.au/products/nongfu-spring-tea-pi-grapefruit-jasmine-tea-500ml)
- 三得利乌龙茶 — [Sing Kee Foods](https://singkeefoods.co.uk/gb/drinks/6956-suntory-oolong-tea-sugar-free-500ml.html)
- 水溶 C100 血橙味 — [Exotic Snacks Company](https://exoticsnacks.com/products/water-soluble-c100-fruit-juice-vitamin-c-supplement-445ml)
- 伊利纯牛奶 — [MzSale](https://www.mzsale.com/goods.php?id=133842)
- 奥利奥原味 — [American Uncle](https://americanuncleshop.fr/products/oreo-original-da-116g)
- 美汁源汁汁桃桃 — [美汁源中国](https://www.coca-cola.com/cn/zh/brands/minute-maid)
- 哈根达斯香草冰淇淋 — [FairPrice](https://www.fairprice.com.sg/product/haagen-dazs-mini-cups-ice-cream-vanilla-100ml-13129037)
- 菲诺厚椰乳 — [Topfoo](https://www.topfoo.com/zh/products/fn-coconut-milk-12boxes-1l-case)
- UCC BLACK 咖啡 — [Buy123](https://www.buy123.com.tw/site/sku/2187945)
- 雪碧 — [Powell's Supermarkets](https://powellsnl.ca/product/sprite-AH8pwxu6wm/)
- 养乐多 — [LuLu Hypermarket UAE](https://gcc.luluhypermarket.com/en-ae/yakult-milk-drink-5-x-80-ml/p/792359/)
- 鲜荔枝 — [The Matter of Food / Unsplash](https://unsplash.com/photos/brown-and-pink-round-fruit-on-white-table-9TboYEv1uZo)

## 许可与使用

项目代码可用于学习和个人项目。商品名称、商标和包装图片的权利归各自品牌及图片来源方所有。
