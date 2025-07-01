import React, { useState } from "react";
import Button from "components/utils/button";
import {
  Search,
  BookOpen,
  MessageSquare,
  Settings,
  Users,
  HelpCircle,
  Mail,
  Phone,
  MessageCircle,
  ChevronRight,
  Star,
  CheckCircle,
} from "lucide-react";

interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  articles: HelpArticle[];
}

interface HelpArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  popular?: boolean;
}

const helpCategories: HelpCategory[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn the basics and set up your account",
    icon: <BookOpen size={24} />,
    color: "from-blue-500 to-blue-600",
    articles: [
      {
        id: "welcome-to-sautidesk",
        title: "Welcome to SautiDesk",
        description: "Your complete guide to getting started with SautiDesk",
        content:
          "Learn how to navigate the platform, understand key features, and set up your workspace for success.",
        tags: ["onboarding", "basics"],
        popular: true,
      },
      {
        id: "create-your-first-ticket",
        title: "Create Your First Ticket",
        description: "Step-by-step guide to creating and managing tickets",
        content:
          "Master the ticket creation process, from initial setup to resolution tracking.",
        tags: ["tickets", "workflow"],
        popular: true,
      },
      {
        id: "invite-team-members",
        title: "Invite Team Members",
        description: "Add team members and assign roles",
        content:
          "Learn how to invite colleagues, assign appropriate roles, and manage team permissions.",
        tags: ["team", "collaboration"],
      },
      {
        id: "customize-your-workspace",
        title: "Customize Your Workspace",
        description: "Personalize your SautiDesk experience",
        content:
          "Customize your workspace with branding, workflows, and preferences that match your needs.",
        tags: ["customization", "branding"],
      },
    ],
  },
  {
    id: "tickets",
    title: "Tickets & Support",
    description: "Manage tickets and customer support",
    icon: <MessageSquare size={24} />,
    color: "from-green-500 to-green-600",
    articles: [
      {
        id: "ticket-lifecycle",
        title: "Understanding Ticket Lifecycle",
        description: "Learn how tickets move through your system",
        content:
          "From creation to resolution, understand every stage of the ticket lifecycle.",
        tags: ["workflow", "process"],
        popular: true,
      },
      {
        id: "ticket-priorities",
        title: "Setting Ticket Priorities",
        description: "Prioritize tickets effectively",
        content:
          "Learn best practices for setting and managing ticket priorities to ensure timely resolution.",
        tags: ["priorities", "management"],
      },
      {
        id: "ticket-assignments",
        title: "Assigning Tickets to Agents",
        description: "Distribute work among your team",
        content:
          "Master the art of ticket assignment to optimize team productivity and response times.",
        tags: ["assignment", "team"],
      },
      {
        id: "ticket-templates",
        title: "Using Ticket Templates",
        description: "Create and use response templates",
        content:
          "Save time with pre-built templates for common ticket types and responses.",
        tags: ["templates", "efficiency"],
      },
    ],
  },
  {
    id: "team-management",
    title: "Team Management",
    description: "Manage your team and permissions",
    icon: <Users size={24} />,
    color: "from-purple-500 to-purple-600",
    articles: [
      {
        id: "agent-roles",
        title: "Understanding Agent Roles",
        description: "Different roles and their permissions",
        content:
          "Learn about the different agent roles and how to assign appropriate permissions.",
        tags: ["roles", "permissions"],
        popular: true,
      },
      {
        id: "team-performance",
        title: "Track Team Performance",
        description: "Monitor agent productivity and metrics",
        content:
          "Use analytics and reports to track team performance and identify improvement opportunities.",
        tags: ["analytics", "performance"],
      },
      {
        id: "workload-balancing",
        title: "Balancing Workload",
        description: "Distribute work evenly across your team",
        content:
          "Learn strategies for balancing workload and preventing agent burnout.",
        tags: ["workload", "balance"],
      },
    ],
  },
  {
    id: "integrations",
    title: "Integrations & API",
    description: "Connect with other tools and services",
    icon: <Settings size={24} />,
    color: "from-orange-500 to-orange-600",
    articles: [
      {
        id: "api-overview",
        title: "API Overview",
        description: "Introduction to SautiDesk API",
        content:
          "Learn how to use our REST API to integrate SautiDesk with your existing systems.",
        tags: ["api", "integration"],
        popular: true,
      },
      {
        id: "webhook-setup",
        title: "Setting Up Webhooks",
        description: "Configure webhooks for real-time updates",
        content:
          "Set up webhooks to receive real-time notifications about ticket updates and changes.",
        tags: ["webhooks", "notifications"],
      },
      {
        id: "third-party-integrations",
        title: "Third-Party Integrations",
        description: "Connect with popular tools",
        content:
          "Integrate SautiDesk with your favorite tools like Slack, Zapier, and more.",
        tags: ["integrations", "tools"],
      },
    ],
  },
];

const popularArticles = [
  "welcome-to-sautidesk",
  "create-your-first-ticket",
  "ticket-lifecycle",
  "agent-roles",
  "api-overview",
];

const contactMethods = [
  {
    title: "Email Support",
    description: "Get help via email within 24 hours",
    icon: <Mail size={24} />,
    action: "Send Email",
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Live Chat",
    description: "Chat with our support team in real-time",
    icon: <MessageCircle size={24} />,
    action: "Start Chat",
    color: "from-green-500 to-green-600",
  },
  {
    title: "Phone Support",
    description: "Call us for urgent issues",
    icon: <Phone size={24} />,
    action: "Call Now",
    color: "from-purple-500 to-purple-600",
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  // Filter articles based on search query
  const filteredArticles = helpCategories.flatMap((category) =>
    category.articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
    )
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(null);
    setSelectedArticle(null);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedArticle(null);
  };

  const handleArticleSelect = (articleId: string) => {
    setSelectedArticle(articleId);
  };

  const getSelectedArticle = () => {
    if (!selectedArticle) return null;
    return helpCategories
      .flatMap((category) => category.articles)
      .find((article) => article.id === selectedArticle);
  };

  const getSelectedCategory = () => {
    if (!selectedCategory) return null;
    return helpCategories.find((category) => category.id === selectedCategory);
  };

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Help Center
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Find answers to your questions, learn best practices, and get the
              most out of SautiDesk.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40"
                size={20}
              />
              <input
                type="text"
                placeholder="Search for help articles, features, or topics..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/5 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">500+</div>
              <div className="text-white/60">Help Articles</div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">24/7</div>
              <div className="text-white/60">Support Available</div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">98%</div>
              <div className="text-white/60">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Categories */}
              <div className="bg-white/5 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Categories</h3>
                <div className="space-y-3">
                  {helpCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? "bg-green-500/20 text-green-400"
                          : "hover:bg-white/10 text-white/80"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}
                        >
                          {category.icon}
                        </div>
                        <div>
                          <div className="font-medium">{category.title}</div>
                          <div className="text-xs text-white/60">
                            {category.articles.length} articles
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Articles */}
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Star size={16} />
                  Popular Articles
                </h3>
                <div className="space-y-3">
                  {popularArticles.map((articleId) => {
                    const article = helpCategories
                      .flatMap((category) => category.articles)
                      .find((article) => article.id === articleId);

                    if (!article) return null;

                    return (
                      <button
                        key={articleId}
                        onClick={() => handleArticleSelect(articleId)}
                        className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-colors text-white/80"
                      >
                        <div className="font-medium text-sm mb-1">
                          {article.title}
                        </div>
                        <div className="text-xs text-white/60">
                          {article.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {selectedArticle ? (
                /* Article Detail View */
                <div className="bg-white/5 rounded-xl p-8">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="text-white/60 hover:text-white mb-6 flex items-center gap-2 transition-colors"
                  >
                    <ChevronRight size={16} className="rotate-180" />
                    Back to articles
                  </button>

                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      {getSelectedArticle()?.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-2xl font-bold mb-4">
                      {getSelectedArticle()?.title}
                    </h2>
                    <p className="text-white/60 mb-6">
                      {getSelectedArticle()?.description}
                    </p>
                  </div>

                  <div className="prose prose-invert max-w-none">
                    <p className="text-white/80 leading-relaxed">
                      {getSelectedArticle()?.content}
                    </p>

                    {/* Placeholder for detailed content */}
                    <div className="mt-8 p-6 bg-white/5 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">
                        Step-by-Step Guide
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-green-400 font-semibold text-sm">
                              1
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">
                              Access the Dashboard
                            </h4>
                            <p className="text-white/60 text-sm">
                              Log into your SautiDesk account and navigate to
                              the main dashboard.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-green-400 font-semibold text-sm">
                              2
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">
                              Configure Settings
                            </h4>
                            <p className="text-white/60 text-sm">
                              Go to Settings and configure your preferences
                              according to your needs.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-green-400 font-semibold text-sm">
                              3
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">
                              Test the Feature
                            </h4>
                            <p className="text-white/60 text-sm">
                              Create a test ticket or perform the action to
                              ensure everything works correctly.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center gap-4">
                      <Button
                        buttonText="Was this helpful?"
                        variant="secondary"
                        onPress={() => console.log("Helpful feedback")}
                        className="bg-white/10 hover:bg-white/20"
                      />
                      <Button
                        buttonText="Contact Support"
                        onPress={() => console.log("Contact support")}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      />
                    </div>
                  </div>
                </div>
              ) : selectedCategory ? (
                /* Category Articles List */
                <div className="bg-white/5 rounded-xl p-8">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-white/60 hover:text-white mb-6 flex items-center gap-2 transition-colors"
                  >
                    <ChevronRight size={16} className="rotate-180" />
                    Back to categories
                  </button>

                  <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${
                          getSelectedCategory()?.color
                        } flex items-center justify-center`}
                      >
                        {getSelectedCategory()?.icon}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">
                          {getSelectedCategory()?.title}
                        </h2>
                        <p className="text-white/60">
                          {getSelectedCategory()?.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    {getSelectedCategory()?.articles.map((article) => (
                      <div
                        key={article.id}
                        className="p-6 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                        onClick={() => handleArticleSelect(article.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{article.title}</h3>
                              {article.popular && (
                                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-white/60 mb-3">
                              {article.description}
                            </p>
                            <div className="flex items-center gap-2">
                              {article.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-white/10 rounded text-xs text-white/60"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <ChevronRight size={20} className="text-white/40" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : searchQuery ? (
                /* Search Results */
                <div className="bg-white/5 rounded-xl p-8">
                  <h2 className="text-2xl font-bold mb-6">
                    Search Results for &quot;{searchQuery}&quot;
                  </h2>
                  <div className="grid gap-6">
                    {filteredArticles.map((article) => (
                      <div
                        key={article.id}
                        className="p-6 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                        onClick={() => handleArticleSelect(article.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{article.title}</h3>
                              {article.popular && (
                                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-white/60 mb-3">
                              {article.description}
                            </p>
                            <div className="flex items-center gap-2">
                              {article.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-white/10 rounded text-xs text-white/60"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <ChevronRight size={20} className="text-white/40" />
                        </div>
                      </div>
                    ))}
                    {filteredArticles.length === 0 && (
                      <div className="text-center py-12">
                        <HelpCircle
                          size={48}
                          className="text-white/40 mx-auto mb-4"
                        />
                        <h3 className="text-lg font-semibold mb-2">
                          No results found
                        </h3>
                        <p className="text-white/60 mb-6">
                          Try adjusting your search terms or browse our
                          categories below.
                        </p>
                        <Button
                          buttonText="Browse Categories"
                          onPress={() => setSearchQuery("")}
                          variant="secondary"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Default View - Categories Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {helpCategories.map((category) => (
                    <div
                      key={category.id}
                      className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                        >
                          {category.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">
                            {category.title}
                          </h3>
                          <p className="text-white/60 text-sm">
                            {category.articles.length} articles
                          </p>
                        </div>
                      </div>
                      <p className="text-white/60 mb-4">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {category.articles.slice(0, 3).map((article) => (
                            <span
                              key={article.id}
                              className="px-2 py-1 bg-white/10 rounded text-xs text-white/60"
                            >
                              {article.tags[0]}
                            </span>
                          ))}
                        </div>
                        <ChevronRight
                          size={20}
                          className="text-white/40 group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
              <p className="text-xl text-white/60">
                Our support team is here to help you succeed with SautiDesk.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactMethods.map((method, index) => (
                <div
                  key={index}
                  className="bg-white/5 rounded-xl p-6 text-center"
                >
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${method.color} mb-4`}
                  >
                    {method.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{method.title}</h3>
                  <p className="text-white/60 mb-4">{method.description}</p>
                  <Button
                    buttonText={method.action}
                    onPress={() => console.log(method.action)}
                    className="w-full bg-white/10 hover:bg-white/20"
                  />
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-white/60 mb-6">
                Average response time:{" "}
                <span className="text-green-400 font-semibold">2 hours</span>
              </p>
              <div className="flex items-center justify-center gap-8 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-400" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-400" />
                  <span>Expert Team</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-400" />
                  <span>Fast Resolution</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
