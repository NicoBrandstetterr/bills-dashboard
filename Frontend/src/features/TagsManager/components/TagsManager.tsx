import React from "react";
import TagsList from "./TagsList";
import TagEditor from "./TagEditor";
import type { Tag } from "../../../shared/types";
import type {UseTagsManagerResult} from "../hooks/useTagsManager";

interface Props {
  tags: Tag[];
  loading?: boolean;
  onAdd: UseTagsManagerResult["add"];
  onEdit: UseTagsManagerResult["edit"];
  onDelete: UseTagsManagerResult["remove"];
  containerClassName?: string;
}

export default function TagsManager({ tags, loading, onAdd, onEdit, onDelete, containerClassName = "" }: Props): React.ReactElement {
  return (
    <div className={`w-80 p-4 border-l bg-white shadow rounded ${containerClassName}`}>
      <h2 className="text-lg font-semibold">Tags</h2>
      <div className="mt-3">
        <TagEditor
          onSave={async (name) => {
            await onAdd(name);
          }}
          saveLabel="Add"
        />
      </div>

      <div className="mt-4">
        <TagsList tags={tags} loading={loading} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
}
