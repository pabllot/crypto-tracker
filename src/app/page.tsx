import ChildComponent from "./components/ChildComponent";
import CryptoTable from "./components/CryptoTable";

const baseUrl = 'https://crypto-tracker-g3zitv6s1-pabllots-projects.vercel.app/'

export default async function Page() {
  const [top10Res, allRes] = await Promise.all([
    fetch(`${baseUrl}/api/top10`, { next: { revalidate: 10 } }),
    fetch(`${baseUrl}/api/all`, { next: { revalidate: 10 } })
  ]);

  const [top10Data, allData] = await Promise.all([top10Res.json(), allRes.json()]);

  return <CryptoTable initialTop10={top10Data} initialAll={allData}>
    <ChildComponent />
  </CryptoTable>;
}

export const dynamic = "force-dynamic";
