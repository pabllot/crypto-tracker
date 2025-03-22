import ChildComponent from "./components/ChildComponent";
import CryptoTable from "./components/CryptoTable";

export default async function Page() {
  const [top10Res, allRes] = await Promise.all([
    fetch("http://localhost:3000/api/top10", { next: { revalidate: 10 } }),
    fetch("http://localhost:3000/api/all", { next: { revalidate: 10 } })
  ]);

  const [top10Data, allData] = await Promise.all([top10Res.json(), allRes.json()]);

  return <CryptoTable initialTop10={top10Data} initialAll={allData}>
    <ChildComponent />
  </CryptoTable>;
}
