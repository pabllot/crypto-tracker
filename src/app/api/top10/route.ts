export async function GET() {
  console.log("⏳ Fetching fresh crypto data from CoinGecko...");
  
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1",
      { headers: { "Content-Type": "application/json" }, next: { revalidate: 30 } } // Cache for 30 sec
    );

    if (!res.ok) {
      throw new Error("Failed to fetch crypto data");
    }

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), { status: 500 });
  }
}
