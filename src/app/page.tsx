import ChildComponent from "./components/ChildComponent";
import CryptoTable from "./components/CryptoTable";

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` // ✅ Use Vercel URL in production
  : "http://localhost:3000"; // ✅ Fallback to localhost for local development


export default async function Page() {
  const [top10Res, allRes] = await Promise.all([
    fetch(`${baseUrl}/api/top10`, { next: { revalidate: 10 } }),
    fetch(`${baseUrl}//api/all`, { next: { revalidate: 10 } })
  ]);

  const [top10Data, allData] = await Promise.all([top10Res.json(), allRes.json()]);

  return <CryptoTable initialTop10={top10Data} initialAll={allData}>
    <ChildComponent />
  </CryptoTable>;
}

export const dynamic = "force-dynamic";
