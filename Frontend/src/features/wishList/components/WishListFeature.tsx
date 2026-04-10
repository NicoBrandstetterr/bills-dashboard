import React, { useState } from "react";
import { useWishList } from "../hooks/useWishList";
import WishListTable from "./WishListTable";
import { Check, X } from "lucide-react";
import type { WishListPayload } from "../services/api";
import type { wishListRow } from "../model/wishListRow.type";
import toast from "react-hot-toast";

interface saveRowsParams {
  newRows: Array<wishListRow>;
  addItem: (payload: WishListPayload) => Promise<void>;
  reload: () => Promise<void>;
  setNewRows: React.Dispatch<React.SetStateAction<Array<wishListRow>>>;
}

function parseDecimal(value: string): number {
  return parseFloat(value.replace(',', '.'));
}

async function saveRows({ newRows, addItem, reload, setNewRows }: saveRowsParams) {
  for (const row of newRows) {
    try {
      const payload: WishListPayload = {
        name: row.name,
        price: parseDecimal(row.price),
        link: row.link,
      };
      await addItem(payload);
    } catch (err) {
      toast.error(`Failed to save wishlist item "${row.name}"`);
    }
  }
  setNewRows([]);
  reload();
}

export default function WishListFeature(): React.ReactElement {
  const { wishList, loading, reload, addItem, updateItem, deleteItem } = useWishList();
  const [newRows, setNewRows] = useState<Array<wishListRow>>([]);

  return (
    <div className="bg-white shadow p-4 rounded">
      <h1 className="text-2xl font-bold mb-4">Wishlist</h1>

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <>
          <WishListTable wishList={wishList} newRows={newRows} setNewRows={setNewRows} updateItem={updateItem} deleteItem={deleteItem} />

          {newRows.length > 0 && (
            <div className="flex justify-end gap-2 mt-4 items-center">
              <button onClick={() => setNewRows([])} title="Cancel" className="px-2 py-1 border rounded text-gray-600">
                <X size={18} />
              </button>
              <button onClick={() => saveRows({ newRows, addItem, reload, setNewRows })} title="Save" className="px-2 py-1 bg-green-600 text-white rounded">
                <Check size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
