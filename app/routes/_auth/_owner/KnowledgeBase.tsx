import { useState } from "react";
import { useKnowledgeBaseContext } from "store/knowledgeBase.context";
import Button from "components/utils/button";
import CreateKnowledgeModal from "components/modals/createKnowledgeModal";
import {
  Search,
  BookOpen,
  Plus,
  Eye,
  MessageSquare,
  Activity,
  BarChart3,
  User,
  Shield,
  Users,
  Calendar,
  Send,
} from "lucide-react";
import dayjs from "dayjs";
import type { IKnowledgeBase } from "types/knowledgeBase.type";
import { useAuthContext } from "store/auth.context";
import { toast } from "react-hot-toast";
import { API } from "api";

type TabType = "content" | "insights" | "comments" | "activity";

export default function OrgKnowledgeBase() {
  const {
    knowledgeBases,
    loading,
    selectedKnowledgeBase,
    setSelectedKnowledgeBase,
    fetchKnowledgeBase,
  } = useKnowledgeBaseContext();
  const { user } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("content");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isAddingComment, setIsAddingComment] = useState(false);

  // Filter knowledge bases based on search
  const filteredKnowledgeBases = knowledgeBases.filter((kb) =>
    kb.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleKnowledgeBaseSelect = (knowledgeBase: IKnowledgeBase) => {
    setSelectedKnowledgeBase(knowledgeBase);
  };

  const handleCreateArticle = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedKnowledgeBase || !user) return;

    setIsAddingComment(true);
    try {
      await API.commentHandler.create({
        content: newComment.trim(),
        author: user.id,
        knowledgeBase: selectedKnowledgeBase.id.toString(),
      });

      setNewComment("");
      toast.success("Comment added successfully");

      // Refresh the knowledge base to get updated comments
      await fetchKnowledgeBase(selectedKnowledgeBase.documentId);
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setIsAddingComment(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const getTagsArray = (tags: string | string[]) => {
    if (Array.isArray(tags)) {
      return tags;
    }
    try {
      return JSON.parse(tags);
    } catch {
      return [];
    }
  };

  const renderTabContent = () => {
    if (!selectedKnowledgeBase) {
      return (
        <div className="flex items-center justify-center h-64 text-white/60">
          <div className="text-center">
            <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Select an Article</h3>
            <p className="text-sm">
              Choose an article from the list to view its details
            </p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "content":
        return (
          <div className="prose prose-invert max-w-none">
            <div
              className="text-white/90 leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{
                __html: selectedKnowledgeBase.content
                  .replace(
                    /^# (.+)$/gm,
                    '<h1 class="text-3xl font-bold text-white mb-4">$1</h1>'
                  )
                  .replace(
                    /^## (.+)$/gm,
                    '<h2 class="text-2xl font-bold text-white mb-3">$1</h2>'
                  )
                  .replace(
                    /^### (.+)$/gm,
                    '<h3 class="text-xl font-bold text-white mb-2">$1</h3>'
                  )
                  .replace(
                    /^#### (.+)$/gm,
                    '<h4 class="text-lg font-bold text-white mb-2">$1</h4>'
                  )
                  .replace(
                    /^##### (.+)$/gm,
                    '<h5 class="text-base font-bold text-white mb-1">$1</h5>'
                  )
                  .replace(
                    /^###### (.+)$/gm,
                    '<h6 class="text-sm font-bold text-white mb-1">$1</h6>'
                  )
                  .replace(
                    /\*\*(.+?)\*\*/g,
                    '<strong class="font-bold">$1</strong>'
                  )
                  .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
                  .replace(
                    /`(.+?)`/g,
                    '<code class="bg-white/10 px-2 py-1 rounded text-sm font-mono">$1</code>'
                  )
                  .replace(
                    /!\[([^\]]*)\]\(([^)]+)\)/g,
                    '<div class="my-6"><img src="$2" alt="$1" class="w-full h-[30rem] rounded-lg shadow-lg border border-white/10" /></div>'
                  )
                  .replace(/\n\n/g, '</p><p class="mb-4">')
                  .replace(/^(.+)$/gm, (match: string) => {
                    if (
                      match.startsWith("<h") ||
                      match.startsWith("<div") ||
                      match.startsWith("<img")
                    ) {
                      return match;
                    }
                    if (match.trim() === "") {
                      return "";
                    }
                    return `<p class="mb-4 leading-relaxed">${match}</p>`;
                  }),
              }}
            />
          </div>
        );

      case "insights":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye size={16} className="text-blue-400" />
                  <span className="text-sm text-white/60">Views</span>
                </div>
                <p className="text-2xl font-bold">2</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare size={16} className="text-green-400" />
                  <span className="text-sm text-white/60">Comments</span>
                </div>
                <p className="text-2xl font-bold">
                  {selectedKnowledgeBase.comments?.length || 0}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 size={16} className="text-purple-400" />
                  <span className="text-sm text-white/60">Rating</span>
                </div>
                <p className="text-2xl font-bold">4.8</p>
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Usage Analytics</h3>
              <p className="text-white/60">
                Analytics data will be displayed here
              </p>
            </div>
          </div>
        );

      case "comments":
        return (
          <div className="flex flex-col h-full">
            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedKnowledgeBase.comments &&
              selectedKnowledgeBase.comments.length > 0 ? (
                selectedKnowledgeBase.comments.map((comment) => (
                  <div key={comment.id} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      {comment.author?.profile?.url ? (
                        <img
                          src={comment.author.profile.url}
                          alt={comment.author.username}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                          <User size={16} />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {comment.author?.username}
                          </span>
                          <span className="text-xs text-white/40">
                            {dayjs(comment.createdAt).format("MMM DD, YYYY")}
                          </span>
                        </div>
                        <p className="text-sm text-white/80">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-white/60">
                  <MessageSquare
                    size={48}
                    className="mx-auto mb-4 opacity-50"
                  />
                  <p>No comments yet</p>
                  <p className="text-sm mt-2">Be the first to add a comment!</p>
                </div>
              )}
            </div>

            {/* Comment Input */}
            <div className="p-6 border-t border-white/20">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-green/50"
                  disabled={isAddingComment}
                />
                <Button
                  buttonText={isAddingComment ? "Adding..." : "Send"}
                  icon={<Send size={16} />}
                  onPress={handleAddComment}
                  disabled={isAddingComment || !newComment.trim()}
                  className="bg-green/50 border border-green"
                />
              </div>
            </div>
          </div>
        );

      case "activity":
        return (
          <div className="space-y-4">
            {selectedKnowledgeBase.activities &&
            selectedKnowledgeBase.activities.length > 0 ? (
              selectedKnowledgeBase.activities.map((activity) => (
                <div key={activity.id} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <Activity size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white/80">
                        {activity.content}
                      </p>
                      <p className="text-xs text-white/40">
                        {dayjs(activity.createdAt).format("MMM DD, YYYY HH:mm")}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-white/60">
                <Activity size={48} className="mx-auto mb-4 opacity-50" />
                <p>No activity yet</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/20 py-4 px-6">
        <h1 className="text-2xl font-semibold">Knowledge Base</h1>
        <Button
          buttonText="Add Article"
          icon={<Plus size={20} />}
          onPress={handleCreateArticle}
          className="bg-green/50 border border-green"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex max-h-screen overflow-y-auto">
        {/* Left Section - Article List */}
        <div className="w-1/4 border-r border-white/20 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-white/20">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-green/50"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60"
                size={16}
              />
            </div>
          </div>

          {/* Article List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-3">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg animate-pulse"
                  >
                    <div className="w-6 h-6 bg-white/10 rounded animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-white/10 rounded animate-pulse mb-1" />
                      <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredKnowledgeBases.length > 0 ? (
              <div className="p-4 space-y-2">
                {filteredKnowledgeBases.map((kb) => (
                  <div
                    key={kb.documentId}
                    onClick={() => handleKnowledgeBaseSelect(kb)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedKnowledgeBase?.documentId === kb.documentId
                        ? "bg-green/20 border border-green/30"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <BookOpen
                      size={20}
                      className="text-white/60 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {kb.title}
                      </h3>
                      <p className="text-xs text-white/40 truncate">
                        {dayjs(kb.updatedAt).format("MMM DD, YYYY")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-white/60">
                {searchQuery ? "No articles found" : "No articles yet"}
              </div>
            )}
          </div>
        </div>

        {/* Center Section - Article Content */}
        <div className="w-2/4 flex flex-col">
          {selectedKnowledgeBase ? (
            <>
              {/* Article Header */}
              <div className="p-6 border-b border-white/20">
                <h2 className="text-2xl font-bold mb-3">
                  {selectedKnowledgeBase.title}
                </h2>
                <div className="flex items-center gap-4">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-sm rounded">
                    Published
                  </span>
                  <span className="text-sm text-white/60">
                    Last edited{" "}
                    {dayjs(selectedKnowledgeBase.updatedAt).format(
                      "MMM DD, YYYY"
                    )}
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-white/20">
                <div className="flex">
                  {[
                    { id: "content", label: "Content", icon: BookOpen },
                    { id: "insights", label: "Insights", icon: BarChart3 },
                    { id: "comments", label: "Comments", icon: MessageSquare },
                    { id: "activity", label: "Activity", icon: Activity },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? "border-green-500 text-green-400"
                          : "border-transparent text-white/60 hover:text-white/80"
                      }`}
                    >
                      <tab.icon size={16} />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {renderTabContent()}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-white/60">
                <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">
                  Select an Article
                </h3>
                <p className="text-sm">
                  Choose an article from the list to view its details
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Section - Article Details */}
        <div className="w-1/4 border-l border-white/20 flex flex-col">
          <div className="p-4 border-b border-white/20">
            <h3 className="text-lg font-semibold">Article Details</h3>
          </div>

          {selectedKnowledgeBase ? (
            <div className="flex-1 p-4 space-y-6">
              {/* Permission */}
              <div>
                <h4 className="text-sm font-medium text-white/60 mb-2">
                  Permission
                </h4>
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-white/60" />
                  <span className="text-sm capitalize">
                    {selectedKnowledgeBase.state}
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className="text-sm font-medium text-white/60 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {getTagsArray(selectedKnowledgeBase.tags || "[]").map(
                    (tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Creator */}
              <div>
                <h4 className="text-sm font-medium text-white/60 mb-2">
                  Creator
                </h4>
                <div className="flex items-center gap-3">
                  {selectedKnowledgeBase.author?.profile?.url ? (
                    <img
                      src={selectedKnowledgeBase.author.profile.url}
                      alt={selectedKnowledgeBase.author.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <User size={16} />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium">
                      {selectedKnowledgeBase.author?.username}
                    </p>
                    <p className="text-xs text-white/40">
                      {selectedKnowledgeBase.author?.userRole}
                    </p>
                  </div>
                </div>
              </div>

              {/* Agent Access */}
              <div>
                <h4 className="text-sm font-medium text-white/60 mb-2">
                  Agent Access
                </h4>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-white/60" />
                  <span className="text-sm">
                    {selectedKnowledgeBase.state === "public"
                      ? "Everyone"
                      : "Current Organisation"}
                  </span>
                </div>
              </div>

              {/* Created Date */}
              <div>
                <h4 className="text-sm font-medium text-white/60 mb-2">
                  Created
                </h4>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-white/60" />
                  <span className="text-sm">
                    {dayjs(selectedKnowledgeBase.createdAt).format(
                      "MMM DD, YYYY"
                    )}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-white/60">
                <p className="text-sm">Select an article to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Knowledge Base Modal */}
      <CreateKnowledgeModal
        isModalOpen={isCreateModalOpen}
        onCloseModal={handleCloseCreateModal}
        onOpenModal={handleCreateArticle}
      />
    </main>
  );
}
