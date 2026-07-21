import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";
  const protocol = headerList.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: "混点 MixLab｜饮料混搭实验簿 · Drink Mix Notebook",
    description: "中英双语收集热门饮料混搭；访客浏览公开配方，登录后可添加自己的搭配并记录评分。",
    openGraph: {
      title: "混点 MixLab｜饮料混搭实验簿",
      description: "浏览热门饮料混搭，登录后记录你的配方与口味评分。",
      type: "website",
      url: origin,
      images: [{ url: `${origin}/og.png`, width: 1200, height: 630, alt: "混点 MixLab 饮料混搭实验簿" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "混点 MixLab｜Drink Mix Notebook",
      description: "Browse drink recipes, then sign in to add mixes and save your ratings.",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
