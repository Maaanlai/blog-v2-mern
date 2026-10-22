import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AnimationWrapper from "../components/common/AnimationWrapper.jsx";
import Loader from "../components/common/Loader.jsx";
import NodataMessage from "../components/common/NodataMessage.jsx";
import LoadMoreBtn from "../components/common/buttons/LoadMoreBtn.jsx";
import BlogCard from "../components/common/cards/BlogCard.jsx";
import EditorsCard from "../components/common/cards/EditorsCard.jsx";
import PrevWeeks from "../components/home/PrevWeeks.jsx";
import { filterPaginationData } from "../functions/paginationData.js";
import { getFullDay } from "../utils/getDate.js";
import { user as defaultAvatar } from "../assets";
import { BRAND } from "../utils/brand.js";

const FeaturedHero = ({ blog }) => {
  const {
    title,
    banner,
    tags = [],
    publishedAt,
    blog_id: id,
    activity,
    author,
  } = blog;
  const { fullName, username, profile_img } = author?.personal_info || {};

  return (
    <div className="relative overflow-hidden">
      {banner && (
        <img src={banner} alt="" aria-hidden className="absolute inset-0 opacity-40" />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_40%,rgba(0,0,0,1)_100%)]" />

      <div className="relative max-w-[1120px] mx-auto px-[5vw] lg:px-0 pt-[120px] md:pt-[150px] pb-6 grid md:grid-cols-[2fr_3fr] gap-8 md:gap-14 items-center">
        <Link
          to={`/blog/${id}`}
          className="hidden md:block aspect-square overflow-hidden rounded-[0.9rem] bg-white/10"
        >
          {banner && <img src={banner} alt={title} className="hover-lift" />}
        </Link>

        <div>
          <div className="flex items-center gap-4 text-base font-semibold">
            <span className="kicker !text-accent-soft">New</span>
            <span className="flex items-center gap-1.5 text-white">
              <i className="fi fi-sr-comment" />
              {activity?.total_comments ?? 0}
            </span>
          </div>

          {tags[0] && (
            <p className="text-outline mt-4 text-[26px] md:text-[32px] font-black uppercase tracking-[0.05em] leading-tight">
              {tags[0]}
            </p>
          )}

          <Link to={`/blog/${id}`} className="block hover:opacity-70 transition-opacity">
            <h1 className="mt-1 text-[28px] md:text-[38px] font-black uppercase tracking-[0.04em] leading-[1.15] text-white line-clamp-5">
              {title}
            </h1>
          </Link>

          <div className="mt-10 flex items-center gap-3">
            <img
              src={profile_img || defaultAvatar}
              alt={fullName || username || "author"}
              className="!w-11 !h-11 rounded-full ring-1 ring-white/40 ring-offset-2 ring-offset-black"
            />
            <div className="text-base leading-snug">
              <p className="font-bold text-white/60">
                {fullName || username || "Anonymous"}
              </p>
              <p className="text-white">{getFullDay(publishedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// shown in the dark top area when there is no post to feature yet
const BrandIntro = ({ loading }) => (
  <div className="max-w-[1120px] mx-auto px-[5vw] lg:px-0 pt-[140px] md:pt-[170px] pb-10 min-h-[420px]">
    {!loading && (
      <>
        <p className="kicker !text-accent-soft">{BRAND.name}</p>
        <h1 className="mt-4 text-[28px] md:text-[44px] font-black uppercase tracking-[0.04em] leading-[1.15] text-white max-w-3xl">
          Комплаенсийн мэдлэг, мэдээлэл
        </h1>
        <p className="mt-5 max-w-2xl text-xl text-white/60">
          Мөнгө угаах болон терроризмыг санхүүжүүлэхтэй тэмцэх (МУТС) сургалт,
          эрсдэлийн үнэлгээ, бодлого журмын тухай нийтлэлүүд.
        </p>
      </>
    )}
  </div>
);

// black band height that the tall tiles hang down from (unread uses ~240px)
const BAND = "pb-[170px] md:pb-[240px]";
const BAND_PULL = "-mt-[170px] md:-mt-[240px]";

const TrendingRow = ({ blogs }) => {
  const scroller = useRef(null);

  const scrollBy = (direction) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <>
      <div className={`bg-ink text-white pt-8 ${BAND}`}>
        <div className="max-w-[1120px] mx-auto px-[5vw] lg:px-0">
          <div className="section-title !text-white !my-0">
            <span>Trending</span>
            <div className="hidden md:flex items-center rounded-full bg-white/50 text-white text-2xl leading-none">
              <button
                aria-label="Previous"
                onClick={() => scrollBy(-1)}
                className="pl-4 pr-2 py-1.5 opacity-70 hover:opacity-100"
              >
                <i className="fi fi-rr-angle-small-left" />
              </button>
              <button
                aria-label="Next"
                onClick={() => scrollBy(1)}
                className="pl-2 pr-4 py-1.5 opacity-70 hover:opacity-100"
              >
                <i className="fi fi-rr-angle-small-right" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={scroller}
        className={`relative ${BAND_PULL} flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-px-[5vw] lg:scroll-px-[45px] px-[5vw] lg:px-[45px] pt-8 pb-14 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
      >
        {blogs.map((blog) => (
          <div
            key={blog.blog_id}
            className="snap-start shrink-0 w-[60%] sm:w-[33%] lg:w-[calc((100%-6rem)/5)]"
          >
            <EditorsCard blog={blog} />
          </div>
        ))}
      </div>
    </>
  );
};

const Home = () => {
  const [blogs, setBlogs] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState(null);
  const [email, setEmail] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

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

          setBlogs(formattedData);
        })
        .catch((error) => {
          console.log("Error fetching latest blogs:", error);
        });
      return currentBlogs;
    });
  }, []);

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
    fetchLatestBlogs({ page: 1 });
  }, [fetchLatestBlogs]);

  useEffect(() => {
    if (!trendingBlogs) {
      fetchTrendingBlogs();
    }
  }, [fetchTrendingBlogs, trendingBlogs]);

  // the newest post gets the hero, the rest go in the zig-zag list
  const featured = blogs?.results?.[0];
  const feed = blogs ? blogs.results.slice(1) : [];

  return (
    <div className="min-h-screen">
      {/* dark top area: the header floats over it (see Navbar) */}
      <div className="bg-ink text-white">
        {featured ? (
          <AnimationWrapper keyValue={featured.blog_id}>
            <FeaturedHero blog={featured} />
          </AnimationWrapper>
        ) : (
          <BrandIntro loading={blogs === null} />
        )}
      </div>

      {trendingBlogs?.length ? <TrendingRow blogs={trendingBlogs} /> : null}

      {/* Latest stories: one column, cards alternating left and right */}
      <div className="max-w-[1120px] mx-auto px-[5vw] lg:px-0 mt-10">
        {blogs === null ? (
          <Loader />
        ) : feed.length ? (
          <>
            <div className="flex flex-col gap-12 md:gap-14">
              {feed.map((blog, index) => {
                const right = index % 2 === 1;
                return (
                  <AnimationWrapper
                    key={blog?.blog_id}
                    transition={{ duration: 0.4, delay: (index % 5) * 0.06 }}
                    className={`md:w-[66%] ${right ? "md:ml-auto" : ""}`}
                  >
                    <BlogCard
                      blog={blog}
                      align={right ? "right" : "left"}
                      showStats={false}
                    />
                  </AnimationWrapper>
                );
              })}
            </div>

            <div className="flex">
              <LoadMoreBtn state={blogs} fetchDataFunc={fetchLatestBlogs} />
            </div>
          </>
        ) : blogs.results.length ? null : (
          <NodataMessage message="No blog published" />
        )}
      </div>

      <PrevWeeks />

      <div className="max-w-[1120px] mx-auto px-[5vw] lg:px-0">
        {/* Newsletter */}
        <div className="mt-24 rounded-bubble bg-white shadow-soft px-6 py-10 md:px-14 md:py-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="kicker">Newsletter</p>
            <p className="mt-2 text-3xl md:text-4xl font-black uppercase tracking-wide leading-tight">
              Stay updated
            </p>
            <p className="mt-3 text-xl text-muted">
              Get the latest articles delivered straight to your inbox.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubscription}>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                disabled={subscriptionStatus?.type === "loading"}
                className="flex-1 rounded-full border border-line bg-paper px-6 py-3 text-xl outline-none focus:border-accent"
              />
              <button
                type="submit"
                disabled={subscriptionStatus?.type === "loading"}
                className="btn-accent"
              >
                {subscriptionStatus?.type === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
            </div>

            {subscriptionStatus && subscriptionStatus.type !== "loading" && (
              <p
                className={`mt-3 pl-4 text-base font-medium ${
                  subscriptionStatus.type === "success" ? "text-accent" : "text-red"
                }`}
              >
                {subscriptionStatus.message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
