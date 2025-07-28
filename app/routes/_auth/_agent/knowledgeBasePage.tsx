import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, BookOpen, Filter, Plus } from "lucide-react";
import { Button } from "components/utils/button";
import { toast } from "react-hot-toast";

interface IKnowledgeBase {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    username: string;
    email: string;
  };
}

export default function AgentKnowledgeBasePage() {
  const navigate = useNavigate();
  const [knowledgeBases, setKnowledgeBases] = useState<IKnowledgeBase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<IKnowledgeBase | null>(
    null
  );

  useEffect(() => {
    fetchKnowledgeBases();
  }, []);

  const fetchKnowledgeBases = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/knowledge-base');
      // const data = await response.json();

      // Mock data for now
      const mockKnowledgeBases: IKnowledgeBase[] = [
        {
          id: 1,
          title: "How to Reset User Password",
          content:
            "This guide explains the step-by-step process for resetting a user's password in the system. First, navigate to the user management section...",
          category: "User Management",
          tags: ["password", "reset", "user"],
          createdAt: "2024-01-10T09:00:00Z",
          updatedAt: "2024-01-15T14:30:00Z",
          author: {
            id: 1,
            username: "admin",
            email: "admin@example.com",
          },
        },
        {
          id: 2,
          title: "Common Login Issues and Solutions",
          content:
            "This article covers the most common login issues that users encounter and provides detailed solutions for each problem...",
          category: "Troubleshooting",
          tags: ["login", "authentication", "troubleshooting"],
          createdAt: "2024-01-08T11:00:00Z",
          updatedAt: "2024-01-12T16:45:00Z",
          author: {
            id: 2,
            username: "support_agent",
            email: "support@example.com",
          },
        },
        {
          id: 3,
          title: "System Requirements and Compatibility",
          content:
            "Learn about the minimum system requirements and browser compatibility for optimal performance...",
          category: "System",
          tags: ["requirements", "compatibility", "browser"],
          createdAt: "2024-01-05T10:30:00Z",
          updatedAt: "2024-01-10T13:20:00Z",
          author: {
            id: 1,
            username: "admin",
            email: "admin@example.com",
          },
        },
      ];

      setKnowledgeBases(mockKnowledgeBases);
    } catch (error) {
      console.error("Error fetching knowledge base:", error);
      toast.error("Failed to load knowledge base");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredKnowledgeBases = knowledgeBases.filter((kb) => {
    const matchesSearch =
      kb.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kb.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kb.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      categoryFilter === "all" || kb.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const categories = [
    "all",
    ...Array.from(new Set(knowledgeBases.map((kb) => kb.category))),
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-white/10 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-white/10 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Knowledge Base</h1>
          <p className="text-white/70 mt-1">
            Find solutions and guides to help resolve issues
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50"
            size={20}
          />
          <input
            type="text"
            placeholder="Search knowledge base..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-green/50"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-green/50"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "all" ? "All Categories" : category}
            </option>
          ))}
        </select>
      </div>

      {/* Knowledge Base Articles */}
      {filteredKnowledgeBases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredKnowledgeBases.map((article) => (
            <div
              key={article.id}
              className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => setSelectedArticle(article)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-green/20 flex items-center justify-center">
                  <BookOpen size={20} className="text-green" />
                </div>
                <span className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded">
                  {article.category}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                {article.title}
              </h3>

              <p className="text-white/70 text-sm mb-4 line-clamp-3">
                {article.content}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {article.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-green/80 bg-green/10 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {article.tags.length > 2 && (
                    <span className="text-xs text-white/50">
                      +{article.tags.length - 2}
                    </span>
                  )}
                </div>

                <span className="text-xs text-white/50">
                  {new Date(article.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <BookOpen size={24} className="text-white/50" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            No articles found
          </h3>
          <p className="text-white/50">
            {searchTerm || categoryFilter !== "all"
              ? "Try adjusting your search or filters"
              : "No knowledge base articles available yet"}
          </p>
        </div>
      )}

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedArticle(null)}
          />
          <div className="relative bg-black border border-white/10 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {selectedArticle.title}
                  </h2>
                  <p className="text-white/70 text-sm mt-1">
                    By {selectedArticle.author.username} •{" "}
                    {new Date(selectedArticle.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedArticle(null)}
                  className="text-white/70 hover:text-white"
                >
                  ×
                </Button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <span className="text-sm text-white/50 bg-white/10 px-3 py-1 rounded-full">
                  {selectedArticle.category}
                </span>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
                  {selectedArticle.content}
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="text-sm font-medium text-white mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedArticle.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-green/80 bg-green/10 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
