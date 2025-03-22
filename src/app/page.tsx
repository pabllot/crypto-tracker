import ChildComponent from "./components/ChildComponent";
import CryptoTable from "./components/CryptoTable";

const baseUrl = 'https://crypto-tracker-g3zitv6s1-pabllots-projects.vercel.app/'
export default async function Page() {
  try {
    console.log(`📡 Fetching data from: ${baseUrl}`);

    const [top10Res, allRes] = await Promise.all([
      fetch(`${baseUrl}/api/top10`, { next: { revalidate: 10 } }),
      fetch(`${baseUrl}/api/all`, { next: { revalidate: 10 } }),
    ]);

    if (!top10Res.ok || !allRes.ok) {
      console.error("❌ API Fetch Error:", top10Res.status, allRes.status);
      return <h1 className="text-red-500">⚠️ API Error: {top10Res.status}, {allRes.status}</h1>;
    }

    const contentTypeTop10 = top10Res.headers.get("content-type");
    const contentTypeAll = allRes.headers.get("content-type");

    if (!contentTypeTop10?.includes("application/json") || !contentTypeAll?.includes("application/json")) {
      console.error("❌ API returned non-JSON response!");
      return <h1 className="text-red-500">⚠️ API Error: Invalid response type.</h1>;
    }

    const [top10Data, allData] = await Promise.all([
      top10Res.json(),
      allRes.json()
    ]);

    return (
      <CryptoTable initialTop10={top10Data} initialAll={allData}>
        <ChildComponent />
      </CryptoTable>
    );
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    return <h1 className="text-red-500">⚠️ Failed to load crypto data.</h1>;
  }
}

export const dynamic = "force-dynamic";
