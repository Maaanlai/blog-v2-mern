import { createContext, useEffect, useState } from "react"
import axios from "axios"
import { Link, useParams } from "react-router-dom"

// utils
import { getFullDay } from "../utils/getDate"

// components
import AnimationWrapper from "../components/common/AnimationWrapper"
import Loader from "../components/common/Loader"
import BlogInteraction from "../components/blog/BlogInteraction"
import BlogCard from "../components/common/cards/BlogCard"
import BlogContent from "../components/blog/BlogContent"
import CommentsContainer, {
    fetchComments,
} from "../components/blog/CommentsContainer"
import ReportContainer from "../components/blog/ReportContainer"

export const blogStructure = {
    title: "",
    banner: "",
    content: [],
    author: { personal_info: {} },
    publishedAt: "",
    tags: [],
}

export const BlogContext = createContext({})

const collectText = (value) =>
    typeof value === "string"
        ? value
        : value && typeof value === "object"
        ? Object.values(value).map(collectText).join(" ")
        : ""

// rough estimate at ~200 words per minute
const readingTime = (content) => {
    const text = (content?.[0]?.blocks || [])
        .map((block) => collectText(block.data))
        .join(" ")
        .replace(/<[^>]+>/g, " ")
    const words = text.split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.round(words / 200))
}

const Blog = () => {
    const [blog, setBlog] = useState(blogStructure)
    const [loading, setLoading] = useState(true)
    const [similarBlogs, setSimilarBlogs] = useState(null)
    const [isUserLiked, setIsUserLiked] = useState(false)

    // comments
    const [isCommentsWrapper, setIsCommentsWrapper] = useState(true)
    const [isReportContainer, setIsReportContainer] = useState(true)
    const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] =
        useState(0)

    const { blogId } = useParams()

    const {
        title,
        content,
        banner,
        author: {
            personal_info: { fullName, username: username_, profile_img },
        },
        publishedAt,
        tags,
    } = blog

    const fetchBlog = () => {
        axios
            .post(`/api/v1/blogs/get-blog`, {
                blog_id: blogId,
            })
            .then(async ({ data: { blog } }) => {
                /**
                 * NOTE fetching comments and adding the comments to the blog response data
                 */
                blog.comments = await fetchComments({
                    blog_id: blog._id,
                    setParentCommentCountFunc: setTotalParentCommentsLoaded,
                })

                setBlog(blog)

                /**
                 * get similar blogs related to first tag
                 *
                 * eliminate_blog => remove the current opened blog from the recommendation
                 */
                axios
                    .post(`/api/v1/blogs/search`, {
                        tag: tags[0],
                        limit: 6,
                        eliminate_blog: blogId,
                    })
                    .then(({ data }) => {
                        setSimilarBlogs(data?.blogs)
                    })

                setLoading(false)
            })
            .catch((error) => {
                console.log(error)
                setLoading(false)
            })
    }

    useEffect(() => {
        resetStates()
        fetchBlog()
    }, [blogId])

    const resetStates = () => {
        setBlog(blogStructure)
        setSimilarBlogs(null)
        setLoading(true)

        setIsUserLiked(false)
        setIsCommentsWrapper(false)
        setIsReportContainer(false)
        setTotalParentCommentsLoaded(0)
    }

    return (
        <AnimationWrapper>
            {loading ? (
                <Loader />
            ) : (
                <BlogContext.Provider
                    value={{
                        blog,
                        setBlog,
                        isUserLiked,
                        setIsUserLiked,
                        isCommentsWrapper,
                        setIsCommentsWrapper,
                        totalParentCommentsLoaded,
                        setTotalParentCommentsLoaded,
                        isReportContainer,
                        setIsReportContainer,
                    }}
                >
                    <CommentsContainer />

                    <ReportContainer />

                    <article className="pb-10">
                        {/* Header */}
                        <header className="max-w-[860px] center px-[5vw] md:px-0 pt-12 md:pt-20 text-center">
                            {tags?.[0] && (
                                <Link
                                    to={`/blog-main?tag=${tags[0]}`}
                                    className="kicker hover:opacity-70"
                                >
                                    {tags[0]}
                                </Link>
                            )}

                            <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight text-ink">
                                {title}
                            </h1>

                            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-base text-muted">
                                <Link
                                    to={`/user/${username_}`}
                                    className="flex items-center gap-3 hover:opacity-70"
                                >
                                    <img
                                        src={profile_img}
                                        alt={username_}
                                        className="!w-9 !h-9 rounded-full border border-line"
                                    />
                                    <span className="font-bold text-black">
                                        {fullName || username_}
                                    </span>
                                </Link>
                                <span>{getFullDay(publishedAt)}</span>
                                <span className="pre-dot">
                                    {readingTime(content)} min read
                                </span>
                            </div>
                        </header>

                        {/* Banner */}
                        {banner && (
                            <div className="container-wide mt-10 md:mt-14">
                                <div className="aspect-[16/9] max-h-[640px] w-full overflow-hidden rounded-[1.4rem] md:rounded-[2rem] bg-grey shadow-float">
                                    <img src={banner} alt={title} />
                                </div>
                            </div>
                        )}

                        <div className="max-w-[720px] center px-[5vw] md:px-0">
                            <div className="my-12 blog-page-content">
                                {content[0].blocks.map((block, index) => (
                                    <div key={index} className="my-4 md:my-6">
                                        <BlogContent block={block} />
                                    </div>
                                ))}
                            </div>

                            <BlogInteraction />
                        </div>

                        {similarBlogs !== null && similarBlogs.length ? (
                            <div className="container-wide">
                                <div className="section-title mt-20">
                                    <span>Similar stories</span>
                                </div>

                                <div className="grid md:grid-cols-2 gap-x-10 gap-y-10">
                                    {similarBlogs.map((blog, index) => (
                                        <AnimationWrapper
                                            key={index}
                                            transition={{
                                                duration: 0.6,
                                                delay: index * 0.08,
                                            }}
                                        >
                                            <BlogCard blog={blog} />
                                        </AnimationWrapper>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            ""
                        )}
                    </article>
                </BlogContext.Provider>
            )}
        </AnimationWrapper>
    )
}

export default Blog
