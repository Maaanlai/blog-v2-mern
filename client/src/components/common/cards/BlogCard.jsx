import { Link } from "react-router-dom";
import { getDate } from "../../../utils/getDate";

const BlogCard = ({ blog }) => {
  const {
    title,
    des,
    banner,
    tags,
    publishedAt,
    activity: { total_likes },
    blog_id: id,
    author,
  } = blog;

  const { fullName, username, profile_img } = author?.personal_info || {};

  return (
    <Link
      to={`/blog/${id}`}
      className="block bg-white rounded-xl shadow-sm hover:shadow-lg tWransition-shadow duration-300 overflow-hidden"
    >
      {/* Banner Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={banner}
          alt={title}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
        />
        {/* Tag Overlay */}
        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
          {tags[0]}
        </span>
      </div>

      <div className="p-6">
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
          {title}
        </h2>

        {/* Description */}
        <p className="mt-3 text-gray-600 line-clamp-2 text-base">{des}</p>

        {/* Author Info & Metadata */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {fullName || "Anonymous"}{" "}
                {/* Fallback to "Anonymous" if fullName is missing */}
              </p>
              <p className="text-sm text-gray-500">
                @{username || "no-username"}{" "}
                {/* Fallback to "no-username" if username is missing */}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <i className="fi fi-rr-heart text-red-500 mr-1"></i>
              <span>{total_likes}</span>
            </div>
            <div className="hidden md:block">
              <time dateTime={publishedAt}>{getDate(publishedAt)}</time>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
