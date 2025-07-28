import { useState, useRef } from "react";
import { X, ChevronDown, X as XIcon } from "lucide-react";
import { Editor, type EditorTextChangeEvent } from "primereact/editor";
import Button from "components/utils/button";
import { useAuthContext } from "store/auth.context";
import { useKnowledgeBaseContext } from "store/knowledgeBase.context";
import { API } from "api";
import { toast } from "react-hot-toast";
import { IState } from "types/knowledgeBase.type";
import "./createKnowledgeModal.css";

interface CreateKnowledgeModalProps {
  isModalOpen: boolean;
  onCloseModal: () => void;
  onOpenModal: () => void;
}

type FormData = {
  title: string;
  content: string;
  state: IState;
  tags: string[];
};

export default function CreateKnowledgeModal({
  isModalOpen,
  onCloseModal,
}: CreateKnowledgeModalProps) {
  const { user } = useAuthContext();
  const { fetchKnowledgeBases } = useKnowledgeBaseContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [newTag, setNewTag] = useState("");

  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
    state: IState.PRIVATE,
    tags: [],
  });

  const stateRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditorChange = (e: EditorTextChangeEvent) => {
    setFormData((prev) => ({
      ...prev,
      content: e.htmlValue || "",
    }));
  };

  const handleStateClick = async (state: IState) => {
    setFormData({ ...formData, state });
    await new Promise((resolve) => setTimeout(resolve, 100));
    setIsStateOpen(false);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!formData.content.trim()) {
      toast.error("Content is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const knowledgeBaseData = {
        title: formData.title.trim(),
        content: formData.content,
        tags: formData.tags,
        state: formData.state,
        author: user.id,
      };

      await API.knowledgeBaseHandler.create(knowledgeBaseData);

      toast.success("Knowledge base article created successfully!");

      // Reset form
      setFormData({
        title: "",
        content: "",
        state: IState.PRIVATE,
        tags: [],
      });

      // Reload knowledge bases
      await fetchKnowledgeBases();

      // Close modal
      onCloseModal();
    } catch (error) {
      console.error("Error creating knowledge base:", error);
      toast.error("Failed to create knowledge base article");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setFormData({
        title: "",
        content: "",
        state: IState.PRIVATE,
        tags: [],
      });
      setNewTag("");
      onCloseModal();
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-black border border-white/20 rounded-lg w-2/3 h-4/5 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/20">
          <h2 className="text-xl font-semibold">
            Create Knowledge Base Article
          </h2>
          <button
            onClick={handleCloseModal}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 flex">
          {/* Left Section - Rich Text Editor */}
          <div className="w-1/2 p-6 border-r border-white/20 flex flex-col">
            <div className="flex-1 flex flex-col">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-green/50"
                  placeholder="Enter article title"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex-1 flex flex-col">
                <label className="block text-sm font-medium mb-2">
                  Content
                </label>
                <div className="flex-1 bg-white/5 border border-white/20 rounded-lg overflow-hidden">
                  <Editor
                    value={formData.content}
                    onTextChange={handleEditorChange}
                    style={{ height: "100%" }}
                    readOnly={isSubmitting}
                    className="knowledge-base-editor"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Settings */}
          <div className="w-1/2 p-6 flex flex-col">
            <div className="space-y-6">
              {/* State Picker */}
              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <div className="relative">
                  <div
                    ref={stateRef}
                    onClick={() => setIsStateOpen(!isStateOpen)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-green/50 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm capitalize">
                        {formData.state}
                      </span>
                      <ChevronDown size={16} className="text-white/60" />
                    </div>
                  </div>

                  {isStateOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-white/20 rounded-lg z-10">
                      {Object.values(IState).map((state) => (
                        <div
                          key={state}
                          onClick={() => handleStateClick(state)}
                          className="px-4 py-2 hover:bg-white/10 cursor-pointer text-sm capitalize"
                        >
                          {state}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="space-y-3">
                  {/* Add Tag Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-green/50"
                      placeholder="Add a tag"
                      disabled={isSubmitting}
                    />
                    <Button
                      buttonText="Add"
                      onPress={handleAddTag}
                      disabled={!newTag.trim() || isSubmitting}
                      className="px-4 py-2"
                    />
                  </div>

                  {/* Tags List */}
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-1 bg-white/10 text-white/80 text-sm rounded-full"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-red-400 transition-colors"
                          disabled={isSubmitting}
                        >
                          <XIcon size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Author Info */}
              <div>
                <label className="block text-sm font-medium mb-2">Author</label>
                <div className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg">
                  <span className="text-sm text-white/80">
                    {user?.username || "Current User"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto pt-6 flex gap-3">
              <Button
                buttonText="Cancel"
                onPress={handleCloseModal}
                disabled={isSubmitting}
                className="flex-1 bg-white/10 border border-white/20 hover:bg-white/20"
              />
              <Button
                buttonText={isSubmitting ? "Creating..." : "Create Article"}
                onPress={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-green/50 border border-green"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
