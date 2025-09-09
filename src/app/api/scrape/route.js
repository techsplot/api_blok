// src/app/api/scrape/route.js
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_UA =
  "Mozilla/5.0 (compatible; NextScraper/1.0; +https://example.com/bot)";
const TEXT_TAGS = "p,li,blockquote,article,section";

function isValidHttpUrl(str) {
  try {
    const u = new URL(str);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url") || "";

    if (!isValidHttpUrl(url)) {
      return NextResponse.json(
        { error: "Provide a valid http(s) URL via ?url=" },
        { status: 400 }
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(url, {
      headers: { "User-Agent": DEFAULT_UA, Accept: "text/html,*/*;q=0.8" },
      redirect: "follow",
      signal: controller.signal,
    }).catch((e) => {
      throw new Error(`Network error: ${e.message}`);
    });
    clearTimeout(timeout);

    if (!res || !res.ok) {
      return NextResponse.json(
        { error: `Fetch failed with status ${res?.status || "unknown"}` },
        { status: 502 }
      );
    }

    const contentType = (res.headers.get("content-type") || "").toLowerCase();
    if (!contentType.includes("text/html")) {
      
      if (!contentType.includes("text/plain")) {
        return NextResponse.json(
          { error: `Unsupported content-type: ${contentType}` },
          { status: 415 }
        );
      }
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const base = new URL(url);
    const absolutize = (href) => {
      if (!href) return null;
      try {
        return new URL(href, base).toString();
      } catch {
        return null;
      }
    };

    const title =
      $("title").first().text().trim() ||
      $('meta[property="og:title"]').attr("content") ||
      "";

    const description =
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      "";

    const faviconPath =
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href") ||
      "/favicon.ico";

    const headings = ["h1", "h2", "h3"].flatMap((tag) =>
      $(tag)
        .map((_, el) => {
          const text = $(el).text().replace(/\s+/g, " ").trim();
          return text ? { tag, text } : null;
        })
        .get()
        .filter(Boolean)
    );

    const links = Array.from(
      new Set(
        $("a[href]")
          .map((_, el) => $(el).attr("href") || "")
          .get()
          .map((href) => absolutize(href))
          .filter(Boolean)
      )
    ).slice(0, 200);

    const textChunks = $(TEXT_TAGS)
      .map((_, el) => $(el).text().replace(/\s+/g, " ").trim())
      .get()
      .filter(Boolean);

    const fullText = textChunks.join("\n").trim();
    const excerpt = fullText.slice(0, 2000);

    return NextResponse.json(
      {
        url,
        title,
        description,
        favicon: absolutize(faviconPath),
        headings,
        links,
        excerpt,
        html
      },
      {
        status: 200,
        headers: { "Cache-Control": "public, s-maxage=300, max-age=60" },
      }
    );
  } catch (err) {
    const msg =
      err?.name === "AbortError"
        ? "Request timed out (15s)"
        : err?.message || "Unexpected error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
