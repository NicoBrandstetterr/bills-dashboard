import { BillsFeature } from "./features/bills";
import { WishListFeature } from "./features/wishList";
import TagsManager from "./features/TagsManager/components/TagsManager";
import {useTagsManager} from "./features/TagsManager/hooks/useTagsManager";
import TotalBillsManager from "./features/totalBills/components/TotalBillsManager";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import { useBills } from "./features/bills/hooks/useBills";

export default function App(): React.ReactElement {
  const { tags, loading, add, edit, remove } = useTagsManager();
  const [month, setMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const { bills, loading: billsLoading, reload, addBill, updateBill, deleteBill } = useBills(month);
  const [totalsRefreshKey, setTotalsRefreshKey] = useState<number>(0);

  const handleTagEdit = async (id: number, name: string) => {
    const t = await edit(id, name);
    setTotalsRefreshKey((k) => k + 1);
    return t;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto p-4 rounded">
        <div className="flex gap-6">
          <div className="flex-1 flex flex-col gap-6">
            <BillsFeature tags={tags} month={month} setMonth={setMonth} bills={bills} loading={billsLoading} reload={reload} addBill={addBill} updateBill={updateBill} deleteBill={deleteBill} />
            <WishListFeature />
          </div>
          <div className="flex flex-col gap-4">
            <TagsManager tags={tags} loading={loading} onAdd={add} onEdit={handleTagEdit} onDelete={remove} containerClassName="max-h-96 overflow-auto" />
            <TotalBillsManager tags={tags} month={month} refreshKey={totalsRefreshKey} />
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
