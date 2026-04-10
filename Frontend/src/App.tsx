import { BillsFeature } from "./features/bills";
import { WishListFeature } from "./features/wishList";
import TagsManager from "./features/TagsManager/components/TagsManager";
import {useTagsManager} from "./features/TagsManager/hooks/useTagsManager";
import { Toaster } from "react-hot-toast";

export default function App(): React.ReactElement {
  const { tags, loading, add, edit, remove } = useTagsManager();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto p-4 rounded">
        <div className="flex gap-6">
          <div className="flex-1 flex flex-col gap-6">
            <BillsFeature tags={tags} />
            <WishListFeature />
          </div>
          <TagsManager tags={tags} loading={loading} onAdd={add} onEdit={edit} onDelete={remove} containerClassName="max-h-96 overflow-auto" />
        </div>
      </div>
      <Toaster />
    </div>
  );
}
