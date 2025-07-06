import { useEffect, useState, useRef } from "react";
import AnimationWrapper from "../components/common/AnimationWrapper.jsx";
import Loader from "../components/common/Loader.jsx";

const NodataMessage = ({ message }) => (
  <div className="text-center py-12">
    <div className="text-gray-400 text-lg">{message}</div>
  </div>
);

const BlogMain = () => {
  const [blogs, setBlogs] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState(null);
  const [pageState, setPageState] = useState("home");
  const [error, setError] = useState(null);
  const observer = useRef();

  const categories = [
    "finance",
    "programming",
    "fraud",
    "new",
    "trading",
    "business",
    "investing",
    "wealth",
    "economy",
  ];

  // Mock data for demonstration
  const mockBlogs = [
    {
      blog_id: 1,
      title: "Advanced JavaScript Patterns for Modern Development",
      des: "Dive deep into advanced JavaScript patterns and techniques that every modern developer should know. From closures to async patterns, we cover it all.",
      author: {
        personal_info: {
          fullname: "Sarah Wilson",
          profile_img:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        },
      },
      publishedAt: "2024-01-18T08:30:00Z",
      activity: { total_likes: 67, total_comments: 15 },
      tags: ["programming", "javascript", "development"],
      banner:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
    },
    {
      blog_id: 2,
      title: "Cryptocurrency Investment Strategies for 2024",
      des: "Explore the latest cryptocurrency investment strategies and market analysis for the upcoming year. Learn how to navigate the volatile crypto market.",
      author: {
        personal_info: {
          fullname: "David Chen",
          profile_img:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        },
      },
      publishedAt: "2024-01-16T14:45:00Z",
      activity: { total_likes: 89, total_comments: 23 },
      tags: ["finance", "cryptocurrency", "investing"],
      banner:
        "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&h=400&fit=crop",
    },
    {
      blog_id: 3,
      title: "Building Scalable Business Models in the Digital Age",
      des: "Learn how to create and scale successful business models that thrive in today's digital economy. From startups to enterprises.",
      author: {
        personal_info: {
          fullname: "Emma Rodriguez",
          profile_img:
            "https://images.unsplash.com/photo-1494790108755-2616b2e6b8c7?w=150&h=150&fit=crop&crop=face",
        },
      },
      publishedAt: "2024-01-14T11:20:00Z",
      activity: { total_likes: 45, total_comments: 8 },
      tags: ["business", "entrepreneurship", "digital"],
      banner:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    },
    {
      blog_id: 4,
      title: "The Future of Web Development: Trends to Watch",
      des: "Stay ahead of the curve with the latest web development trends and technologies shaping the future of the internet.",
      author: {
        personal_info: {
          fullname: "Michael Thompson",
          profile_img:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        },
      },
      publishedAt: "2024-01-12T16:10:00Z",
      activity: { total_likes: 52, total_comments: 11 },
      tags: ["programming", "web development", "technology"],
      banner:
        "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=400&fit=crop",
    },
    {
      blog_id: 5,
      title: "Risk Management in Modern Investment Portfolios",
      des: "Master the art of risk management in investment portfolios. Learn proven strategies to protect and grow your wealth.",
      author: {
        personal_info: {
          fullname: "Lisa Park",
          profile_img:
            "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
        },
      },
      publishedAt: "2024-01-10T09:30:00Z",
      activity: { total_likes: 38, total_comments: 6 },
      tags: ["finance", "investing", "risk management"],
      banner:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
    },
  ];

  const fetchLatestBlogs = ({ page = 1 }) => {
    setTimeout(() => {
      setBlogs({
        results: mockBlogs,
        page: page,
        hasMore: page < 2,
      });
    }, 500);
  };

  const fetchTrendingBlogs = () => {
    setTimeout(() => {
      setTrendingBlogs(mockBlogs.slice(0, 3));
    }, 300);
  };

  useEffect(() => {
    setBlogs(null);
    setError(null);
    fetchLatestBlogs({ page: 1 });
    if (!trendingBlogs) fetchTrendingBlogs();
  }, [pageState]);

  useEffect(() => {
    if (!blogs?.hasMore) return;
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchLatestBlogs({ page: blogs.page + 1 });
      }
    });
    const loadMoreElement = document.getElementById("load-more");
    if (loadMoreElement) {
      observer.current.observe(loadMoreElement);
    }
    return () => observer.current?.disconnect();
  }, [blogs]);

  const renderBlogCards = () => {
    return blogs.results.map((blog, index) => (
      <AnimationWrapper key={blog.blog_id} transition={{ delay: index * 0.1 }}>
        <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group cursor-pointer">
          <div className="relative overflow-hidden">
            <img
              src={
                blog.banner ||
                `https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop`
              }
              alt={blog.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-white/90 text-gray-800 text-xs font-medium rounded-full">
                {blog.tags?.[0] || "Article"}
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={blog.author.personal_info.profile_img}
                alt={blog.author.personal_info.fullname}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {blog.author.personal_info.fullname}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <h2 className="text-xl font-light text-gray-900 mb-3 leading-tight group-hover:text-gray-700 transition-colors duration-200">
              {blog.title}
            </h2>

            <p className="text-gray-600 leading-relaxed mb-4 line-clamp-2">
              {blog.des}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  {blog.activity.total_likes}
                </span>
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  {blog.activity.total_comments}
                </span>
              </div>

              <span className="text-sm text-gray-400 group-hover:text-gray-600 transition-colors duration-200">
                Read more →
              </span>
            </div>
          </div>
        </article>
      </AnimationWrapper>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4">
            Latest Articles
          </h1>
          <p className="text-lg md:text-xl font-light opacity-90">
            Discover insights on technology, business, and finance
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="lg:w-80 shrink-0 order-2 lg:order-1">
            <div className="sticky top-8 space-y-8">
              {/* Categories */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-light text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  Categories
                </h2>
                <ul className="space-y-2">
                  <li>
                    <button
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                        pageState === "home"
                          ? "bg-gray-900 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setPageState("home")}
                    >
                      All Articles
                    </button>
                  </li>
                  {categories.map((category) => (
                    <li key={category}>
                      <button
                        className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 text-sm capitalize ${
                          pageState === category
                            ? "bg-gray-900 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setPageState(category)}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trending Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-light text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  Trending Now
                </h2>

                {trendingBlogs === null ? (
                  <div className="flex justify-center py-4">
                    <Loader />
                  </div>
                ) : trendingBlogs?.length ? (
                  <div className="space-y-4">
                    {trendingBlogs.map((blog, index) => (
                      <div key={blog.blog_id} className="group cursor-pointer">
                        <div className="flex gap-3">
                          <img
                            src={
                              blog.banner ||
                              `https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=100&h=100&fit=crop`
                            }
                            alt={blog.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900 group-hover:text-gray-600 transition-colors duration-200 line-clamp-2 mb-1">
                              {blog.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{blog.author.personal_info.fullname}</span>
                              <span>•</span>
                              <span>
                                {new Date(
                                  blog.publishedAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No trending articles
                  </p>
                )}
              </div>

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 text-white">
                <h3 className="text-lg font-light mb-2">Stay Updated</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Get the latest articles delivered to your inbox
                </p>
                <div className="flex flex-col gap-2">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                  <button className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-sm font-medium">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 order-1 lg:order-2">
            {error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="text-red-600 mb-2">
                  <svg
                    className="w-8 h-8 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {error}
                </div>
                <button
                  onClick={() => {
                    setError(null);
                    fetchLatestBlogs({ page: 1 });
                  }}
                  className="text-sm text-red-600 hover:text-red-800 underline"
                >
                  Try again
                </button>
              </div>
            ) : blogs === null ? (
              <div className="flex justify-center py-12">
                <Loader />
              </div>
            ) : blogs.results.length ? (
              <div className="grid gap-8">{renderBlogCards()}</div>
            ) : (
              <div className="text-center py-12">
                <NodataMessage message="No articles published yet" />
              </div>
            )}

            <div id="load-more" className="h-10" />
          </main>
        </div>
      </div>
    </div>
  );
};

export default BlogMain;
