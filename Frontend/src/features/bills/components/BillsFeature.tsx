import React, { useState } from "react";
import { useBills } from "../hooks/useBills";
import BillsTable from "./BillsTable";
import { Check, X, ArrowUp, ArrowDown, Equal } from "lucide-react";
import type { BillPayload } from "../services/api";
import { uploadBillsJsonFile, uploadBillsJson } from "../services/api";
import type {billRow} from "../model/billsRow.type";
import type { Tag } from "../../../shared/types";
import toast from "react-hot-toast";


interface addRowParams {
  setNewRows: React.Dispatch<React.SetStateAction<Array<billRow>>>;
  newRows: Array<billRow>;
  tags: Tag[];
}
// removed unused addRow helper (add row is now the '+' hover row in the table)



interface saveRowsParams {
  newRows: Array<billRow>;
  month: string;
  addBill: (payload: BillPayload) => Promise<void>;
  reload: () => Promise<void>;
  setNewRows: React.Dispatch<React.SetStateAction<Array<billRow>>>;
}

function useMonthlyBills() {
    const [month, setMonth] = useState<string>(() => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    });
    const { bills, loading, reload, addBill, updateBill, deleteBill } = useBills(month);
    return { month, setMonth, bills, loading, reload, addBill, updateBill, deleteBill } as const;
  }
interface Props {
  tags: Tag[];
}

export default function BillsFeature({ tags }: Props): React.ReactElement {
  const { month, setMonth, bills, loading, reload, addBill, updateBill, deleteBill } = useMonthlyBills();
  const [newRows, setNewRows] = useState<Array<billRow>>([]);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const totalIncome = bills
    .filter(bill => bill.type === "income")
    .reduce((sum, bill) => sum + parseFloat(String(bill.value)), 0);

  const totalExpenses = bills
    .filter(bill => bill.type === "expense")
    .reduce((sum, bill) => sum + parseFloat(String(bill.value)), 0);

  const available = totalIncome - totalExpenses;

  return (
    <div className="bg-white shadow p-4 rounded h-full">
      <h1 className="text-2xl font-bold mb-4">Bills Dashboard</h1>

      <div className="flex items-center gap-4 mb-4">
        <label className="font-medium">Month:</label>
        <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="border p-2 rounded" />

        <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-lg">
          <ArrowUp className="w-4 h-4" />
          <span className="font-semibold">${totalIncome.toFixed(2)}</span>
        </div>

        <div className="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-2 rounded-lg">
          <ArrowDown className="w-4 h-4" />
          <span className="font-semibold">${totalExpenses.toFixed(2)}</span>
        </div>

        <div className="flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-2 rounded-lg">
          <Equal className="w-4 h-4" />
          <span className="font-semibold">${available.toFixed(2)}</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <input
            id="jsonFileInput"
            type="file"
            accept=".json,application/json"
            onChange={async (e) => {
              const f = e.target.files?.[0] ?? null;
              if (!f) return;
              setJsonFile(f);
              const reader = new FileReader();
              reader.onload = async (ev) => {
                const text = ev.target?.result;
                if (typeof text !== "string") {
                  toast.error("No se pudo leer el archivo");
                  setJsonFile(null);
                  e.currentTarget.value = "";
                  return;
                }
                let parsed: any;
                try {
                  parsed = JSON.parse(text);
                } catch (parseErr) {
                  toast.error("JSON inválido: " + (parseErr instanceof Error ? parseErr.message : String(parseErr)));
                  setJsonFile(null);
                  e.currentTarget.value = "";
                  return;
                }

                setUploading(true);
                try {
                  await uploadBillsJson(parsed);
                  toast.success("Importación completada");
                  setJsonFile(null);
                  e.currentTarget.value = "";
                  await reload();
                } catch (err) {
                  console.error(err);
                  toast.error("Error al importar: " + (err instanceof Error ? err.message : String(err)));
                } finally {
                  setUploading(false);
                }
              };
              reader.onerror = () => {
                toast.error("Error leyendo el archivo");
                setJsonFile(null);
                e.currentTarget.value = "";
              };
              reader.readAsText(f, "utf-8");
            }}
            className="hidden"
          />

          <label htmlFor="jsonFileInput" className={`cursor-pointer px-3 py-2 rounded text-white ${uploading ? "bg-gray-400" : "bg-blue-600"}`}>
            {uploading ? "Subiendo..." : "Importar JSON"}
          </label>

          {jsonFile ? <span className="text-sm text-gray-600 ml-2">{jsonFile.name}</span> : null}
        </div>
      </div>

      <BillsTable bills={bills} newRows={newRows} setNewRows={setNewRows} tags={tags} updateBill={updateBill} deleteBill={deleteBill} addBill={addBill} reload={reload} month={month} />
    </div>
  );
}
