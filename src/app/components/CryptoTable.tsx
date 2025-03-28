"use client";

import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import useCryptoStore from "../../../store/useCryptoStore";
import type { CryptoData } from "../types/CryptoTable";

export default function CryptoTable({ initialTop10, initialAll, children }: { initialTop10: CryptoData[], initialAll: CryptoData[], children: React.ReactNode }) {
  const { searchTerm, setSearchTerm } = useCryptoStore();
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [cryptoType, setCryptoType] = useState<"top10" | "all">("top10");

  const [page, setPage] = useState(0);
  const pageSize = 10;

  const data = useMemo(() => (cryptoType === "top10" ? initialTop10 : initialAll), [cryptoType, initialTop10, initialAll]);

  const handleSearch = () => setSearchTerm(localSearchTerm.trim());

  const handleRemoveSearch = () => {
    setSearchTerm('');
    setLocalSearchTerm('');
  };

  const handleToggle = () => {
    const startTime = performance.now();

    setCryptoType((prev) => {
      const newType = prev === "top10" ? "all" : "top10";

      setPage(0);

      requestAnimationFrame(() => {
        const endTime = performance.now();
        console.log(`🔄 Switch to "${newType}" took ${(endTime - startTime).toFixed(2)}ms`);
      });

      return newType;
    });
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    const startTime = performance.now();

    const filteredData = data?.filter((crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setPage(0)

    const endTime = performance.now();

    console.log(`🔍 Search took ${(endTime - startTime).toFixed(2)}ms`);
    return filteredData;
  }, [data, searchTerm]);

  const paginatedData = useMemo(() => {
    return filteredData?.slice(page * pageSize, (page + 1) * pageSize);
  }, [filteredData, page]);

  const columns: ColumnDef<CryptoData>[] = useMemo(() => [
    { accessorKey: "market_cap_rank", header: "Rank" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "symbol", header: "Symbol" },
    { accessorKey: "current_price", header: "Price ($)", cell: (info) => `$${(info.getValue() as number).toFixed(2)}` },
    { accessorKey: "price_change_percentage_24h", header: "24h Change (%)", cell: (info) => `${(info.getValue() as number).toFixed(2)}%` },
  ], []);

  const table = useReactTable({
    data: paginatedData,
    columns,
    state: { globalFilter: searchTerm },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search crypto..."
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer">
          Search
        </button>
        <button onClick={handleRemoveSearch} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer">
          Clear
        </button>
        <button onClick={handleToggle} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer">
          {cryptoType === "top10" ? "Show All Cryptos" : "Show Top 10"}
        </button>
      </div>

      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className="bg-gray-500">
              {headerGroup.headers.map(header => (
                <th key={header.id} onClick={header.column.getToggleSortingHandler()} className="border border-gray-400 p-2 cursor-pointer">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() === "asc" ? " 🔼" : header.column.getIsSorted() === "desc" ? " 🔽" : ""}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-gray-600">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="border border-gray-400 p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {filteredData.length > pageSize &&
        <div className="flex justify-center gap-2 mt-4">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50 cursor-pointer"
          >
            Previous
          </button>
          <span>Page {page + 1} of {Math.ceil(filteredData.length / pageSize)}</span>
          <button
            disabled={(page + 1) * pageSize >= filteredData.length}
            onClick={() => setPage(page + 1)}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>
      }
      {children}
    </div>
  );
}


// const fetchCryptos = async (query: string) => {
//   const res = await fetch(`/api/search?q=${query}`);
//   return res.json();
// };

// const { data: searchResults } = useQuery<CryptoData[]>({
//   queryKey: ["search", searchTerm],
//   queryFn: () => fetchCryptos(searchTerm),
//   enabled: Boolean(searchTerm),
//   staleTime: 60000 // 60 seconds
// });


// const data = useMemo(() => {
//   if (searchTerm && searchResults) return searchResults;
//   return cryptoType === "top10" ? initialTop10 : initialAll;
// }, [cryptoType, initialTop10, initialAll, searchResults, searchTerm])