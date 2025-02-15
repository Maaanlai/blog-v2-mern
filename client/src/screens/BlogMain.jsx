import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { filterPaginationData } from "../functions";
import AnimationWrapper from "../components/common/AnimationWrapper";
import Loader from "../components/common/Loader";
import BlogCard from "../components/common/cards/BlogCard";
import MinimalBlogPostCard from "../components/common/cards/MinimalBlogPostCard";
import NodataMessage from "../components/common/NodataMessage";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const BlogMain = () => {
    const [blogs, setBlogs] = useState(null);
    const [trendingBlogs, setTrendingBlogs] = useState(null);
    const [pageState, setPageState] = useState("home");
    const [error, setError] = useState(null); // Error state to track errors
    const observer = useRef();

    const categories = [
        "finance", "programming", "fraud", "new", "trading",
        "business", "investing", "wealth", "economy",
    ];

    const fetchLatestBlogs = ({ page = 1 }) => {
        axios.post(`/api/v1/blogs/latest`, { page })
            .then(async ({ data }) => {
                const formattedData = await filterPaginationData({
                    state: blogs,
                    data: data?.blogs,
                    page,
                    countRoute: "blogs/latest/total-posts",
                });
                setBlogs(formattedData);
            })
            .catch((error) => {
                console.log(error);
                setError("Failed to load blogs. Please try again later.");
            });
    };

    const fetchTrendingBlogs = () => {
        axios.get(`/api/v1/blogs/trending`)
            .then(({ data }) => setTrendingBlogs(data?.blogs))
            .catch((error) => {
                console.log(error);
                setError("Failed to load trending blogs. Please try again later.");
            });
    };

    useEffect(() => {
        setBlogs(null);
        setError(null); // Reset error state when fetching blogs
        fetchLatestBlogs({ page: 1 });
        if (!trendingBlogs) fetchTrendingBlogs();
    }, [pageState]);

    useEffect(() => {
        if (!blogs?.hasMore) return;
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                fetchLatestBlogs({ page: blogs.page + 1 });
            }
        });
        observer.current.observe(document.getElementById("load-more"));
        return () => observer.current.disconnect();
    }, [blogs]);

    const renderBlogCards = () => {
        return blogs.results.map(blog => (
            <AnimationWrapper key={blog.blog_id}>
                <BlogCard blog={blog} overlay />
            </AnimationWrapper>
        ));
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex gap-8">
            {/* Sidebar */}
            <aside className="w-1/4 hidden lg:block">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-bold mb-4">Categories</h2>
                    <ul className="space-y-2">
                        {categories.map(category => (
                            <li key={category}>
                                <button 
                                    className={`w-full text-left px-3 py-2 rounded-lg transition ${pageState === category ? "bg-black text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                                    onClick={() => setPageState(category)}
                                >
                                    {category}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="mt-8 bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-bold mb-4">Trending</h2>
                    <Swiper pagination={true} modules={[Pagination]} className="h-80">
                        {trendingBlogs?.map((blog, index) => (
                            <SwiperSlide key={index}>
                                <MinimalBlogPostCard blog={blog} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </aside>
            
            {/* Main Content */}
            <main className="flex-1">
                <div className="grid gap-8">
                    {error ? (
                        <div className="text-center text-red-600">{error}</div> // Show error message if any error occurred
                    ) : blogs === null ? (
                        <Loader />
                    ) : blogs.results.length ? (
                        renderBlogCards()
                    ) : (
                        <NodataMessage message="No blog published" />
                    )}
                </div>
                <div id="load-more" className="h-10" />
            </main>
        </div>
    );
};

export default BlogMain;