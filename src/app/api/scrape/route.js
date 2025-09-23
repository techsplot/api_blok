// src/app/api/scrape/route.js
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_UA =
  "Mozilla/5.0 (compatible; NextScraper/1.0; +https://example.com/bot)";

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
      return NextResponse.json(
        { error: `Unsupported content-type: ${contentType}` },
        { status: 415 }
      );
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // ---- Extract all code blocks ----
    const codeBlocks = $("pre code")
      .map((_, el) => {
        const code = $(el).text().trim();
        const lang =
          $(el).attr("class")?.replace("language-", "").trim() || "";
        return code
          ? {
              language: lang || "plaintext",
              code,
            }
          : null;
      })
      .get();

    return NextResponse.json(
      {
        codeBlocks,
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
