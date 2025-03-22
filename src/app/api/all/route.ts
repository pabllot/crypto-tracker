import { NextResponse } from "next/server";
import NodeCache from "node-cache";

// Initialize cache (stores data for 60 seconds)
const cache = new NodeCache({ stdTTL: 60 }); 

export async function GET() {
  console.log("⏳ Checking cache for ALL cryptocurrencies...");

  // Check if data is already cached
  const cachedData = cache.get("allCryptoData");
  if (cachedData) {
    console.log("✅ Cache hit! Returning cached ALL crypto data.");
    return NextResponse.json(cachedData);
  }

  console.log("🚀 Cache miss. Fetching ALL cryptocurrencies from CoinGecko...");

  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1",
      { headers: { "Content-Type": "application/json" } }
    );

    if (!res.ok) {
      throw new Error(`❌ Failed to fetch crypto data: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    // Store in cache for future requests
    cache.set("allCryptoData", data);
    console.log("🗃️ ALL crypto data cached successfully.");

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), { status: 500 });
  }
}
