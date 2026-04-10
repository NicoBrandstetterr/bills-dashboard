import { useState, useEffect } from "react";
import { getWishList, postWishListItem, patchWishListItem, deleteWishListItem, WishListItem, WishListPayload } from "../services/api";
import toast from "react-hot-toast";

export function useWishList() {
  const [wishList, setWishList] = useState<WishListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getWishList();
        if (mounted) setWishList(data);
      } catch (e) {
        toast.error("Failed to load wishlist");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const reload = async () => {
    setLoading(true);
    try {
      const data = await getWishList();
      setWishList(data);
    } catch (e) {
      toast.error("Failed to reload wishlist");
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (payload: WishListPayload) => {
    await postWishListItem(payload);
    await reload();
  };

  const updateItem = async (id: number, payload: Partial<WishListPayload>) => {
    await patchWishListItem(id, payload);
    await reload();
  };

  const deleteItem = async (id: number) => {
    await deleteWishListItem(id);
    await reload();
  };

  return { wishList, loading, reload, addItem, updateItem, deleteItem } as const;
}
