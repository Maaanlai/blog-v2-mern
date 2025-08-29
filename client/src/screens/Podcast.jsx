import { useEffect, useState, useRef, useCallback } from "react";
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

const Podcast = () => {
  const [blogs, setBlogs] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState(null);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const observer = useRef();

  const fetchPodcastBlogs = useCallback(({ page = 1 }) => {
    setBlogs((currentBlogs) => {
      axios
        .post(`/api/v1/blogs/podcast`, { page })
        .then(async ({ data }) => {
          const formattedData = await filterPaginationData({
            state: currentBlogs,
            data: data?.blogs,
            page,
            countRoute: "blogs/podcast",
          });

          // Calculate if there are more pages
          const hasMore =
            formattedData.results.length < formattedData.totalDocs;
          setBlogs({ ...formattedData, hasMore });
        })
        .catch((error) => {
          console.log("Error fetching podcast blogs:", error);
          setError("Failed to load podcast episodes. Please try again.");
        });
      return currentBlogs;
    });
  }, []);

  const fetchTrendingBlogs = useCallback(() => {
    axios
      .get(`/api/v1/blogs/trending`)
      .then(({ data }) => {
        // Filter trending blogs to only show podcast-related content
        const podcastTrending = data?.blogs?.filter(
          (blog) =>
            blog.tags?.includes("podcast") || blog.category === "podcast"
        );
        setTrendingBlogs(podcastTrending || []);
      })
      .catch((error) => {
        console.log("Error fetching trending blogs:", error);
      });
  }, []);

  const handleNewsletterSubscription = async (e) => {
    e.preventDefault();
    if (!email) {
      setSubscriptionStatus({
        type: "error",
        message: "Please enter your email address",
      });
      return;
    }

    try {
      setSubscriptionStatus({ type: "loading", message: "Subscribing..." });

      const response = await axios.post(`/api/v1/newsletter/subscribe`, {
        email,
      });

      if (response.data.status === 6000) {
        setSubscriptionStatus({
          type: "success",
          message: "Successfully subscribed to podcast updates!",
        });
        setEmail(""); // Clear the email input
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to subscribe. Please try again.";
      setSubscriptionStatus({ type: "error", message: errorMessage });
    }

    // Clear status after 3 seconds
    setTimeout(() => {
      setSubscriptionStatus(null);
    }, 3000);
  };

  useEffect(() => {
    setBlogs(null);
    setError(null);
    fetchPodcastBlogs({ page: 1 });
  }, [fetchPodcastBlogs]);

  useEffect(() => {
    if (!trendingBlogs) {
      fetchTrendingBlogs();
    }
  }, [fetchTrendingBlogs, trendingBlogs]);

  useEffect(() => {
    if (!blogs?.hasMore) return;
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchPodcastBlogs({ page: blogs.page + 1 });
      }
    });
    const loadMoreElement = document.getElementById("load-more");
    if (loadMoreElement) {
      observer.current.observe(loadMoreElement);
    }
    return () => observer.current?.disconnect();
  }, [blogs, fetchPodcastBlogs]);

  const renderPodcastCards = () => {
    return blogs.results.map((blog) => (
      <AnimationWrapper key={blog.blog_id} transition={{ delay: 0.1 }}>
        <Link to={`/blog/${blog.blog_id}`}>
          <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group cursor-pointer">
            <div className="relative overflow-hidden">
              <img
                src={
                  blog.banner ||
                  `https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=400&fit=crop`
                }
                alt={blog.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-red-500/90 text-white text-xs font-medium rounded-full flex items-center gap-1">
                  🎙️ Podcast
                </span>
              </div>
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-800 ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-align-right">
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
                    {blog.activity?.total_likes || 0}
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
                    {blog.activity?.total_comments || 0}
                  </span>
                </div>

                <span className="text-sm text-gray-400 group-hover:text-gray-600 transition-colors duration-200">
                  Listen now →
                </span>
              </div>
            </div>
          </article>
        </Link>
      </AnimationWrapper>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#9b30ff] via-[#8a2be2] to-[#4b0082] text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
            </svg>
            <h1 className="text-4xl md:text-5xl font-light tracking-wide">
              Podcast Episodes
            </h1>
          </div>
          <p className="text-lg md:text-xl font-light opacity-90">
            Listen to our latest discussions on finance, business, and
            innovation
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="lg:w-80 shrink-0 order-2 lg:order-1">
            <div className="sticky top-8 space-y-8">
              {/* Podcast Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-light text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  About Our Podcast
                </h2>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">All Episodes</h3>
                    <p className="text-sm text-gray-500">
                      Latest podcast content
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Dive deep into conversations about finance, business strategy,
                  and market insights with industry experts.
                </p>
              </div>

              {/* Trending Podcasts */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-light text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  Popular Episodes
                </h2>

                {trendingBlogs === null ? (
                  <div className="flex justify-center py-4">
                    <Loader />
                  </div>
                ) : trendingBlogs?.length ? (
                  <div className="space-y-4">
                    {trendingBlogs.slice(0, 5).map((blog) => (
                      <Link
                        to={`/blog/${blog.blog_id}`}
                        key={blog.blog_id}
                        className="group cursor-pointer"
                      >
                        <div className="flex gap-3">
                          <div className="relative">
                            <img
                              src={blog.banner}
                              alt={blog.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-3 h-3 text-gray-800 ml-0.5"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </div>
                          </div>
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
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No trending episodes
                  </p>
                )}
              </div>

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-red-900 to-red-800 rounded-lg p-6 text-white">
                <h3 className="text-lg font-light mb-2">
                  Never Miss an Episode
                </h3>
                <p className="text-sm text-red-100 mb-4">
                  Get notified when new podcast episodes are released
                </p>
                <form
                  onSubmit={handleNewsletterSubscription}
                  className="flex flex-col gap-2"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-red-200 focus:outline-none focus:ring-2 focus:ring-white/30"
                    disabled={subscriptionStatus?.type === "loading"}
                  />
                  <button
                    type="submit"
                    disabled={subscriptionStatus?.type === "loading"}
                    className="px-4 py-2 bg-white text-red-900 rounded-lg hover:bg-red-50 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {subscriptionStatus?.type === "loading"
                      ? "Subscribing..."
                      : "Subscribe"}
                  </button>
                </form>

                {/* Status Message */}
                {subscriptionStatus && (
                  <div
                    className={`mt-3 text-sm ${
                      subscriptionStatus.type === "success"
                        ? "text-green-300"
                        : subscriptionStatus.type === "error"
                        ? "text-red-300"
                        : "text-red-200"
                    }`}
                  >
                    {subscriptionStatus.message}
                  </div>
                )}
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
                    fetchPodcastBlogs({ page: 1 });
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
              <div className="grid gap-8">{renderPodcastCards()}</div>
            ) : (
              <div className="text-center py-12">
                <NodataMessage message="No podcast episodes published yet" />
              </div>
            )}

            <div id="load-more" className="h-10" />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Podcast;
