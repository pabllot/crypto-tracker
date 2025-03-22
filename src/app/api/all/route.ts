export async function GET() {
  console.log("⏳ Fetching ALL cryptocurrencies from CoinGecko...");

  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1",
      { headers: { "Content-Type": "application/json" }, next: { revalidate: 30 } } 
    );

    if (!res.ok) {
      throw new Error("Failed to fetch crypto data");
    }

    const data = await res.json();
    const respose = Response.json(data);
    respose.headers.set("Access-Control-Allow-Origin", "*"); // Allow all origins
    respose.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    return respose;
    } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), { status: 500 });
  }
}
