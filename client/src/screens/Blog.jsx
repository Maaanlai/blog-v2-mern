import { createContext, useEffect, useState } from "react"
import axios from "axios"
import { Link, useParams } from "react-router-dom"

// utils
import { getDate } from "../utils/getDate"

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

                    <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
                    <div className="bg-cover bg-center text-center overflow-hidden h-96">
        <img src={banner} alt={title} className="w-full h-full object-cover" />
      </div>
      
      {/* Content Section */}
      <div className="max-w-3xl mx-auto">
        <div className="mt-3 bg-white rounded-b lg:rounded-b-none lg:rounded-r flex flex-col justify-between leading-normal">
          <div className="bg-white relative -mt-32 p-5 sm:p-10">
            {/* Title */}
            <h1 className="text-gray-900 font-bold text-3xl mb-2">
              {title}
            </h1>
            
            {/* Author Info */}
            <div className="flex items-center gap-4 mt-4">
              <img 
                src={profile_img} 
                alt={username_} 
                className="w-12 h-12 rounded-full"
              />
              <div className="flex flex-col">
                <span className="text-gray-900 font-medium">
                  {fullName}
                </span>
                <Link 
                  to={`/user/${username_}`}
                  className="text-indigo-600 hover:text-gray-900 transition duration-500 ease-in-out"
                >
                  @{username_}
                </Link>
              </div>
              <span className="text-gray-500 ml-auto">
                Published on {getDate(publishedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
                        {/* <BlogInteraction /> */}

                        <div className="my-12 font-gelasio blog-page-content">
                            {content[0].blocks.map((block, index) => (
                                <div key={index} className="my-4 md:my-8">
                                    <BlogContent block={block} />
                                </div>
                            ))}
                        </div>

                        <BlogInteraction />

                        {similarBlogs !== null && similarBlogs.length ? (
                            <>
                                <h1 className="text-2xl mt-14 mb-10 font-medium">
                                    Similar blogs
                                </h1>

                                {similarBlogs.map((blog, index) => {
                                    const {
                                        author: { personal_info },
                                    } = blog

                                    return (
                                        <AnimationWrapper
                                            key={index}
                                            transition={{
                                                duration: 1,
                                                delay: index * 0.08,
                                            }}
                                        >
                                            <BlogCard
                                                blog={blog}
                                                author={
                                                    blog?.author?.personal_info
                                                }
                                            />
                                        </AnimationWrapper>
                                    )
                                })}
                            </>
                        ) : (
                            ""
                        )}
                    </div>
                </BlogContext.Provider>
            )}
        </AnimationWrapper>
    )
}

export default Blog
