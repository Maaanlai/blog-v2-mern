import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import AnimationWrapper from "../components/common/AnimationWrapper.jsx";
import Loader from "../components/common/Loader.jsx";
import NodataMessage from "../components/common/NodataMessage.jsx";
import BlogCard from "../components/common/cards/BlogCard.jsx";
import { filterPaginationData } from "../functions/paginationData.js";
import { getFullDay } from "../utils/getDate.js";
import { BLOG_CATEGORIES } from "../utils/categories.js";

const BlogMain = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageState = searchParams.get("tag") || "home";
  const setPageState = (category) =>
    setSearchParams(category === "home" ? {} : { tag: category });

  const [blogs, setBlogs] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState(null);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef();

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
          setError("Failed to load articles. Please try again.");
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
            setError("Failed to load articles. Please try again.");
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
          message: "Successfully subscribed!",
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

  useEffect(() => {
    if (!blogs?.hasMore || isLoading) return;

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (pageState === "home") {
          fetchLatestBlogs({ page: blogs.page + 1 });
        } else {
          fetchBlogsByCategory({ page: blogs.page + 1 });
        }
      }
    });

    const loadMoreElement = document.getElementById("load-more");
    if (loadMoreElement) {
      observer.current.observe(loadMoreElement);
    }

    return () => observer.current?.disconnect();
  }, [blogs, pageState, fetchLatestBlogs, fetchBlogsByCategory]);
  const retry = () => {
    setError(null);
    setBlogs(null);
    if (pageState === "home") {
      fetchLatestBlogs({ page: 1 });
    } else {
      fetchBlogsByCategory({ page: 1 });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="container-wide pt-12 md:pt-20">
        <p className="kicker">Blog</p>
        <h1 className="mt-2 text-4xl md:text-5xl font-black uppercase tracking-wide leading-none">
          {pageState === "home" ? "Latest articles" : pageState}
        </h1>
        <p className="mt-4 text-xl text-muted max-w-xl">
          Discover insights on technology, business, and finance
        </p>

        <div className="mt-8 flex gap-3 overflow-x-auto pb-4 -mx-1 px-1 [scrollbar-width:none]">
          {["home", ...BLOG_CATEGORIES].map((category) => {
            const active = pageState === category;
            return (
              <button
                key={category}
                onClick={() => setPageState(category)}
                className={`chip capitalize transition-colors ${
                  active ? "!bg-accent !text-white" : "hover:text-accent"
                }`}
              >
                {category === "home" ? "All articles" : category}
              </button>
            );
          })}
        </div>
      </div>

      <div className="container-wide py-10">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {error ? (
              <div className="rounded-bubble bg-white shadow-soft p-8 text-center">
                <p className="text-red font-medium mb-3">{error}</p>
                <button onClick={retry} className="chip hover:text-accent">
                  Try again
                </button>
              </div>
            ) : blogs === null ? (
              <Loader />
            ) : blogs.results.length ? (
              <div className="grid xl:grid-cols-2 gap-x-8 gap-y-10">
                {blogs.results.map((blog, index) => (
                  <AnimationWrapper
                    key={blog.blog_id}
                    transition={{ duration: 0.4, delay: (index % 5) * 0.06 }}
                  >
                    <BlogCard blog={blog} showDescription />
                  </AnimationWrapper>
                ))}
                {isLoading && <Loader />}
              </div>
            ) : (
              <NodataMessage message="No articles published yet" />
            )}

            <div id="load-more" className="h-10" />
          </main>

          {/* Sidebar */}
          <aside className="lg:w-80 shrink-0">
            <div className="sticky top-24 space-y-10">
              {/* Trending */}
              <div>
                <p className="text-2xl md:text-[19px] font-bold mb-5">Trending now</p>

                {trendingBlogs === null ? (
                  <Loader />
                ) : trendingBlogs?.length ? (
                  <div className="space-y-5">
                    {trendingBlogs.map((blog, index) => (
                      <Link
                        to={`/blog/${blog.blog_id}`}
                        key={blog.blog_id}
                        className="group flex gap-4 items-start"
                      >
                        <span className="text-3xl font-black leading-none text-line w-12 shrink-0">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xl font-bold leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                            {blog.title}
                          </p>
                          <p className="mt-1 text-base text-muted">
                            {blog.author?.personal_info?.fullName}
                            <span className="pre-dot">{getFullDay(blog.publishedAt)}</span>
                          </p>
                        </div>
                        {blog.banner && (
                          <img
                            src={blog.banner}
                            alt={blog.title}
                            className="!w-14 !h-14 rounded-full shrink-0"
                          />
                        )}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-base text-muted">No trending articles</p>
                )}
              </div>

              {/* Newsletter Signup */}
              <div className="rounded-bubble bg-ink text-white p-7">
                <p className="kicker">Newsletter</p>
                <p className="mt-2 text-2xl font-black uppercase tracking-wide">
                  Stay updated
                </p>
                <p className="mt-2 text-base text-white/60 mb-5">
                  Get the latest articles delivered to your inbox
                </p>
                <form
                  onSubmit={handleNewsletterSubscription}
                  className="flex flex-col gap-3"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="rounded-full bg-white/10 border border-white/20 px-5 py-3 text-white placeholder:text-white/40 outline-none focus:border-accent"
                    disabled={subscriptionStatus?.type === "loading"}
                  />
                  <button
                    type="submit"
                    disabled={subscriptionStatus?.type === "loading"}
                    className="btn-accent"
                  >
                    {subscriptionStatus?.type === "loading"
                      ? "Subscribing..."
                      : "Subscribe"}
                  </button>
                </form>

                {subscriptionStatus && subscriptionStatus.type !== "loading" && (
                  <p
                    className={`mt-3 text-base ${
                      subscriptionStatus.type === "success"
                        ? "text-accent"
                        : "text-red"
                    }`}
                  >
                    {subscriptionStatus.message}
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogMain;
