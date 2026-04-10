import { useEffect, useState } from "react";
import type { Tag } from "../../../shared/types";
import { getTags, createTag, updateTag, deleteTag } from "../services/api";
import toast from "react-hot-toast";

export interface UseTagsManagerResult {
  tags: Tag[];
  loading: boolean;
  reload: () => Promise<void>;
  add: (name: string) => Promise<Tag>;
  edit: (id: number, name: string) => Promise<Tag>;
  remove: (id: number) => Promise<void>;
}


export function useTagsManager(): UseTagsManagerResult {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getTags();
        if (mounted) setTags(data);
      } catch (e) {
        toast.error("Failed to load tags");
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
      const data = await getTags();
      setTags(data);
    } catch (e) {
      toast.error("Failed to reload tags");
    } finally {
      setLoading(false);
    }
  };

  const add = async (name: string) => {
    setLoading(true);
    try {
      const t = await createTag(name);
      setTags((s) => [...s, t].sort((a, b) => a.name.localeCompare(b.name)));
      return t;
    } finally {
      setLoading(false);
    }
  };

  const edit = async (id: number, name: string) => {
    setLoading(true);
    try {
      const t = await updateTag(id, name);
      setTags((s) => s.map((x) => (x.id === t.id ? t : x)).sort((a, b) => a.name.localeCompare(b.name)));
      return t;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: number) => {
    setLoading(true);
    try {
      await deleteTag(id);
      setTags((s) => s.filter((x) => x.id !== id));
    } finally {
      setLoading(false);
    }
  };

  return { tags, loading, reload, add, edit, remove } as const;
}
