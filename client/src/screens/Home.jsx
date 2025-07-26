import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AnimationWrapper from "../components/common/AnimationWrapper.jsx";
import Loader from "../components/common/Loader.jsx";
import { filterPaginationData } from "../functions/paginationData.js";

const NodataMessage = ({ message }) => (
  <div className="text-center py-12">
    <div className="text-gray-400 text-lg">{message}</div>
  </div>
);

const LoadMoreBtn = ({ state, fetchDataFunc }) => (
  <button
    onClick={() => fetchDataFunc({ page: state.page + 1 })}
    className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
  >
    Load More Posts
  </button>
);

const Home = () => {
  const [blogs, setBlogs] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState(null);
  const [pageState, setPageState] = useState("home");

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

  const fetchLatestBlogs = useCallback(({ page = 1 }) => {
    setBlogs((currentBlogs) => {
      axios
        .post(`/api/v1/blogs/latest`, { page })
        .then(async ({ data }) => {
          const formattedData = await filterPaginationData({
            state: currentBlogs,
            data: data?.blogs,
            page,
            countRoute: "blogs/latest/total-posts",
          });

          // Calculate if there are more pages
          const hasMore =
            formattedData.results.length < formattedData.totalDocs;
          setBlogs({ ...formattedData, hasMore });
        })
        .catch((error) => {
          console.log("Error fetching latest blogs:", error);
        });
      return currentBlogs;
    });
  }, []);

  const fetchBlogsByCategory = useCallback(
    ({ page = 1 }) => {
      setBlogs((currentBlogs) => {
        axios
          .post(`/api/v1/blogs/search`, {
            tag: pageState,
            page,
          })
          .then(async ({ data }) => {
            const formattedData = await filterPaginationData({
              state: currentBlogs,
              data: data?.blogs,
              page,
              countRoute: "blogs/search/total-posts",
              dataToSend: { tag: pageState },
            });

            // Calculate if there are more pages
            const hasMore =
              formattedData.results.length < formattedData.totalDocs;
            setBlogs({ ...formattedData, hasMore });
          })
          .catch((error) => {
            console.log("Error fetching blogs by category:", error);
          });
        return currentBlogs;
      });
    },
    [pageState]
  );

  const fetchTrendingBlogs = useCallback(() => {
    axios
      .get(`/api/v1/blogs/trending`)
      .then(({ data }) => {
        setTrendingBlogs(data?.blogs);
      })
      .catch((error) => {
        console.log("Error fetching trending blogs:", error);
      });
  }, []);

  const handleLoadCategory = (event) => {
    const category = event.target.innerText.toLowerCase();
    setBlogs(null);

    if (pageState === category) {
      setPageState("home");
      return;
    }

    setPageState(category);
  };

  useEffect(() => {
    setBlogs(null);

    if (pageState === "home") {
      fetchLatestBlogs({ page: 1 });
    } else {
      fetchBlogsByCategory({ page: 1 });
    }
  }, [pageState, fetchLatestBlogs, fetchBlogsByCategory]);

  useEffect(() => {
    if (!trendingBlogs) {
      fetchTrendingBlogs();
    }
  }, [fetchTrendingBlogs, trendingBlogs]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-light tracking-wide mb-6">
            Your Blog
          </h1>
          <p className="text-xl md:text-2xl font-light opacity-90 mb-8">
            Thoughts, stories and ideas
          </p>
          <div className="w-24 h-0.5 bg-white/60 mx-auto"></div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-4 scrollbar-hide">
            <button
              className={`px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                pageState === "home"
                  ? "text-gray-900 border-b-2 border-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setPageState("home")}
            >
              All Posts
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap capitalize ${
                  pageState === category
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={handleLoadCategory}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Blog Posts */}
          <main className="flex-1">
            {blogs === null ? (
              <div className="flex justify-center py-12">
                <Loader />
              </div>
            ) : blogs.results.length ? (
              <div className="space-y-12">
                {blogs.results.map((blog, index) => (
                  <AnimationWrapper
                    key={blog?.blog_id}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.1,
                    }}
                  >
                    <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                      <div className="p-8">
                        <div className="flex items-center gap-3 mb-4">
                          <img
                            src={
                              blog?.author?.personal_info?.profile_img ||
                              "/default-avatar.png"
                            }
                            alt={blog?.author?.personal_info?.fullname}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {blog?.author?.personal_info?.fullname}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(blog?.publishedAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>

                        <Link to={`/blog/${blog?.blog_id}`}>
                          <h2 className="text-2xl font-light text-gray-900 mb-4 leading-tight hover:text-gray-700 cursor-pointer">
                            {blog?.title}
                          </h2>
                        </Link>

                        <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                          {blog?.des}
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
                              {blog?.activity?.total_likes || 0}
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
                              {blog?.activity?.total_comments || 0}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {blog?.tags?.slice(0, 2).map((tag, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </article>
                  </AnimationWrapper>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <NodataMessage message="No blog published" />
              </div>
            )}

            {/* Load More Button */}
            {blogs?.hasMore && (
              <div className="mt-12 text-center">
                <LoadMoreBtn
                  state={blogs}
                  fetchDataFunc={
                    pageState === "home"
                      ? fetchLatestBlogs
                      : fetchBlogsByCategory
                  }
                />
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:w-80 shrink-0">
            <div className="sticky top-24 space-y-8">
              {/* About Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-light text-gray-900 mb-4">About</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Welcome to our blog where we share insights about finance,
                  programming, business, and technology. Stay tuned for the
                  latest updates and trends.
                </p>
              </div>

              {/* Trending Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-light text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  Trending Posts
                </h3>

                {trendingBlogs === null ? (
                  <div className="flex justify-center py-4">
                    <Loader />
                  </div>
                ) : trendingBlogs.length ? (
                  <div className="space-y-4">
                    {trendingBlogs.slice(0, 5).map((blog, index) => (
                      <AnimationWrapper
                        key={blog?.blog_id}
                        transition={{
                          duration: 0.6,
                          delay: index * 0.1,
                        }}
                      >
                        <Link
                          to={`/blog/${blog?.blog_id}`}
                          className="group cursor-pointer"
                        >
                          <h4 className="text-sm font-medium text-gray-900 group-hover:text-gray-600 transition-colors duration-200 line-clamp-2 mb-2">
                            {blog?.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{blog?.author?.personal_info?.fullname}</span>
                            <span>•</span>
                            <span>
                              {new Date(blog?.publishedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </Link>
                      </AnimationWrapper>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No trending blogs
                  </p>
                )}
              </div>

              {/* Tags Cloud */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-light text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((tag) => (
                    <button
                      key={tag}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors duration-200 capitalize"
                      onClick={() => setPageState(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Home;
