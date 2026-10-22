import { Link } from "react-router-dom";
import { BLOG_CATEGORIES } from "../utils/categories";
import { ubLogoWhite } from "../assets";
import { BRAND } from "../utils/brand";
import SocialIcons from "./common/SocialIcons";

const PAGE_LINKS = [
  { to: "/about", label: "About Us" },
  { to: "/products", label: "Products" },
  { to: "/blog-main", label: "Blogs" },
  { to: "/podcast", label: "Community" },
];

const half = Math.ceil(BLOG_CATEGORIES.length / 2);

const Footer = () => {
  return (
    <footer className="mt-20">
      {/* rounded "lip" that overlaps the black footer */}
      <div className="relative z-[1] h-[62px] md:h-[82px] bg-paper rounded-b-[2rem] md:rounded-b-[3.6rem]" />

      <div className="bg-ink text-white -mt-[55px] pt-[120px] pb-16 md:pb-20">
        <div className="container-wide grid md:grid-cols-5 gap-12">
          <div className="md:col-span-2">
            <img
              src={ubLogoWhite}
              alt={BRAND.name}
              className="h-10 md:h-12 w-auto object-contain"
            />

            <nav className="mt-10 flex flex-wrap items-center text-xl font-medium">
              {PAGE_LINKS.map(({ to, label }, i) => (
                <Link
                  key={to}
                  to={to}
                  className={`hover:opacity-60 transition-opacity ${i ? "pre-dot" : ""}`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            <p className="mt-6 max-w-md text-sm leading-5 text-white/50">
              © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
              Republishing content without permission or attribution is prohibited.
            </p>
          </div>

          <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            {[BLOG_CATEGORIES.slice(0, half), BLOG_CATEGORIES.slice(half)].map(
              (group, i) => (
                <div key={i}>
                  <p className="text-sm font-bold uppercase tracking-[0.1em] mb-4">
                    {i === 0 ? "Categories" : " "}
                  </p>
                  {group.map((category) => (
                    <Link
                      key={category}
                      to={`/blog-main?tag=${category}`}
                      className="block mt-2 text-xl capitalize text-white/60 hover:text-white hover:translate-x-1 transition-all"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              )
            )}

            <div className="col-span-2 md:col-span-1">
              <p className="text-sm font-bold uppercase tracking-[0.1em] mb-4">
                Company
              </p>
              <p className="mt-2 text-xl text-white/60">{BRAND.name}</p>
              {BRAND.email && (
                <a
                  href={`mailto:${BRAND.email}`}
                  className="block mt-2 text-xl text-white/60 hover:text-white transition-colors"
                >
                  {BRAND.email}
                </a>
              )}
              {BRAND.phone && (
                <a
                  href={`tel:${BRAND.phone}`}
                  className="block mt-2 text-xl text-white/60 hover:text-white transition-colors"
                >
                  {BRAND.phone}
                </a>
              )}
              <Link
                to="/about"
                className="block mt-2 text-xl text-white/60 hover:text-white transition-colors"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>

        <SocialIcons className="container-wide mt-14 gap-8" />
      </div>
    </footer>
  );
};

export default Footer;
