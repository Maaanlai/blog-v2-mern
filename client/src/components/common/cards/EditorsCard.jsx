import { Link } from "react-router-dom";
import { getDate } from "../../../utils/getDate";

/**
 * Tall image tile with a dark gradient overlay, read/comment counts, title and
 * an accent category pill, zooming slightly on hover (the "editor's choice"
 * row on unread.today, whose tiles are 325x480).
 */
const EditorsCard = ({ blog }) => {
  const { title, banner, tags = [], blog_id: id, activity, publishedAt } = blog;

  return (
    <Link
      to={`/blog/${id}`}
      className="relative block aspect-[325/480] overflow-hidden rounded-[0.9rem] bg-black shadow-float transition-transform duration-200 ease-in-out hover:scale-110 hover:z-10"
    >
      {banner && <img src={banner} alt={title} className="absolute inset-0" />}

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.3)_0%,rgba(0,0,0,0.1)_40%,rgba(0,0,0,0)_50%,rgba(0,0,0,0.6)_100%)]" />

      <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-base text-white">
        <span className="accent-dot !bg-accent-soft" />
        {publishedAt && <span className="font-medium">{getDate(publishedAt)}</span>}
      </div>

      <div className="absolute bottom-4 left-4 right-4 text-white">
        <div className="flex items-center gap-4 text-base font-semibold">
          <span className="flex items-center gap-1.5">
            <i className="fi fi-rr-eye" />
            {activity?.total_reads ?? 0}
          </span>
          <span className="flex items-center gap-1.5">
            <i className="fi fi-rr-comment" />
            {activity?.total_comments ?? 0}
          </span>
        </div>
        <p className="mt-3 text-xl md:text-[17px] font-bold leading-snug line-clamp-3">
          {title}
        </p>
        {tags[0] && <span className="chip-accent mt-4">{tags[0]}</span>}
      </div>
    </Link>
  );
};

export default EditorsCard;
