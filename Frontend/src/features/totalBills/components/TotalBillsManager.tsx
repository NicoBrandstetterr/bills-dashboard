import React from "react";
import TotalBill from "./TotalBill";
import { useTotalBills } from "../hooks/useTotalBills";
import type { Tag } from "../../../shared/types";

interface Props {
  month?: string;
  tags?: Tag[];
}

export default function TotalBillsManager({ month, tags = [] }: Props) {
  const { items, loading } = useTotalBills(tags, month);

  return (
    <div className="w-80 p-4 border-l bg-white shadow rounded">
      <h2 className="text-lg font-semibold">Totals</h2>
      <div className="mt-3 space-y-3">
        {loading && <div className="text-sm text-gray-500">Loading...</div>}
        {items.map((it) => (
          <TotalBill key={it.id} name={it.name} value={it.value} variant={it.type as any} subtitle={it.subtitle} />
        ))}
      </div>
    </div>
  );
}
