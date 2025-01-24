import { useEffect, useState } from "react"
import axios from "axios"
import { filterPaginationData } from "../functions"
import AnimationWrapper from "../components/common/AnimationWrapper"
import Loader from "../components/common/Loader"
import BlogCard from "../components/common/cards/BlogCard"
import MinimalBlogPostCard from "../components/common/cards/MinimalBlogPostCard"
import NodataMessage from "../components/common/NodataMessage"
import LoadMoreBtn from "../components/common/buttons/LoadMoreBtn"

const Home = () => {
    const [blogs, setBlogs] = useState(null)
    const [trendingBlogs, setTrendingBlogs] = useState(null)
    const [pageState, setPageState] = useState("home")

    const categories = [
        "finance", "programming", "fraud", "new", "trading",
        "business", "investing", "wealth", "economy",
    ]

    const fetchLatestBlogs = ({ page = 1 }) => {
        axios
            .post(`/api/v1/blogs/latest`, { page })
            .then(async ({ data }) => {
                const formattedData = await filterPaginationData({
                    state: blogs,
                    data: data?.blogs,
                    page,
                    countRoute: "blogs/latest/total-posts",
                })
                setBlogs(formattedData)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const fetchBlogsByCategory = ({ page = 1 }) => {
        axios
            .post(`/api/v1/blogs/search`, {
                tag: pageState,
                page,
            })
            .then(async ({ data }) => {
                const formattedData = await filterPaginationData({
                    state: blogs,
                    data: data?.blogs,
                    page,
                    countRoute: "blogs/search/total-posts",
                    dataToSend: { tag: pageState },
                })
                setBlogs(formattedData)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const fetchTrendingBlogs = () => {
        axios
            .get(`/api/v1/blogs/trending`)
            .then(({ data }) => {
                setTrendingBlogs(data?.blogs)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleLoadCategory = (event) => {
        const category = event.target.innerText.toLowerCase()
        setBlogs(null)

        if (pageState === category) {
            setPageState("home")
            return
        }

        setPageState(category)
    }

    useEffect(() => {
        setBlogs(null)
        
        if (pageState === "home") {
            fetchLatestBlogs({ page: 1 })
        } else {
            fetchBlogsByCategory({ page: 1 })
        }

        if (!trendingBlogs) {
            fetchTrendingBlogs()
        }
    }, [pageState])

    return (
        <AnimationWrapper>
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Category Navigation */}
                        <div className="mb-8">
                            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                                <button 
                                    className={"px-4 py-2 rounded-full whitespace-nowrap transition-colors " + 
                                        (pageState === "home" ? "bg-black text-white" : "bg-gray-100")}
                                    onClick={() => setPageState("home")}
                                >
                                    All Posts
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        className={"px-4 py-2 rounded-full whitespace-nowrap transition-colors " + 
                                            (pageState === category ? "bg-black text-white" : "bg-gray-100")}
                                        onClick={handleLoadCategory}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Blog Posts Grid */}
                        {blogs === null ? (
                            <Loader />
                        ) : blogs.results.length ? (
                            <div className="grid gap-8">
                                {blogs.results.map((blog, index) => (
                                    <AnimationWrapper
                                        key={blog?.blog_id}
                                        transition={{
                                            duration: 1,
                                            delay: index * 0.1,
                                        }}
                                    >
                                        <BlogCard
                                            blog={blog}
                                            author={blog?.author?.personal_info}
                                        />
                                    </AnimationWrapper>
                                ))}
                            </div>
                        ) : (
                            <NodataMessage message="No blog published" />
                        )}

                        {/* Load More Button */}
                        {blogs?.hasMore && (
                            <div className="mt-10">
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
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-[350px] shrink-0">
                        <div className="sticky top-8 space-y-8">
                            {/* Trending Section */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    Trending <i className="fi fi-rr-arrow-trend-up"></i>
                                </h2>
                                
                                {trendingBlogs === null ? (
                                    <Loader />
                                ) : trendingBlogs.length ? (
                                    <div className="space-y-5">
                                        {trendingBlogs.map((blog, index) => (
                                            <AnimationWrapper
                                                key={blog?.blog_id}
                                                transition={{
                                                    duration: 1,
                                                    delay: index * 0.1,
                                                }}
                                            >
                                                <MinimalBlogPostCard
                                                    blog={blog}
                                                    index={index}
                                                />
                                            </AnimationWrapper>
                                        ))}
                                    </div>
                                ) : (
                                    <NodataMessage message="No trending blogs" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AnimationWrapper>
    )
}

export default Home