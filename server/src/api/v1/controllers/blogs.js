import { nanoid } from "nanoid"
import multer from "multer"
import path from "path"
import fs from "fs"

// models
import Blog from "../../../models/Blog.js"
import User from "../../../models/User.js"
import Notification from "../../../models/Notification.js"
import Comment from "../../../models/Comment.js"

// configs
import { serverConfig } from "../../../configs/index.js"

// Configure multer for file uploads
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadPath = path.join(process.cwd(), 'server/uploads');
		// Create directory if it doesn't exist
		if (!fs.existsSync(uploadPath)) {
			fs.mkdirSync(uploadPath, { recursive: true });
		}
		cb(null, uploadPath);
	},
	filename: (req, file, cb) => {
		const date = new Date();
		const imageName = `${nanoid()}-${date.getTime()}${path.extname(file.originalname)}`;
		cb(null, imageName);
	}
});

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB limit
	},
	fileFilter: (req, file, cb) => {
		// Check if file is an image
		if (file.mimetype.startsWith('image/')) {
			cb(null, true);
		} else {
			cb(new Error('Only image files are allowed!'), false);
		}
	}
});

// Single file upload middleware
export const uploadImage = upload.single('image');

export const uploadFile = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({
				status: 6001,
				message: "No file uploaded"
			});
		}

		// Generate the URL for the uploaded file - use relative path for proxy
		const fileUrl = `/uploads/${req.file.filename}`;

		res.status(200).json({
			status: 6000,
			imageUrl: fileUrl,
			filename: req.file.filename
		});
	} catch (error) {
		res.status(500).json({
			status: 6001,
			message: error?.message
		});
	}
}

// Legacy function for compatibility - now returns a placeholder
export const getUploadUrl = async (req, res) => {
	res.status(200).json({
		status: 6000,
		message: "Please use the /upload-file endpoint for file uploads",
		uploadUrl: null
	});
}

export const createBlog = async (req, res) => {
	/**
	 * id => blogId from the frontend
	 */

	const authorId = req.user

	let { title, content, des, tags, banner, draft, id } = req?.body

	if (!title) {
		return res.status(403).json({
			status: 6001,
			message: "You must provide a title to publish the blog",
		})
	}

	if (!draft) {
		if (!des || des.length > 200) {
			return res.status(403).json({
				status: 6001,
				message:
					"You must provide blog description under 200 characters",
			})
		}

		// if (!banner) {
		// 	return res.status(403).json({
		// 		status: 6001,
		// 		message: "You must provide a banner to publish it",
		// 	})
		// }

		if (!content.blocks.length) {
			return res.status(403).json({
				status: 6001,
				message: "There must be some blog content to publish it",
			})
		}

		if (!tags || tags.length > 10) {
			return res.status(403).json({
				status: 6001,
				message:
					"Provide tags in order to publish the blog, Maximum 10",
			})
		}
	}

	tags = tags && tags.map((tag) => tag.toLowerCase())

	// slugify the title + unique id
	const blog_id =
		id ||
		title
			.replace(/[^a-zA-Z0-9]/g, " ")
			.replace(/\s+/g, "-")
			.trim() + nanoid()

	if (id) {
		Blog.findOneAndUpdate(
			{ blog_id },
			{ title, des, banner, content, tags, draft: draft ? draft : false }
		)
			.then(() => {
				res.status(200).json({
					status: 6000,
					message: "Successfully updated",
					blogId: blog_id,
				})
			})
			.catch((error) => {
				res.status(500).json({
					status: 6001,
					message: error?.message,
				})
			})
	} else {
		const blog = new Blog({
			title,
			des,
			content,
			tags,
			banner,
			author: authorId,
			blog_id,
			draft: Boolean(draft), // the boolean() will helps set correct value
		})

		blog.save()
			.then((blog) => {
				let incrementVal = draft ? 0 : 1

				/**
				 * update the User model to
				 * increment the total_posts count and
				 * push the new blog post int user blogs
				 */
				User.findOneAndUpdate(
					{ _id: authorId },
					{
						$inc: { "account_info.total_posts": incrementVal },
						$push: { blogs: blog._id },
					}
				)
					.then((user) => {
						res.status(200).json({
							status: 6000,
							message: "Successfully created",
							blogId: blog.blog_id,
						})
					})
					.catch((error) => {
						res.status(500).json({
							status: 6001,
							message: "Failed to update the total post count",
						})
					})
			})
			.catch((error) => {
				return res.status(500).json({
					status: 6001,
					message: error?.message,
				})
			})
	}
}

export const latestBlogs = async (req, res) => {
	const { page } = req.body

	const maxLimit = 5

	Blog.find({ draft: false })
		.populate(
			"author",
			"personal_info.profile_img personal_info.username personal_info.fullName -_id"
		)
		.sort({ publishedAt: -1 })
		.select("blog_id title des banner activity tags publishedAt -_id")
		.skip((page - 1) * maxLimit) // skip() will skip documents
		.limit(maxLimit)
		.then((blogs) => {
			return res.status(200).json({
				status: 6000,
				blogs,
			})
		})
		.catch((error) => {
			return res.status(500).json({
				status: 6001,
				message: error?.message,
			})
		})
}

export const latestBlogsCount = async (req, res) => {
	/**
	 * countDocuments() will give the total count of document
	 * present in the collection
	 */
	Blog.countDocuments({ draft: false })
		.then((count) => {
			return res.status(200).json({
				status: 6000,
				totalDocs: count,
			})
		})
		.catch((error) => {
			return res.status(500).json({
				status: 6001,
				message: error?.message,
			})
		})
}

export const trendingBlogs = async (req, res) => {
	Blog.find({ draft: false })
		.populate(
			"author",
			"personal_info.profile_img personal_info.username personal_info.fullName -_id"
		)
		.sort({
			"activity.total_read": -1,
			"activity.total_likes": -1,
			publishedAt: -1,
		})
		.select("blog_id title publishedAt -_id banner tags activity")
		.limit(5)
		.then((blogs) => {
			return res.status(200).json({
				status: 6000,
				blogs,
			})
		})
		.catch((error) => {
			return res.status(500).json({
				status: 6001,
				message: error?.message,
			})
		})
}


export const blogsInRange = async (req, res) => {
	const { from, to, limit = 14 } = req.body

	const start = new Date(from)
	const end = new Date(to)

	if (isNaN(start) || isNaN(end)) {
		return res.status(400).json({
			status: 6001,
			message: "from and to must be valid dates",
		})
	}

	Blog.find({ draft: false, publishedAt: { $gte: start, $lt: end } })
		.populate(
			"author",
			"personal_info.profile_img personal_info.username personal_info.fullName -_id"
		)
		.sort({ publishedAt: -1 })
		.select("blog_id title des banner activity tags publishedAt -_id")
		.limit(Math.min(Number(limit) || 14, 50))
		.then((blogs) => {
			return res.status(200).json({
				status: 6000,
				blogs,
			})
		})
		.catch((error) => {
			return res.status(500).json({
				status: 6001,
				message: error?.message,
			})
		})
}

export const getPodcastBlogs = async (req, res) => {
	const { page = 1 } = req.body
	const maxLimit = 5

	Blog.find({ draft: false, tags: "podcast" })
		.populate(
			"author",
			"personal_info.profile_img personal_info.username personal_info.fullName -_id"
		)
		.sort({ publishedAt: -1 })
		.select("blog_id title des banner activity tags publishedAt -_id")
		.skip((page - 1) * maxLimit)
		.limit(maxLimit)
		.then((blogs) => {
			return res.status(200).json({
				status: 6000,
				blogs,
			})
		})
		.catch((error) => {
			return res.status(500).json({
				status: 6001,
				message: error?.message,
			})
		})
}

export const getPodcastBlogsCount = async (req, res) => {
	Blog.countDocuments({ draft: false, tags: "podcast" })
		.then((count) => {
			return res.status(200).json({
				status: 6000,
				totalDocs: count,
			})
		})
		.catch((error) => {
			return res.status(500).json({
				status: 6001,
				message: error?.message,
			})
		})
}

export const searchBlogs = async (req, res) => {
	/**
	 * $ne: `eliminate_blog` => this will find only blog id not equals to `eliminate_blog`
	 */
	const { tag, query, author, page, limit, eliminate_blog } = req.body

	let findQuery

	if (tag) {
		findQuery = {
			tags: tag,
			draft: false,
			blog_id: { $ne: eliminate_blog },
		}
	} else if (query) {
		findQuery = { draft: false, title: new RegExp(query, "i") }
	} else if (author) {
		findQuery = { author, draft: false }
	}

	const maxLimit = limit ? limit : 2

	Blog.find(findQuery)
		.populate(
			"author",
			"personal_info.profile_img personal_info.username personal_info.fullName -_id"
		)
		.sort({ publishedAt: -1 })
		.select("blog_id title des banner activity tags publishedAt -_id")
		.skip((page - 1) * maxLimit)
		.limit(maxLimit)
		.then((blogs) => {
			return res.status(200).json({
				status: 6000,
				blogs,
			})
		})
		.catch((error) => {
			return res.status(500).json({
				status: 6001,
				message: error?.message,
			})
		})
}

export const searchBlogsCount = async (req, res) => {
	const { tag, author, query } = req.body

	let findQuery

	if (tag) {
		findQuery = { tags: tag, draft: false }
	} else if (query) {
		findQuery = { draft: false, title: new RegExp(query, "i") }
	} else if (author) {
		findQuery = { author, draft: false }
	}

	Blog.countDocuments(findQuery)
		.then((count) => {
			return res.status(200).json({
				status: 6000,
				totalDocs: count,
			})
		})
		.catch((error) => {
			return res.status(500).json({
				status: 6001,
				message: error?.message,
			})
		})
}

export const getBlog = async (req, res) => {
	/**
	 * `$inc => incrementing something`
	 */

	const { blog_id, draft, mode } = req.body

	const incrementVal = mode !== "edit" ? 1 : 0

	Blog.findOneAndUpdate(
		{ blog_id },
		{ $inc: { "activity.total_reads": incrementVal } }
	)
		.populate(
			"author",
			"personal_info.fullName personal_info.username personal_info.profile_img"
		)
		.select("title des content banner activity publishedAt blog_id tags")
		.then((blog) => {
			/**
			 * updating the `total_reads` count from the author details
			 *
			 * `findOneAndUpdate` is a promise so should need the catch method.
			 */
			User.findOneAndUpdate(
				{
					"personal_info.username":
						blog.author.personal_info.username,
				},
				{ $inc: { "account_info.total_reads": incrementVal } }
			).catch((error) => {
				return res.status(500).json({
					status: 6001,
					message: error?.message,
				})
			})

			if (blog.draft && !draft) {
				return res.status(500).json({
					status: 6001,
					message: "You can not access draft blogs",
				})
			}

			return res.status(200).json({
				status: 6000,
				blog,
			})
		})
		.catch((error) => {
			return res.status(500).json({
				status: 6001,
				message: error?.message,
			})
		})
}

export const likeBlog = async (req, res) => {
	const user_id = req.user

	const { _id, isUserLiked } = req.body

	const incrementVal = !isUserLiked ? 1 : -1

	Blog.findOneAndUpdate(
		{ _id },
		{ $inc: { "activity.total_likes": incrementVal } }
	).then((blog) => {
		if (!isUserLiked) {
			const like = new Notification({
				type: "like",
				blog: _id,
				notification_for: blog.author,
				user: user_id,
			})

			like.save().then((notification) => {
				return res.status(200).json({
					status: 6000,
					liked_by_user: true,
				})
			})
		} else {
			Notification.findOneAndDelete({
				user: user_id,
				blog: _id,
				type: "like",
			})
				.then((data) => {
					return res.status(200).json({
						status: 6000,
						liked_by_user: false,
					})
				})
				.catch((error) => {
					return res.status(500).json({
						status: 6001,
						message: error?.message,
					})
				})
		}
	})
}

export const isUserLiked = async (req, res) => {
	/**
	 * request for sending information about currently logged
	 * user is liked the blog post or not
	 */

	const user_id = req.user

	const { _id } = req.body

	Notification.exists({ user: user_id, type: "like", blog: _id })
		.then((result) => {
			return res.status(200).json({
				status: 6000,
				result,
			})
		})
		.catch((error) => {
			return res.status(500).json({
				status: 6001,
				message: error?.message,
			})
		})
}

export const deleteBlog = (req, res) => {
	const user_id = req.user

	const { blog_id } = req.body

	Blog.findOneAndDelete({ blog_id })
		.then((blog) => {
			/**
			 * deleting all of the notifications and
			 * comments based on the blog
			 */

			Notification.deleteMany({ blog: blog._id }).then((data) =>
				console.log("Notification deleted")
			)

			Comment.deleteMany({ blog_id: blog._id }).then((data) =>
				console.log("Comment deleted")
			)

			User.findOneAndUpdate(
				{ _id: user_id },
				{
					$pull: { blog: blog._id },
					$inc: { "account_info.total_posts": -1 },
				}
			).then(() => {
				console.log("Blog deleted")
			})

			return res.status(200).json({
				status: 6000,
				message: "Deleted",
			})
		})
		.catch((error) => {
			return res.status(500).json({
				status: 6001,
				message: error?.message,
			})
		})
}

export const latestPodcast = async (req, res) => {
	try {
		const { page = 1, limit = 10 } = req.body;
		const skipAmount = (page - 1) * limit;

		// Find blogs that have 'podcast' in their tags
		const blogs = await Blog.find({
			tags: { $in: ['podcast'] }
		})
			.sort({ publishedAt: -1 })
			.skip(skipAmount)
			.limit(limit);

		if (!blogs.length) {
			return res.status(404).json({ error: 'No podcast blogs found' });
		}

		return res.status(200).json({
			blogs,
			totalBlogs: await Blog.countDocuments({ tags: { $in: ['podcast'] } })
		});

	} catch (error) {
		console.error('Error in latestPodcast:', error);
		return res.status(500).json({
			error: 'Error while fetching podcast blogs'
		});
	}
}