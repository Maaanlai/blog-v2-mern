import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../common/Loader";
import NodataMessage from "../common/NodataMessage";
import { getDate } from "../../utils/getDate";

const DAY = 24 * 60 * 60 * 1000;
const WEEKS_SHOWN = 4;
const GROUP_SIZE = 7; // one mosaic: 1 big + 2 small + 4 on the right

const pad = (n) => String(n).padStart(2, "0");
const shortDate = (date) => `${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;

// previous full Monday–Sunday weeks, most recent first
const getPastWeeks = (now = new Date()) => {
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));

  return Array.from({ length: WEEKS_SHOWN }, (_, i) => {
    const from = new Date(monday.getTime() - (i + 1) * 7 * DAY);
    const to = new Date(from.getTime() + 7 * DAY);
    const last = new Date(to.getTime() - DAY);

    return {
      from,
      to,
      label: i === 0 ? "Last week" : `${shortDate(from)} - ${shortDate(last)}`,
    };
  });
};

const MosaicTile = ({ blog, className = "" }) => {
  const { title, banner, tags = [], blog_id: id, publishedAt } = blog;

  return (
    <Link
      to={`/blog/${id}`}
      className={`group relative block overflow-hidden rounded-[0.9rem] bg-black max-md:aspect-[4/3] ${className}`}
    >
      {banner && (
        <img
          src={banner}
          alt={title}
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_45%,rgba(0,0,0,0.8)_100%)]" />

      <div className="absolute bottom-0 inset-x-0 p-5 text-white">
        <span className="absolute -top-4 right-5 rounded-md bg-black/40 backdrop-blur px-2.5 py-1 text-sm font-medium">
          {getDate(publishedAt)}
        </span>
        {tags[0] && (
          <p className="text-sm capitalize text-white/60">{tags[0]}</p>
        )}
        <p className="mt-1 text-xl md:text-[17px] font-bold leading-snug line-clamp-2">
          {title}
        </p>
      </div>
    </Link>
  );
};

// big tile with two small ones under it on the left, a 2x2 block on the right
const Mosaic = ({ blogs }) => {
  const [big, smallA, smallB, ...rest] = blogs;

  return (
    <div className="grid md:grid-cols-2 gap-5">
      <div className="flex flex-col gap-5">
        <MosaicTile blog={big} className="md:aspect-[549/361]" />
        <div className="grid md:grid-cols-2 gap-5">
          {smallA && <MosaicTile blog={smallA} className="md:aspect-[265/234]" />}
          {smallB && <MosaicTile blog={smallB} className="md:aspect-[265/234]" />}
        </div>
      </div>

      {rest.length > 0 && (
        <div className="grid md:grid-cols-2 md:grid-rows-[272fr_325fr] gap-5">
          {rest.map((blog) => (
            <MosaicTile key={blog.blog_id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

const PrevWeeks = () => {
  const weeks = useMemo(() => getPastWeeks(), []);
  const [active, setActive] = useState(0);
  const [blogs, setBlogs] = useState(null);

  useEffect(() => {
    const { from, to } = weeks[active];
    let cancelled = false;

    setBlogs(null);
    axios
      .post(`/api/v1/blogs/range`, { from, to, limit: GROUP_SIZE * 2 })
      .then(({ data }) => {
        if (!cancelled) setBlogs(data?.blogs || []);
      })
      .catch((error) => {
        console.log("Error fetching past weeks:", error);
        if (!cancelled) setBlogs([]);
      });

    return () => {
      cancelled = true;
    };
  }, [active, weeks]);

  const groups = [];
  for (let i = 0; i < (blogs?.length || 0); i += GROUP_SIZE) {
    groups.push(blogs.slice(i, i + GROUP_SIZE));
  }

  return (
    <div className="max-w-[1120px] mx-auto px-[5vw] lg:px-0 mt-24">
      <div className="flex justify-between gap-6 border-b border-line overflow-x-auto [scrollbar-width:none]">
        {weeks.map(({ label }, i) => (
          <button
            key={label}
            onClick={() => setActive(i)}
            className={`whitespace-nowrap pb-4 -mb-px border-b-2 text-base transition-colors md:min-w-[200px] text-left last:text-right ${
              active === i
                ? "border-accent text-accent font-semibold"
                : "border-transparent text-muted hover:text-black"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-12 space-y-14">
        {blogs === null ? (
          <Loader />
        ) : groups.length ? (
          groups.map((group, i) => <Mosaic key={i} blogs={group} />)
        ) : (
          <NodataMessage message="No stories that week" />
        )}
      </div>
    </div>
  );
};

export default PrevWeeks;
