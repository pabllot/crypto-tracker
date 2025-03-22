import { NextResponse } from "next/server";

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  market_cap_rank?: number;
  current_price?: number;
  price_change_percentage_24h?: number;
  market_cap?: number;
  thumb?: string;
  large?: string;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  console.log("🔍 Fetching detailed data for:", query);

  if (!query) {
    return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });
  }

  try {
    const searchRes = await fetch(`https://api.coingecko.com/api/v3/search?query=${query}`, { cache: "no-store" });
    if (!searchRes.ok) throw new Error(`Search API failed: ${searchRes.statusText}`);

    const searchData = await searchRes.json();
    const coinIds = searchData.coins.map((coin:CryptoData) => coin.id).join(",");

    if (!coinIds) {
      return NextResponse.json({ error: "No matching coins found" }, { status: 404 });
    }

    const marketRes = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}`, {
      cache: "no-store",
    });
    if (!marketRes.ok) throw new Error(`Market API failed: ${marketRes.statusText}`);

    const marketData = await marketRes.json();

    return NextResponse.json(marketData);
  } catch (error) {
    console.error("❌ API Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
