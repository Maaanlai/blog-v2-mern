import { Link } from "react-router-dom";
import { getFullDay } from "../../../utils/getDate";
import { user as defaultAvatar } from "../../../assets";

/**
 * Speech-bubble style article card (inspired by unread.today):
 * author row on top, then a white card whose square corner points at the
 * author, with a category label, bold title and a circular cover on the right.
 *
 * align="right" mirrors the author row and the bubble, for zig-zag lists.
 */
const BlogCard = ({
  blog,
  align = "left",
  showDescription = false,
  showStats = true,
}) => {
  const {
    title,
    des,
    banner,
    tags = [],
    publishedAt,
    activity: { total_likes = 0, total_comments = 0 } = {},
    blog_id: id,
    author,
  } = blog;

  const { fullName, username, profile_img } = author?.personal_info || {};
  const right = align === "right";

  return (
    <div className="group">
      <div
        className={`flex items-center gap-3 mb-4 px-1 ${
          right ? "flex-row-reverse text-right" : ""
        }`}
      >
        <img
          src={profile_img || defaultAvatar}
          alt={fullName || username || "author"}
          className="!w-9 !h-9 rounded-full border border-line shrink-0"
        />
        <div className="leading-snug min-w-0">
          <p className="text-base font-medium text-black line-clamp-1">
            {fullName || username || "Anonymous"}
          </p>
          <p className="text-base text-muted">{getFullDay(publishedAt)}</p>
        </div>
      </div>

      <Link
        to={`/blog/${id}`}
        className={`bubble-card md:min-h-[180px] ${
          right ? "!rounded-[2.7rem_0_2.7rem_2.7rem]" : ""
        }`}
      >
        <div className="flex items-start gap-5 md:gap-8">
          <div className="flex-1 min-w-0 pt-1">
            {tags[0] && (
              <p className="flex items-center gap-3 text-base font-semibold capitalize text-accent mb-2">
                <span className="accent-dot" />
                {tags[0]}
              </p>
            )}

            <p className="md:pl-[18px] text-2xl md:text-[22px] font-bold leading-snug text-ink line-clamp-3 group-hover:text-accent transition-colors">
              {title}
            </p>

            {showDescription && des && (
              <p className="md:pl-[18px] mt-2 text-base text-dark-grey line-clamp-2">
                {des}
              </p>
            )}

            {showStats && (
              <div className="md:pl-[18px] mt-4 flex items-center gap-4 text-base font-semibold text-muted">
                <span className="flex items-center gap-1">
                  <i className="fi fi-rr-heart"></i>
                  {total_likes}
                </span>
                <span className="flex items-center gap-1">
                  <i className="fi fi-rr-comment-dots"></i>
                  {total_comments}
                </span>
              </div>
            )}
          </div>

          {banner && (
            <div className="w-[88px] h-[88px] md:w-[135px] md:h-[135px] shrink-0 rounded-full overflow-hidden bg-grey">
              <img
                src={banner}
                alt={title}
                className="transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;
