"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Category = "奶香茶饮" | "果味汽水" | "乳酸茶" | "清爽茶饮" | "我的配方";
type Accent = "yellow" | "blue" | "red" | "green" | "purple";
type Locale = "zh" | "en";

type SessionUser = {
  displayName: string;
  email: string;
  fullName: string | null;
};

type Mix = {
  id: string;
  name: string;
  ingredients: string[];
  ratio: string;
  category: Category;
  note: string;
  steps: string[];
  sourceLabel: string;
  sourceUrl?: string;
  accent: Accent;
  isCustom?: boolean;
};

type Rating = {
  taste: number;
  sweetness: number;
  freshness: number;
  surprise: number;
  remake: boolean;
  note: string;
  updatedAt: string;
};

const MIXES_KEY = "mixlab-custom-mixes-v1";
const RATINGS_KEY = "mixlab-ratings-v1";
const LOCALE_KEY = "mixlab-locale-v1";

const featuredMixes: Mix[] = [
  {
    id: "jasmine-wangzai",
    name: "茉莉清茶 ＋ 旺仔牛奶",
    ingredients: ["康师傅茉莉清茶", "旺仔牛奶"],
    ratio: "茶 : 奶 = 2 : 1",
    category: "奶香茶饮",
    note: "像一杯花香更干净的轻乳茶，冰一点会更利落。",
    steps: ["杯中加满冰块", "倒入 2 份茉莉花茶", "沿杯壁加入 1 份旺仔牛奶，轻轻搅匀"],
    sourceLabel: "网络灵感 · 新浪河南美食",
    sourceUrl: "https://henan.sina.cn/zmt/2021-08-26/zimeiti-ikqciyzm3689197.d.html",
    accent: "yellow",
  },
  {
    id: "sprite-grape-c",
    name: "雪碧 ＋ 味全每日C葡萄",
    ingredients: ["雪碧", "味全每日C葡萄味"],
    ratio: "汽水 : 果汁 = 1 : 1",
    category: "果味汽水",
    note: "葡萄气泡感拉满，甜度较高，建议一定加冰。",
    steps: ["装半杯冰块", "先倒葡萄汁", "慢慢补入雪碧，保留气泡"],
    sourceLabel: "发起人灵感",
    accent: "purple",
  },
  {
    id: "green-tea-yakult",
    name: "绿茶 ＋ 养乐多",
    ingredients: ["康师傅绿茶", "养乐多"],
    ratio: "茶 : 养乐多 = 3 : 2",
    category: "乳酸茶",
    note: "经典酸甜乳酸茶，茶香能把乳酸菌饮料的甜度压下来。",
    steps: ["杯中加冰", "倒入 3 份冰绿茶", "加入 2 份养乐多，搅匀后尽快喝"],
    sourceLabel: "网络灵感 · 新浪河南美食",
    sourceUrl: "https://henan.sina.cn/zmt/2021-08-26/zimeiti-ikqciyzm3689197.d.html",
    accent: "green",
  },
  {
    id: "grapefruit-tea-yakult",
    name: "西柚茉莉茶 ＋ 养乐多",
    ingredients: ["茶π西柚茉莉花茶", "养乐多"],
    ratio: "茶 : 养乐多 = 3 : 2",
    category: "乳酸茶",
    note: "西柚的微苦让酸甜更立体，喜欢清爽口感可把茶加到 2:1。",
    steps: ["杯中加入冰块", "倒入西柚茉莉花茶", "加入养乐多后搅匀"],
    sourceLabel: "网络灵感 · 新浪河南美食",
    sourceUrl: "https://henan.sina.cn/zmt/2021-08-26/zimeiti-ikqciyzm3689197.d.html",
    accent: "red",
  },
  {
    id: "oolong-fresh-milk",
    name: "无糖乌龙 ＋ 纯牛奶",
    ingredients: ["三得利乌龙茶", "伊利纯牛奶"],
    ratio: "茶 : 奶 = 2 : 1",
    category: "奶香茶饮",
    note: "不是厚重奶茶，更像带柔和奶香的冷泡乌龙。",
    steps: ["先把乌龙茶冰透", "倒入 2 份乌龙茶", "加入 1 份鲜牛奶，摇匀"],
    sourceLabel: "网络灵感 · 新浪河南美食",
    sourceUrl: "https://henan.sina.cn/zmt/2021-08-26/zimeiti-ikqciyzm3689197.d.html",
    accent: "blue",
  },
  {
    id: "lychee-sprite-yakult",
    name: "荔枝 ＋ 雪碧 ＋ 养乐多",
    ingredients: ["鲜荔枝 6 颗", "雪碧 1 罐", "养乐多 1 瓶"],
    ratio: "6 颗 : 1 罐 : 1 瓶",
    category: "果味汽水",
    note: "荔枝香、青柠感和乳酸甜味叠在一起，适合做一大杯。",
    steps: ["荔枝去核后在杯中轻捣", "加冰和青柠片", "倒入雪碧，再补养乐多"],
    sourceLabel: "网络配方 · 下厨房",
    sourceUrl: "https://m.xiachufang.com/recipe/106470183/",
    accent: "red",
  },
  {
    id: "sprite-grape-ice",
    name: "雪碧 ＋ 葡萄冰",
    ingredients: ["雪碧", "味全每日C葡萄汁冰块"],
    ratio: "雪碧 1 瓶 + 葡萄冰 6 块",
    category: "果味汽水",
    note: "刚倒入时清淡，等葡萄冰慢慢融化后层次更明显。",
    steps: ["提前把葡萄汁冻成冰块", "杯中放入 6 块葡萄冰", "倒满雪碧，静置 2 分钟"],
    sourceLabel: "网络灵感 · 新浪河南美食",
    sourceUrl: "https://henan.sina.cn/zmt/2021-08-26/zimeiti-ikqciyzm3689197.d.html",
    accent: "purple",
  },
  {
    id: "blood-orange-sprite",
    name: "血橙水溶C ＋ 雪碧",
    ingredients: ["水溶C100血橙味", "雪碧"],
    ratio: "果汁 : 汽水 = 2 : 1",
    category: "果味汽水",
    note: "酸甜橙味加一点气泡，适合怕汽水太甜的人。",
    steps: ["冰杯中加入冰块", "倒入 2 份血橙饮料", "加入 1 份雪碧，轻搅一下"],
    sourceLabel: "网络灵感 · 什么值得买",
    sourceUrl: "https://post.smzdm.com/p/a5xne5r3/",
    accent: "yellow",
  },
  {
    id: "jasmine-cookie-milk",
    name: "泥石流（茉莉饼干奶茶）",
    ingredients: ["康师傅茉莉清茶", "伊利纯牛奶", "奥利奥原味饼干"],
    ratio: "茶 : 奶 : 饼干碎 = 1 : 2 : 1",
    category: "奶香茶饮",
    note: "茶香打底，牛奶和饼干碎带来接近奶昔的浓郁口感。",
    steps: ["把奥利奥压成小颗粒", "杯中倒入 1 份茉莉花茶和 2 份纯牛奶", "加入 1 份饼干碎，搅匀后饮用"],
    sourceLabel: "小红书灵感 · 女生独立图鉴",
    sourceUrl: "https://xhslink.com/o/77yWhz9w26P",
    accent: "purple",
  },
  {
    id: "grape-cloud-oolong",
    name: "葡萄茶云乌龙",
    ingredients: ["三得利乌龙茶", "味全每日C葡萄汁", "养乐多"],
    ratio: "茶 : 葡萄汁 : 养乐多 = 3 : 6 : 1",
    category: "乳酸茶",
    note: "葡萄果香是主角，乌龙负责收尾，少量养乐多补上一点酸甜。",
    steps: ["杯中加满冰块", "倒入 3 份乌龙茶和 6 份葡萄汁", "最后加入 1 份养乐多，轻轻搅匀"],
    sourceLabel: "小红书灵感 · 女生独立图鉴",
    sourceUrl: "https://xhslink.com/o/77yWhz9w26P",
    accent: "purple",
  },
  {
    id: "wangzai-peach",
    name: "旺仔桃桃",
    ingredients: ["旺仔牛奶", "美汁源汁汁桃桃"],
    ratio: "牛奶 : 桃子汁 = 1 : 1",
    category: "奶香茶饮",
    note: "甜桃和奶香都很直接，适合加足冰块降低甜腻感。",
    steps: ["两种饮料提前冰透", "杯中放入冰块", "按 1:1 倒入后轻搅，避免久放分层"],
    sourceLabel: "小红书灵感 · 女生独立图鉴",
    sourceUrl: "https://xhslink.com/o/77yWhz9w26P",
    accent: "red",
  },
  {
    id: "sprite-vanilla-float",
    name: "雪碧麦乐酷（香草浮冰）",
    ingredients: ["雪碧", "哈根达斯香草冰淇淋"],
    ratio: "雪碧 : 冰淇淋 = 2 : 1",
    category: "果味汽水",
    note: "像一杯会冒泡的香草浮冰，入口绵密，融化后更像奶油汽水。",
    steps: ["杯中先倒入 2 份冰雪碧", "缓慢放入 1 份香草冰淇淋", "留出杯口空间，避免气泡溢出"],
    sourceLabel: "小红书灵感 · 女生独立图鉴",
    sourceUrl: "https://xhslink.com/o/77yWhz9w26P",
    accent: "blue",
  },
  {
    id: "iced-grape-oolong",
    name: "冰摇葡萄乌龙",
    ingredients: ["三得利乌龙茶", "味全每日C葡萄汁"],
    ratio: "茶 : 葡萄汁 = 1 : 2",
    category: "清爽茶饮",
    note: "葡萄的甜香更突出，乌龙茶让尾调不至于只剩果汁味。",
    steps: ["摇杯中加冰", "倒入 1 份乌龙茶和 2 份葡萄汁", "摇匀 8—10 秒后倒入杯中"],
    sourceLabel: "小红书灵感 · TulIp🌷",
    sourceUrl: "https://xhslink.com/o/AUANGenLDr8",
    accent: "purple",
  },
  {
    id: "orange-jasmine-tea",
    name: "橙香茉莉",
    ingredients: ["康师傅茉莉清茶", "味全每日C橙汁"],
    ratio: "茶 : 橙汁 = 1 : 2",
    category: "清爽茶饮",
    note: "橙汁负责明亮酸甜，茉莉香气藏在后调，适合冰饮。",
    steps: ["杯中加冰", "倒入 1 份茉莉花茶", "加入 2 份橙汁，轻搅均匀"],
    sourceLabel: "小红书灵感 · TulIp🌷",
    sourceUrl: "https://xhslink.com/o/AUANGenLDr8",
    accent: "yellow",
  },
  {
    id: "coconut-latte",
    name: "生椰拿铁",
    ingredients: ["菲诺厚椰乳", "UCC BLACK无糖咖啡"],
    ratio: "椰汁 : 咖啡 = 1 : 1",
    category: "奶香茶饮",
    note: "椰香能柔化咖啡苦味，想要清醒感更强可以少放一点椰汁。",
    steps: ["杯中装满冰块", "倒入 1 份冰椰汁", "沿冰块慢慢加入 1 份咖啡，饮用前搅匀"],
    sourceLabel: "小红书灵感 · TulIp🌷",
    sourceUrl: "https://xhslink.com/o/AUANGenLDr8",
    accent: "green",
  },
  {
    id: "sprite-iced-black-tea",
    name: "冰柠茶",
    ingredients: ["雪碧", "东方树叶红茶"],
    ratio: "雪碧 : 红茶 = 2 : 3",
    category: "清爽茶饮",
    note: "红茶遇上柠檬味汽水，清爽里带一点港式冰柠茶的感觉。",
    steps: ["杯中加半杯冰块", "先倒入 3 份红茶", "慢慢加入 2 份雪碧，减少气泡流失"],
    sourceLabel: "小红书灵感 · TulIp🌷",
    sourceUrl: "https://xhslink.com/o/AUANGenLDr8",
    accent: "blue",
  },
];

const mixIngredientImages: Record<string, string[]> = {
  "jasmine-wangzai": ["/packages/masterkong-jasmine.webp", "/packages/wangzai-milk.webp"],
  "sprite-grape-c": ["/ingredients/sprite.png", "/packages/dailyc-grape-clean.webp"],
  "green-tea-yakult": ["/packages/masterkong-green.webp", "/ingredients/yakult.jpg"],
  "grapefruit-tea-yakult": ["/packages/teapi-grapefruit.webp", "/ingredients/yakult.jpg"],
  "oolong-fresh-milk": ["/packages/suntory-oolong.webp", "/packages/yili-milk.webp"],
  "lychee-sprite-yakult": ["/ingredients/lychee.jpg", "/ingredients/sprite.png", "/ingredients/yakult.jpg"],
  "sprite-grape-ice": ["/ingredients/sprite.png", "/packages/dailyc-grape-clean.webp"],
  "blood-orange-sprite": ["/packages/c100-blood-orange.webp", "/ingredients/sprite.png"],
  "jasmine-cookie-milk": ["/packages/masterkong-jasmine.webp", "/packages/yili-milk.webp", "/packages/oreo.webp"],
  "grape-cloud-oolong": ["/packages/suntory-oolong.webp", "/packages/dailyc-grape-clean.webp", "/ingredients/yakult.jpg"],
  "wangzai-peach": ["/packages/wangzai-milk.webp", "/packages/minutemaid-peach.webp"],
  "sprite-vanilla-float": ["/ingredients/sprite.png", "/packages/haagendazs-vanilla.webp"],
  "iced-grape-oolong": ["/packages/suntory-oolong.webp", "/packages/dailyc-grape-clean.webp"],
  "orange-jasmine-tea": ["/packages/masterkong-jasmine.webp", "/packages/dailyc-orange.webp"],
  "coconut-latte": ["/packages/fino-coconut.webp", "/packages/ucc-black.webp"],
  "sprite-iced-black-tea": ["/ingredients/sprite.png", "/packages/oriental-black-tea.webp"],
};

type MixTranslation = Pick<Mix, "name" | "ingredients" | "ratio" | "note" | "steps" | "sourceLabel">;

const englishMixes: Record<string, MixTranslation> = {
  "jasmine-wangzai": {
    name: "Jasmine Tea + Wangzai Milk",
    ingredients: ["Master Kong Jasmine Clear Tea", "Wangzai milk"],
    ratio: "Tea : milk = 2 : 1",
    note: "A light milk tea with a clean floral finish. Serve it extra cold for a crisper sip.",
    steps: ["Fill a glass with ice", "Pour in 2 parts jasmine tea", "Add 1 part Wangzai milk along the side and stir gently"],
    sourceLabel: "Web inspiration · Sina Henan Food",
  },
  "sprite-grape-c": {
    name: "Sprite + Daily C Grape",
    ingredients: ["Sprite", "Daily C grape juice"],
    ratio: "Soda : juice = 1 : 1",
    note: "Big grape fizz with a sweet finish. Plenty of ice is highly recommended.",
    steps: ["Fill half the glass with ice", "Pour in the grape juice", "Slowly top with Sprite to keep the bubbles"],
    sourceLabel: "Community starter recipe",
  },
  "green-tea-yakult": {
    name: "Green Tea + Yakult",
    ingredients: ["Master Kong green tea", "Yakult"],
    ratio: "Tea : Yakult = 3 : 2",
    note: "A classic sweet-tart yogurt tea; the tea keeps the cultured milk drink from tasting too sweet.",
    steps: ["Add ice to a glass", "Pour in 3 parts chilled green tea", "Add 2 parts Yakult, stir and drink right away"],
    sourceLabel: "Web inspiration · Sina Henan Food",
  },
  "grapefruit-tea-yakult": {
    name: "Grapefruit Jasmine Tea + Yakult",
    ingredients: ["Tea Pi grapefruit jasmine tea", "Yakult"],
    ratio: "Tea : Yakult = 3 : 2",
    note: "A hint of grapefruit bitterness makes the sweet-tart flavor more layered. Use 2:1 for a lighter drink.",
    steps: ["Add ice", "Pour in grapefruit jasmine tea", "Add Yakult and stir well"],
    sourceLabel: "Web inspiration · Sina Henan Food",
  },
  "oolong-fresh-milk": {
    name: "Unsweetened Oolong + Pure Milk",
    ingredients: ["Suntory oolong tea", "Yili pure milk"],
    ratio: "Tea : milk = 2 : 1",
    note: "Not a heavy milk tea—more like cold-brew oolong softened with a gentle milky note.",
    steps: ["Chill the oolong completely", "Pour in 2 parts oolong", "Add 1 part fresh milk and shake well"],
    sourceLabel: "Web inspiration · Sina Henan Food",
  },
  "lychee-sprite-yakult": {
    name: "Lychee + Sprite + Yakult",
    ingredients: ["6 fresh lychees", "1 can Sprite", "1 bottle Yakult"],
    ratio: "6 fruits : 1 can : 1 bottle",
    note: "Lychee, lime-like fizz and cultured milk sweetness stack into a refreshing oversized drink.",
    steps: ["Pit and lightly muddle the lychees", "Add ice and lime slices", "Pour in Sprite, then top with Yakult"],
    sourceLabel: "Web recipe · Xiachufang",
  },
  "sprite-grape-ice": {
    name: "Sprite + Grape Ice",
    ingredients: ["Sprite", "Daily C grape juice ice cubes"],
    ratio: "1 bottle Sprite + 6 grape cubes",
    note: "It starts light, then grows fruitier as the grape ice slowly melts.",
    steps: ["Freeze grape juice into cubes", "Put 6 grape cubes in a glass", "Fill with Sprite and rest for 2 minutes"],
    sourceLabel: "Web inspiration · Sina Henan Food",
  },
  "blood-orange-sprite": {
    name: "Blood Orange Vitamin C + Sprite",
    ingredients: ["Blood orange Vitamin C drink", "Sprite"],
    ratio: "Juice : soda = 2 : 1",
    note: "Bright sweet-tart orange with a little fizz—ideal if full-strength soda feels too sweet.",
    steps: ["Add ice to a chilled glass", "Pour in 2 parts blood orange drink", "Add 1 part Sprite and stir once"],
    sourceLabel: "Web inspiration · SMZDM",
  },
  "jasmine-cookie-milk": {
    name: "Jasmine Cookie Milk Tea",
    ingredients: ["Master Kong Jasmine Clear Tea", "Yili pure milk", "Original Oreo cookies"],
    ratio: "Tea : milk : crumbs = 1 : 2 : 1",
    note: "Jasmine tea forms the base while milk and cookie crumbs create a rich, shake-like texture.",
    steps: ["Crush the cookies into small bits", "Combine 1 part jasmine tea with 2 parts milk", "Add 1 part crumbs, stir and serve"],
    sourceLabel: "Xiaohongshu inspiration · 女生独立图鉴",
  },
  "grape-cloud-oolong": {
    name: "Grape Cloud Oolong",
    ingredients: ["Suntory oolong tea", "Daily C grape juice", "Yakult"],
    ratio: "Tea : grape : Yakult = 3 : 6 : 1",
    note: "Grape leads, oolong cleans up the finish, and a little Yakult adds a sweet-tart lift.",
    steps: ["Fill the glass with ice", "Add 3 parts oolong and 6 parts grape juice", "Finish with 1 part Yakult and stir gently"],
    sourceLabel: "Xiaohongshu inspiration · 女生独立图鉴",
  },
  "wangzai-peach": {
    name: "Wangzai Peach Milk",
    ingredients: ["Wangzai milk", "Minute Maid Juicy Peach"],
    ratio: "Milk : peach juice = 1 : 1",
    note: "Bold peach and milk flavors. Add plenty of ice to keep the sweetness in check.",
    steps: ["Chill both drinks", "Add ice to the glass", "Pour both in at 1:1, stir gently and serve before it separates"],
    sourceLabel: "Xiaohongshu inspiration · 女生独立图鉴",
  },
  "sprite-vanilla-float": {
    name: "Sprite Vanilla Float",
    ingredients: ["Sprite", "Häagen-Dazs vanilla ice cream"],
    ratio: "Sprite : ice cream = 2 : 1",
    note: "A fizzy vanilla float: creamy at first and more like cream soda as it melts.",
    steps: ["Pour in 2 parts ice-cold Sprite", "Slowly add 1 part vanilla ice cream", "Leave room at the top for the foam"],
    sourceLabel: "Xiaohongshu inspiration · 女生独立图鉴",
  },
  "iced-grape-oolong": {
    name: "Shaken Grape Oolong",
    ingredients: ["Suntory oolong tea", "Daily C grape juice"],
    ratio: "Tea : grape juice = 1 : 2",
    note: "Sweet grape comes forward while oolong keeps the finish from tasting like plain juice.",
    steps: ["Fill a shaker with ice", "Add 1 part oolong and 2 parts grape juice", "Shake for 8–10 seconds and strain into a glass"],
    sourceLabel: "Xiaohongshu inspiration · TulIp🌷",
  },
  "orange-jasmine-tea": {
    name: "Orange Jasmine Tea",
    ingredients: ["Master Kong Jasmine Clear Tea", "Daily C orange juice"],
    ratio: "Tea : orange juice = 1 : 2",
    note: "Orange brings bright acidity and sweetness, with jasmine hiding in the finish. Best served cold.",
    steps: ["Add ice", "Pour in 1 part jasmine tea", "Add 2 parts orange juice and stir gently"],
    sourceLabel: "Xiaohongshu inspiration · TulIp🌷",
  },
  "coconut-latte": {
    name: "Coconut Latte",
    ingredients: ["Fino thick coconut milk", "UCC BLACK coffee"],
    ratio: "Coconut : coffee = 1 : 1",
    note: "Coconut softens coffee bitterness. Use a little less coconut for a stronger caffeine kick.",
    steps: ["Fill a glass with ice", "Pour in 1 part chilled coconut drink", "Slowly add 1 part coffee over the ice and stir before drinking"],
    sourceLabel: "Xiaohongshu inspiration · TulIp🌷",
  },
  "sprite-iced-black-tea": {
    name: "Fizzy Iced Lemon Tea",
    ingredients: ["Sprite", "Oriental Leaf black tea"],
    ratio: "Sprite : black tea = 2 : 3",
    note: "Black tea meets lemon-lime soda for a refreshing, Hong Kong-style iced lemon tea mood.",
    steps: ["Fill half the glass with ice", "Pour in 3 parts black tea", "Slowly add 2 parts Sprite to preserve the fizz"],
    sourceLabel: "Xiaohongshu inspiration · TulIp🌷",
  },
};

const copy = {
  zh: {
    brandSub: "便利店饮料实验簿", backAll: "返回全部搭配", search: "搜饮料或口味", searchLabel: "搜索饮料搭配",
    newMix: "新配方", signIn: "登录", signOut: "退出", account: "我的账户", guest: "访客只读",
    eyebrow: "MIX OF THE DAY · 今日混搭", heroTitle: "今天，混点什么？", heroBody: "把便利店里熟悉的两瓶快乐，摇成一杯新口味。",
    statsLabel: "实验簿统计", webIdeas: "份网络灵感", myRecipes: "份我的配方", localRatings: "次我的评分",
    artLabel: "清茶与牛奶的混搭图形", tea: "清茶", milk: "牛奶", heroNote: <>先试 2 : 1<br />加冰更清爽！</>,
    filtersLabel: "筛选饮料搭配", findByTaste: "按口味找", addMine: "添加我的搭配", mixNotes: "MIX NOTES",
    allTitle: "值得一试的混搭", sectionBody: "公开配方提供灵感；登录后可以添加自己的搭配并记录评分。",
    myExperiment: "我的实验", publicIdea: "公开灵感", ratio: "建议比例", noRating: "还没有评分，等你首评",
    guestRating: "登录后可评分并保存记录", editRating: "查看 · 修改评分", rateAfter: "查看配方 · 喝完评分", viewRecipe: "查看完整配方",
    emptyTitle: "这张标签还是空的", emptyBodyUser: "换个关键词，或者把你的第一份搭配贴进来。", emptyBodyGuest: "换个关键词，继续看看公开配方。", addRecipe: "添加配方",
    footerLead: "每一杯奇怪搭配，都值得被认真记录。", footerUser: "自建配方与评分按登录账户保存在当前浏览器 · 饮料含糖量以包装标注为准", footerGuest: "当前为访客只读模式 · 登录后可以添加配方和评分",
    photoCredit: "便利店商品原包装", recipeReceipt: "配方小票", closeDetail: "关闭配方详情", viewSource: "查看公开灵感来源 ↗", deleteMine: "删除我的配方",
    report: "DRINK REPORT", reportTitle: "喝完，打个分", reportBody: "按登录账户保存在当前设备，可随时修改。", overall: "整体好喝度", pending: "待评分",
    sweetness: "甜度", notSweet: "不甜", verySweet: "很甜", freshness: "清爽度", heavy: "厚重", veryFresh: "很清爽", surprise: "惊喜度", ordinary: "普通", surprising: "超惊喜",
    remake: "下次还愿意再混一杯", flavorNote: "风味小记（可选）", notePlaceholder: "比如：下次少放一点雪碧……", saveRating: "保存这次评分",
    loginKicker: "MEMBERS ONLY · 登录后解锁", loginTitle: "想留下你的口味记录？", loginBody: "访客可以浏览全部公开配方。登录后即可评分、添加配方，并在这台设备上保留记录。", loginAction: "使用 ChatGPT 登录",
    addEyebrow: "NEW MIX · 新实验", addTitle: "贴一张自己的配方", addIntro: "至少填两种饮料。配方按登录账户保存在这台设备上。", closeAdd: "关闭添加配方窗口",
    drinkA: "饮料 A *", drinkB: "饮料 B *", drinkC: "饮料 C（可选）", mixName: "搭配名称（可选）", ratioLabel: "建议比例", method: "混合方法", tasteLike: "喝起来像什么？",
    exampleTea: "例如：茉莉清茶", exampleMilk: "例如：旺仔牛奶", exampleYakult: "例如：养乐多", autoName: "留空会自动组合", ratioExample: "例如：茶 : 奶 = 2 : 1", methodExample: "例如：加冰后依次倒入", expectation: "先写下你的预期，喝完还可以继续评分。", cancel: "先不添加", saveBook: "保存到实验簿",
    starFirst: "先点一颗星，告诉我们好不好喝", savedRating: "评分已保存在这台设备上", loginRequired: "请先登录，再添加配方或评分", defaultRatio: "按口味", defaultNote: "还没有风味笔记，喝完记得回来评分。", defaultMethod: "加冰后依次倒入，轻轻搅匀", customSource: "我的配方 · 当前设备", added: "新配方已贴进你的实验簿", deleteConfirm: "删除", deviceOnly: "这项操作只影响当前账户在这台设备上的记录。", deleted: "配方已从实验簿移除",
  },
  en: {
    brandSub: "Convenience-store drink notebook", backAll: "Back to all mixes", search: "Search drinks or flavors", searchLabel: "Search drink mixes",
    newMix: "New mix", signIn: "Sign in", signOut: "Sign out", account: "Account", guest: "Guest · view only",
    eyebrow: "MIX OF THE DAY", heroTitle: "What shall we mix today?", heroBody: "Turn two familiar convenience-store drinks into one new flavor.",
    statsLabel: "MixLab statistics", webIdeas: "public ideas", myRecipes: "my recipes", localRatings: "my ratings",
    artLabel: "Tea and milk mix illustration", tea: "TEA", milk: "MILK", heroNote: <>Start at 2 : 1<br />Ice makes it crisp!</>,
    filtersLabel: "Filter drink mixes", findByTaste: "Find by flavor", addMine: "Add my mix", mixNotes: "MIX NOTES",
    allTitle: "Mixes worth trying", sectionBody: "Public recipes are here for inspiration. Sign in to add your own mix and save ratings.",
    myExperiment: "My experiment", publicIdea: "Public idea", ratio: "Suggested ratio", noRating: "No rating yet—be the first",
    guestRating: "Sign in to rate and save it", editRating: "View · edit rating", rateAfter: "View recipe · rate it", viewRecipe: "View full recipe",
    emptyTitle: "Nothing under this label", emptyBodyUser: "Try another search or add your first mix.", emptyBodyGuest: "Try another search and explore the public recipes.", addRecipe: "Add recipe",
    footerLead: "Every unusual mix deserves a proper field note.", footerUser: "Custom recipes and ratings are stored per signed-in account in this browser · Check packaging for sugar content", footerGuest: "You are browsing in guest view-only mode · Sign in to add recipes and ratings",
    photoCredit: "Original retail packaging", recipeReceipt: "Recipe receipt", closeDetail: "Close recipe details", viewSource: "View public inspiration source ↗", deleteMine: "Delete my recipe",
    report: "DRINK REPORT", reportTitle: "Tried it? Rate it", reportBody: "Saved for this account on this device. You can edit it anytime.", overall: "Overall taste", pending: "Not rated",
    sweetness: "Sweetness", notSweet: "Dry", verySweet: "Very sweet", freshness: "Freshness", heavy: "Rich", veryFresh: "Very fresh", surprise: "Surprise", ordinary: "Familiar", surprising: "Unexpected",
    remake: "I would make this again", flavorNote: "Flavor note (optional)", notePlaceholder: "For example: use a little less Sprite next time…", saveRating: "Save this rating",
    loginKicker: "MEMBERS ONLY · SIGN IN TO UNLOCK", loginTitle: "Want to keep your tasting notes?", loginBody: "Guests can browse every public recipe. Sign in to rate drinks, add recipes and keep records on this device.", loginAction: "Sign in with ChatGPT",
    addEyebrow: "NEW MIX · NEW EXPERIMENT", addTitle: "Add your own recipe", addIntro: "Enter at least two drinks. It will be saved for this account on this device.", closeAdd: "Close add recipe dialog",
    drinkA: "Drink A *", drinkB: "Drink B *", drinkC: "Drink C (optional)", mixName: "Mix name (optional)", ratioLabel: "Suggested ratio", method: "Mixing method", tasteLike: "What might it taste like?",
    exampleTea: "e.g. jasmine tea", exampleMilk: "e.g. Wangzai milk", exampleYakult: "e.g. Yakult", autoName: "Leave blank to combine names", ratioExample: "e.g. tea : milk = 2 : 1", methodExample: "e.g. add over ice in order", expectation: "Write down your expectation now; add a rating after you try it.", cancel: "Not now", saveBook: "Save to notebook",
    starFirst: "Choose at least one star first", savedRating: "Rating saved on this device", loginRequired: "Please sign in to add recipes or ratings", defaultRatio: "To taste", defaultNote: "No flavor note yet. Come back and rate it after tasting.", defaultMethod: "Add over ice in order and stir gently", customSource: "My recipe · current device", added: "Your new mix is in the notebook", deleteConfirm: "Delete", deviceOnly: "This only removes this account's record on this device.", deleted: "Recipe removed from your notebook",
  },
} as const;

const filters = ["全部搭配", "奶香茶饮", "果味汽水", "乳酸茶", "清爽茶饮", "我的配方"] as const;

const blankRating: Rating = {
  taste: 0,
  sweetness: 3,
  freshness: 3,
  surprise: 3,
  remake: true,
  note: "",
  updatedAt: "",
};

function safeLoad<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function RatingBar({ label, value, accent }: { label: string; value: number; accent: Accent }) {
  return (
    <div className="metric">
      <div className="metric-label">
        <span>{label}</span>
        <b>{value}/5</b>
      </div>
      <div className="metric-track" aria-hidden="true">
        <span className={`metric-fill accent-${accent}`} style={{ width: `${value * 20}%` }} />
      </div>
    </div>
  );
}

const categoryLabels: Record<Locale, Record<Category | "全部搭配", string>> = {
  zh: { "全部搭配": "全部搭配", "奶香茶饮": "奶香茶饮", "果味汽水": "果味汽水", "乳酸茶": "乳酸茶", "清爽茶饮": "清爽茶饮", "我的配方": "我的配方" },
  en: { "全部搭配": "All mixes", "奶香茶饮": "Milky tea", "果味汽水": "Fruit fizz", "乳酸茶": "Cultured milk tea", "清爽茶饮": "Refreshing tea", "我的配方": "My recipes" },
};

function displayMix(mix: Mix, locale: Locale): Mix {
  return locale === "en" && !mix.isCustom && englishMixes[mix.id]
    ? { ...mix, ...englishMixes[mix.id] }
    : mix;
}

function imageForIngredient(ingredient: string): string {
  const normalized = ingredient.toLowerCase();
  if (/sprite|雪碧|汽水|soda|cola|可乐/.test(normalized)) return "/ingredients/sprite.png";
  if (/yakult|养乐多|乳酸/.test(normalized)) return "/ingredients/yakult.jpg";
  if (/c100|blood.orange|血橙/.test(normalized)) return "/packages/c100-blood-orange.webp";
  if (/tea.?pi|茶π|茶派|grapefruit|西柚/.test(normalized)) return "/packages/teapi-grapefruit.webp";
  if (/grape|葡萄/.test(normalized)) return "/packages/dailyc-grape-clean.webp";
  if (/lychee|荔枝/.test(normalized)) return "/ingredients/lychee.jpg";
  if (/orange|橙汁|橙味|柠檬|lemon/.test(normalized)) return "/packages/dailyc-orange.webp";
  if (/oreo|cookie|奥利奥|饼干/.test(normalized)) return "/packages/oreo.webp";
  if (/peach|桃/.test(normalized)) return "/packages/minutemaid-peach.webp";
  if (/ice.?cream|冰淇淋|香草/.test(normalized)) return "/packages/haagendazs-vanilla.webp";
  if (/coconut|fino|菲诺|椰/.test(normalized)) return "/packages/fino-coconut.webp";
  if (/coffee|ucc|咖啡|拿铁/.test(normalized)) return "/packages/ucc-black.webp";
  if (/wangzai|旺仔/.test(normalized)) return "/packages/wangzai-milk.webp";
  if (/milk|yili|伊利|牛奶|鲜奶|奶/.test(normalized)) return "/packages/yili-milk.webp";
  if (/black.?tea|红茶/.test(normalized)) return "/packages/oriental-black-tea.webp";
  if (/jasmine.clear|茉莉清茶/.test(normalized)) return "/packages/masterkong-jasmine.webp";
  if (/master.?kong.*green|康师傅绿茶/.test(normalized)) return "/packages/masterkong-green.webp";
  if (/oolong|三得利|乌龙/.test(normalized)) return "/packages/suntory-oolong.webp";
  if (/oriental.leaf|东方树叶/.test(normalized)) return "/packages/oriental-jasmine.webp";
  return "/packages/masterkong-jasmine.webp";
}

function IngredientGallery({ mix, display, detail = false }: { mix: Mix; display: Mix; detail?: boolean }) {
  const mappedImages = mixIngredientImages[mix.id];
  const ingredients = display.ingredients.slice(0, 3);

  return (
    <figure
      className={`ingredient-gallery ${detail ? "detail-ingredient-gallery" : ""}`}
      data-count={ingredients.length}
      aria-label={ingredients.join(" + ")}
    >
      {ingredients.map((ingredient, index) => {
        const src = mappedImages?.[index] ?? imageForIngredient(ingredient);
        const isPackshot = src.startsWith("/packages/") || src.endsWith("sprite.png") || src.endsWith("yakult.jpg");
        return (
          <div className={`ingredient-photo ${isPackshot ? "packshot" : ""}`} key={`${mix.id}-${ingredient}-${index}`}>
            <img src={src} alt={ingredient} loading={detail ? "eager" : "lazy"} />
            <span className="ingredient-caption">{ingredient}</span>
          </div>
        );
      })}
    </figure>
  );
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>("zh");
  const [user, setUser] = useState<SessionUser | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [customMixes, setCustomMixes] = useState<Mix[]>([]);
  const [ratings, setRatings] = useState<Record<string, Rating>>({});
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState<(typeof filters)[number]>("全部搭配");
  const [search, setSearch] = useState("");
  const [selectedMix, setSelectedMix] = useState<Mix | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [draftRating, setDraftRating] = useState<Rating>(blankRating);
  const [toast, setToast] = useState("");
  const t = copy[locale];

  useEffect(() => {
    const savedLocale = safeLoad<Locale>(LOCALE_KEY, "zh");
    if (savedLocale === "zh" || savedLocale === "en") {
      setLocale(savedLocale);
      document.documentElement.lang = savedLocale === "zh" ? "zh-CN" : "en";
    }
    fetch("/api/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { user?: SessionUser | null }) => setUser(data.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setSessionReady(true));
  }, []);

  useEffect(() => {
    if (!sessionReady) return;
    setLoaded(false);
    if (user) {
      setCustomMixes(safeLoad<Mix[]>(`${MIXES_KEY}:${user.email}`, []));
      setRatings(safeLoad<Record<string, Rating>>(`${RATINGS_KEY}:${user.email}`, {}));
    } else {
      setCustomMixes([]);
      setRatings({});
      setFilter((current) => current === "我的配方" ? "全部搭配" : current);
      setIsAdding(false);
    }
    setLoaded(true);
  }, [sessionReady, user]);

  useEffect(() => {
    if (!loaded || !user) return;
    window.localStorage.setItem(`${MIXES_KEY}:${user.email}`, JSON.stringify(customMixes));
  }, [customMixes, loaded, user]);

  useEffect(() => {
    if (!loaded || !user) return;
    window.localStorage.setItem(`${RATINGS_KEY}:${user.email}`, JSON.stringify(ratings));
  }, [ratings, loaded, user]);

  useEffect(() => {
    document.body.style.overflow = selectedMix || isAdding ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedMix, isAdding]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const allMixes = useMemo(() => [...customMixes, ...featuredMixes], [customMixes]);
  const visibleMixes = useMemo(() => {
    const query = search.trim().toLowerCase();
    return allMixes.filter((mix) => {
      const translated = displayMix(mix, locale);
      const inFilter = filter === "全部搭配" || (filter === "我的配方" ? mix.isCustom : mix.category === filter);
      const haystack = `${mix.name} ${mix.ingredients.join(" ")} ${mix.note} ${translated.name} ${translated.ingredients.join(" ")} ${translated.note}`.toLowerCase();
      return inFilter && (!query || haystack.includes(query));
    });
  }, [allMixes, filter, locale, search]);

  const ratedCount = user ? Object.values(ratings).filter((rating) => rating.taste > 0).length : 0;
  const selectedDisplay = selectedMix ? displayMix(selectedMix, locale) : null;
  const availableFilters = filters.filter((item) => item !== "我的配方" || user);

  function switchLocale() {
    const nextLocale: Locale = locale === "zh" ? "en" : "zh";
    setLocale(nextLocale);
    window.localStorage.setItem(LOCALE_KEY, JSON.stringify(nextLocale));
    document.documentElement.lang = nextLocale === "zh" ? "zh-CN" : "en";
  }

  function requestAdd() {
    if (!user) {
      setToast(t.loginRequired);
      return;
    }
    setIsAdding(true);
  }

  function openMix(mix: Mix) {
    setSelectedMix(mix);
    setDraftRating(user ? ratings[mix.id] ?? { ...blankRating } : { ...blankRating });
  }

  function closeDetails() {
    setSelectedMix(null);
    setDraftRating({ ...blankRating });
  }

  function saveRating(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) {
      setToast(t.loginRequired);
      return;
    }
    if (!selectedMix || draftRating.taste === 0) {
      setToast(t.starFirst);
      return;
    }
    const nextRating = { ...draftRating, updatedAt: new Date().toISOString() };
    setRatings((current) => ({ ...current, [selectedMix.id]: nextRating }));
    setDraftRating(nextRating);
    setToast(t.savedRating);
  }

  function addMix(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) {
      setIsAdding(false);
      setToast(t.loginRequired);
      return;
    }
    const form = new FormData(event.currentTarget);
    const ingredientA = String(form.get("ingredientA") ?? "").trim();
    const ingredientB = String(form.get("ingredientB") ?? "").trim();
    const ingredientC = String(form.get("ingredientC") ?? "").trim();
    const customName = String(form.get("name") ?? "").trim();
    const ingredients = [ingredientA, ingredientB, ingredientC].filter(Boolean);
    const newMix: Mix = {
      id: `custom-${Date.now()}`,
      name: customName || ingredients.join(locale === "zh" ? " ＋ " : " + "),
      ingredients,
      ratio: String(form.get("ratio") ?? "").trim() || t.defaultRatio,
      category: "我的配方",
      note: String(form.get("note") ?? "").trim() || t.defaultNote,
      steps: [String(form.get("method") ?? "").trim() || t.defaultMethod],
      sourceLabel: t.customSource,
      accent: (["blue", "red", "yellow", "green", "purple"] as Accent[])[customMixes.length % 5],
      isCustom: true,
    };
    setCustomMixes((current) => [newMix, ...current]);
    setIsAdding(false);
    setFilter("我的配方");
    setSearch("");
    setToast(t.added);
  }

  function deleteCustomMix() {
    if (!user || !selectedMix?.isCustom) return;
    if (!window.confirm(`${t.deleteConfirm} “${selectedMix.name}”? ${t.deviceOnly}`)) return;
    setCustomMixes((current) => current.filter((mix) => mix.id !== selectedMix.id));
    setRatings((current) => {
      const next = { ...current };
      delete next[selectedMix.id];
      return next;
    });
    closeDetails();
    setToast(t.deleted);
  }

  return (
    <div className="page-shell">
      <header className="site-header content-width">
        <button className="brand" type="button" onClick={() => { setFilter("全部搭配"); setSearch(""); }} aria-label={t.backAll}>
          <span className="brand-sticker">混</span>
          <span className="brand-copy"><b>混点 MixLab</b><small>{t.brandSub}</small></span>
        </button>
        <div className="header-actions">
          <label className="search-box">
            <span aria-hidden="true">⌕</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t.search} aria-label={t.searchLabel} />
          </label>
          <button className="language-switch" type="button" onClick={switchLocale} aria-label={locale === "zh" ? "Switch to English" : "切换到中文"}>
            <b>{locale === "zh" ? "中" : "EN"}</b><span>{locale === "zh" ? "EN" : "中"}</span>
          </button>
          {user ? (
            <div className="account-menu" title={user.email}>
              <span className="account-avatar" aria-hidden="true">{user.displayName.trim().charAt(0).toUpperCase()}</span>
              <span className="account-name"><small>{t.account}</small><b>{user.displayName}</b></span>
              <a href="/signout-with-chatgpt?return_to=%2F">{t.signOut}</a>
            </div>
          ) : (
            <a className="auth-button" href="/signin-with-chatgpt?return_to=%2F"><span aria-hidden="true">↗</span>{t.signIn}</a>
          )}
        </div>
      </header>

      <main className="content-width main-content">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <span className="eyebrow">{t.eyebrow}</span>
            <h1 id="hero-title">{t.heroTitle}</h1>
            <p>{t.heroBody}</p>
            <div className="hero-stats" aria-label={t.statsLabel}>
              <div><b>{featuredMixes.length}</b><span>{t.webIdeas}</span></div>
              <div><b>{user ? customMixes.length : "—"}</b><span>{user ? t.myRecipes : t.guest}</span></div>
              <div><b>{user ? ratedCount : "—"}</b><span>{user ? t.localRatings : t.guest}</span></div>
            </div>
          </div>
          <div className="hero-art" aria-label={t.artLabel}>
            <div className="tape-strip" />
            <div className="hero-bottle"><span>{t.tea}</span></div>
            <div className="hero-plus">＋</div>
            <div className="hero-can"><span>{t.milk}</span></div>
            <div className="hero-note">{t.heroNote}</div>
            <div className="bubble bubble-one" /><div className="bubble bubble-two" /><div className="bubble bubble-three" />
          </div>
        </section>

        <section className="tool-row" aria-label={t.filtersLabel}>
          <div className="filter-group">
            <span className="filter-label">{t.findByTaste}</span>
            {availableFilters.map((item) => (
              <button key={item} className={`filter-chip ${filter === item ? "selected" : ""}`} type="button" onClick={() => setFilter(item)} aria-pressed={filter === item}>
                {categoryLabels[locale][item]}
                {item === "我的配方" && customMixes.length > 0 ? <em>{customMixes.length}</em> : null}
              </button>
            ))}
          </div>
          {user ? (
            <button className="primary-button" type="button" onClick={requestAdd}><span>＋</span>{t.addMine}</button>
          ) : (
            <a className="primary-button signin-cta" href="/signin-with-chatgpt?return_to=%2F"><span>↗</span>{t.loginAction}</a>
          )}
        </section>

        <section className="recipes-section" aria-labelledby="recipes-title">
          <div className="section-heading">
            <div>
              <span className="section-kicker">{t.mixNotes} / {String(visibleMixes.length).padStart(2, "0")}</span>
              <h2 id="recipes-title">{filter === "全部搭配" ? t.allTitle : categoryLabels[locale][filter]}</h2>
            </div>
            <p>{t.sectionBody}</p>
          </div>

          {visibleMixes.length ? (
            <div className="recipe-grid">
              {visibleMixes.map((mix, index) => {
                const shownMix = displayMix(mix, locale);
                const rating = user ? ratings[mix.id] : undefined;
                return (
                  <article className={`recipe-card accent-card-${mix.accent}`} key={mix.id}>
                    <span className="card-tape" aria-hidden="true" />
                    <div className="card-topline">
                      <span className="ticket-number">NO. {String(index + 1).padStart(2, "0")}</span>
                      <span className="source-pill">{mix.isCustom ? t.myExperiment : t.publicIdea}</span>
                    </div>
                    <IngredientGallery mix={mix} display={shownMix} />
                    <h3>{shownMix.name}</h3>
                    <p className="recipe-note">{shownMix.note}</p>
                    <div className="ratio-ticket"><span>{t.ratio}</span><b>{shownMix.ratio}</b></div>
                    {rating?.taste ? (
                      <div className="rating-summary">
                        <div className="score-block"><strong>{rating.taste.toFixed(1)}</strong><span>{"★".repeat(rating.taste)}{"☆".repeat(5 - rating.taste)}</span></div>
                        <div className="mini-metrics">
                          <RatingBar label={t.sweetness} value={rating.sweetness} accent={mix.accent} />
                          <RatingBar label={t.freshness} value={rating.freshness} accent={mix.accent} />
                          <RatingBar label={t.surprise} value={rating.surprise} accent={mix.accent} />
                        </div>
                      </div>
                    ) : (
                      <div className={`empty-rating ${user ? "" : "guest-rating"}`}><span>{user ? "☆☆☆☆☆" : "♙"}</span><p>{user ? t.noRating : t.guestRating}</p></div>
                    )}
                    <button className="card-action" type="button" onClick={() => openMix(mix)}>
                      {user ? (rating?.taste ? t.editRating : t.rateAfter) : t.viewRecipe}<span aria-hidden="true">↗</span>
                    </button>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <span>🥤</span><h3>{t.emptyTitle}</h3><p>{user ? t.emptyBodyUser : t.emptyBodyGuest}</p>
              {user ? <button className="primary-button" type="button" onClick={requestAdd}>＋ {t.addRecipe}</button> : null}
            </div>
          )}
        </section>

        <footer className="site-footer">
          <p>{t.footerLead}</p>
          <span>{user ? t.footerUser : t.footerGuest}</span>
          <span className="photo-credit">{t.photoCredit}: {locale === "zh" ? "品牌官网与零售商品页" : "brand and retailer product pages"} · <a href="https://unsplash.com/photos/brown-and-pink-round-fruit-on-white-table-9TboYEv1uZo" target="_blank" rel="noreferrer">{locale === "zh" ? "鲜荔枝实拍" : "fresh lychee photo"}</a></span>
        </footer>
      </main>

      {selectedMix && selectedDisplay ? (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDetails(); }}>
          <section className="modal-card detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title">
            <button className="modal-close" type="button" onClick={closeDetails} aria-label={t.closeDetail}>×</button>
            <div className="receipt-header"><span>MIX RECEIPT</span><b>{t.recipeReceipt}</b><em>{categoryLabels[locale][selectedMix.category]}</em></div>
            <div className="detail-grid">
              <div className="recipe-detail">
                <IngredientGallery mix={selectedMix} display={selectedDisplay} detail />
                <span className="detail-source">{selectedDisplay.sourceLabel}</span>
                <h2 id="detail-title">{selectedDisplay.name}</h2>
                <p>{selectedDisplay.note}</p>
                <div className="ingredient-list">
                  {selectedDisplay.ingredients.map((ingredient, index) => <span key={`${ingredient}-${index}`}><i>{index + 1}</i>{ingredient}</span>)}
                </div>
                <div className="detail-ratio"><span>{t.ratio}</span><b>{selectedDisplay.ratio}</b></div>
                <ol className="steps-list">{selectedDisplay.steps.map((step, index) => <li key={`${step}-${index}`}>{step}</li>)}</ol>
                {selectedMix.sourceUrl ? <a className="source-link" href={selectedMix.sourceUrl} target="_blank" rel="noreferrer">{t.viewSource}</a> : null}
                {user && selectedMix.isCustom ? <button className="delete-link" type="button" onClick={deleteCustomMix}>{t.deleteMine}</button> : null}
              </div>
              {user ? (
                <form className="rating-form" onSubmit={saveRating}>
                  <div className="rating-form-heading"><span>{t.report}</span><h3>{t.reportTitle}</h3><p>{t.reportBody}</p></div>
                  <fieldset className="stars-field">
                    <legend>{t.overall}</legend>
                    <div className="star-buttons">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" className={draftRating.taste >= star ? "active" : ""} onClick={() => setDraftRating((current) => ({ ...current, taste: star }))} aria-label={`${star} ${locale === "zh" ? "星" : "stars"}`} aria-pressed={draftRating.taste === star}>★</button>
                      ))}
                      <b>{draftRating.taste ? `${draftRating.taste}.0` : t.pending}</b>
                    </div>
                  </fieldset>
                  {([
                    ["sweetness", t.sweetness, t.notSweet, t.verySweet],
                    ["freshness", t.freshness, t.heavy, t.veryFresh],
                    ["surprise", t.surprise, t.ordinary, t.surprising],
                  ] as const).map(([key, label, low, high]) => (
                    <label className="range-field" key={key}>
                      <span><b>{label}</b><em>{draftRating[key]}/5</em></span>
                      <input type="range" min="1" max="5" step="1" value={draftRating[key]} onChange={(event) => setDraftRating((current) => ({ ...current, [key]: Number(event.target.value) }))} />
                      <small><i>{low}</i><i>{high}</i></small>
                    </label>
                  ))}
                  <label className="remake-check"><input type="checkbox" checked={draftRating.remake} onChange={(event) => setDraftRating((current) => ({ ...current, remake: event.target.checked }))} /><span aria-hidden="true" /> {t.remake}</label>
                  <label className="note-field"><span>{t.flavorNote}</span><textarea rows={3} maxLength={120} value={draftRating.note} onChange={(event) => setDraftRating((current) => ({ ...current, note: event.target.value }))} placeholder={t.notePlaceholder} /></label>
                  <button className="primary-button form-submit" type="submit">{t.saveRating}</button>
                </form>
              ) : (
                <aside className="guest-panel">
                  <span className="guest-lock" aria-hidden="true">♙</span><em>{t.loginKicker}</em><h3>{t.loginTitle}</h3><p>{t.loginBody}</p>
                  <a className="primary-button" href="/signin-with-chatgpt?return_to=%2F">{t.loginAction}<span>↗</span></a>
                </aside>
              )}
            </div>
          </section>
        </div>
      ) : null}

      {isAdding && user ? (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsAdding(false); }}>
          <section className="modal-card add-modal" role="dialog" aria-modal="true" aria-labelledby="add-title">
            <button className="modal-close" type="button" onClick={() => setIsAdding(false)} aria-label={t.closeAdd}>×</button>
            <span className="eyebrow">{t.addEyebrow}</span><h2 id="add-title">{t.addTitle}</h2><p className="modal-intro">{t.addIntro}</p>
            <form className="add-form" onSubmit={addMix}>
              <div className="form-row two-columns">
                <label><span>{t.drinkA}</span><input name="ingredientA" required maxLength={40} placeholder={t.exampleTea} /></label>
                <label><span>{t.drinkB}</span><input name="ingredientB" required maxLength={40} placeholder={t.exampleMilk} /></label>
              </div>
              <div className="form-row two-columns">
                <label><span>{t.drinkC}</span><input name="ingredientC" maxLength={40} placeholder={t.exampleYakult} /></label>
                <label><span>{t.mixName}</span><input name="name" maxLength={60} placeholder={t.autoName} /></label>
              </div>
              <div className="form-row two-columns">
                <label><span>{t.ratioLabel}</span><input name="ratio" maxLength={40} placeholder={t.ratioExample} /></label>
                <label><span>{t.method}</span><input name="method" maxLength={80} placeholder={t.methodExample} /></label>
              </div>
              <label className="full-field"><span>{t.tasteLike}</span><textarea name="note" rows={3} maxLength={140} placeholder={t.expectation} /></label>
              <div className="form-actions"><button className="secondary-button" type="button" onClick={() => setIsAdding(false)}>{t.cancel}</button><button className="primary-button" type="submit">{t.saveBook}</button></div>
            </form>
          </section>
        </div>
      ) : null}

      {toast ? <div className="toast" role="status">{toast}</div> : null}
    </div>
  );
}
