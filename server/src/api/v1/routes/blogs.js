import express from "express"

// middlewares
import { verifyJWT } from "../../../middlewares/index.js"
import {
    getUploadUrl,
    uploadFile,
    uploadImage,
    createBlog,
    latestBlogs,
    trendingBlogs,
    blogsInRange,
    searchBlogs,
    latestBlogsCount,
    searchBlogsCount,
    getBlog,
    likeBlog,
    isUserLiked,
    deleteBlog,
    latestPodcast,
    getPodcastBlogs,
    getPodcastBlogsCount,
} from "../controllers/blogs.js"

const router = express.Router()

// File upload routes
router.post("/upload-file", verifyJWT, uploadImage, uploadFile)
router.get("/get-upload-url", verifyJWT, getUploadUrl) // Legacy route for compatibility
router.post("/create", verifyJWT, createBlog)

router.post("/search", searchBlogs)
router.post("/search/total-posts", searchBlogsCount)

router.post("/latest", latestBlogs)
router.post("/latest/total-posts", latestBlogsCount)
router.post("/podcast", getPodcastBlogs)
router.post("/podcast/total-posts", getPodcastBlogsCount)

router.get("/trending", trendingBlogs)
router.post("/range", blogsInRange)

router.post("/get-blog", getBlog)

router.post("/like-blog", verifyJWT, likeBlog)
router.post("/is-user-liked", verifyJWT, isUserLiked)

router.post("/delete", verifyJWT, deleteBlog)

// router.post("/fetchUrl", verifyJWT, fetchUrl)

export default router
