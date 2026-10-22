import { Fragment, useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import UserNavigationPanel from "./UserNavigationPanel";
import Footer from "./Footer";

import { useStateContext } from "../contexts/GlobalContext";
import { BLOG_CATEGORIES } from "../utils/categories";

// assets
import { user, ubLogo, ubLogoWhite } from "../assets";
import SocialIcons from "./common/SocialIcons";
import { BRAND } from "../utils/brand";

const NAV_LINKS = [
  { to: "/about", label: "About Us", sub: "Бидний тухай" },
  { to: "/products", label: "Products and Services", sub: "Бүтээгдэхүүн үйлчилгээ" },
  { to: "/blog-main", label: "Blogs", sub: "Нийтлэл мэдээлэл" },
  { to: "/podcast", label: "Community", sub: "Podcast" },
];

const Navbar = () => {
  const [userNavPanel, setUserNavPanel] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const { pathname } = useLocation();

  // the home page opens with a dark hero, so the header sits on top of it
  const overHero = pathname === "/";

  const {
    userData,
    updateUserData,
    adminData,
    adminData: { admin_token },
  } = useStateContext();

  const handleUserNavPanel = () => {
    setUserNavPanel((current) => !current);
  };

  const handleBlur = () => {
    setTimeout(() => setUserNavPanel(false), 200);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    setMenuOpen(false);
    navigate(`/search/${encodeURIComponent(query)}`);
  };

  // close the full-screen menu whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // lock page scroll while the menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (admin_token) {
      axios
        .get(`/api/v1/notifications/new`, {
          headers: {
            Authorization: `Bearer ${admin_token}`,
          },
        })
        .then(({ data }) => {
          updateUserData({
            type: "LOGIN",
            payload: { ...userData, ...data },
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [adminData, admin_token, updateUserData, userData]);

  return (
    <Fragment>
      <nav
        className={`navbar z-50 ${
          overHero
            ? "!absolute inset-x-0 !bg-transparent !backdrop-blur-none text-white h-[100px]"
            : "text-black"
        }`}
      >
        {/* Burger */}
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="flex flex-col justify-center gap-[5px] w-8 h-8 shrink-0 group"
        >
          <span className="block h-[2px] w-6 bg-current rounded transition-all group-hover:w-7" />
          <span className="block h-[2px] w-4 bg-current rounded transition-all group-hover:w-7" />
          <span className="block h-[2px] w-6 bg-current rounded transition-all group-hover:w-7" />
        </button>

        <Link to="/" className="flex-none h-8 md:h-10">
          <img
            src={overHero ? ubLogoWhite : ubLogo}
            alt={BRAND.name}
            className="h-full w-auto object-contain"
          />
        </Link>

        <span className="hidden md:block w-px h-5 bg-current opacity-30" />

        <form
          onSubmit={handleSearch}
          className={`hidden md:flex items-center gap-2 ${
            overHero ? "text-white/50" : "text-muted"
          }`}
        >
          <i className="fi fi-rr-search" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className={`bg-transparent outline-none text-xl font-medium w-40 lg:w-56 ${
              overHero
                ? "text-white placeholder:text-white/50"
                : "text-black placeholder:text-muted"
            }`}
          />
        </form>

        <div className="flex items-center gap-3 md:gap-6 ml-auto">
          {/* uppercase white links over the hero, the earlier grey style elsewhere */}
          <div className={`hidden lg:flex items-center ${overHero ? "gap-6" : "gap-7"}`}>
            {NAV_LINKS.map(({ to, label }) => {
              const active = pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`transition-colors ${
                    overHero
                      ? "text-base font-semibold uppercase tracking-[0.04em] text-white/80 hover:text-white"
                      : `text-xl font-semibold hover:text-accent ${
                          active ? "text-black" : "text-muted"
                        }`
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          <Link
            to="/blog-main"
            className={`chip max-sm:hidden ${
              overHero ? "!bg-white/50 !text-white !shadow-none hover:!bg-white/60" : ""
            }`}
          >
            Latest
            <span className={`accent-dot animate-pulse ${overHero ? "!bg-white" : ""}`} />
          </Link>

          {overHero && (
            <SocialIcons
              className="hidden xl:flex gap-4 ml-4 text-white"
              iconClassName="w-[14px] h-[14px]"
            />
          )}

          {admin_token && (
            <div className="relative" onClick={handleUserNavPanel} onBlur={handleBlur}>
              <button className="w-11 h-11 rounded-full overflow-hidden border border-line">
                <img src={user} alt="user" />
              </button>

              {userNavPanel && <UserNavigationPanel />}
            </div>
          )}
        </div>
      </nav>

      {/* Full-screen menu */}
      <div
        className={`fixed inset-0 z-[1300] bg-paper overflow-y-auto transition-[opacity,visibility] duration-300 ${
          menuOpen ? "show visible" : "hide invisible"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="container-wide flex items-center gap-6 h-[80px]">
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="w-8 h-8 flex items-center justify-center text-2xl"
          >
            <i className="fi fi-rr-cross" />
          </button>
          <Link to="/" className="h-8 md:h-10">
            <img src={ubLogo} alt={BRAND.name} className="h-full w-auto object-contain" />
          </Link>
        </div>

        <div className="container-wide pb-16">
          <form
            onSubmit={handleSearch}
            className="md:hidden mt-6 flex items-center gap-3 border-b border-line pb-3 text-muted"
          >
            <i className="fi fi-rr-search" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="bg-transparent outline-none text-2xl font-medium text-black placeholder:text-muted w-full"
            />
          </form>

          <div className="grid md:grid-cols-2 gap-12 md:gap-24 mt-10 md:mt-16 max-w-5xl">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.1em] text-black">
                Pages
              </p>
              <div className="mt-6 md:mt-10 flex flex-col gap-3">
                {NAV_LINKS.map(({ to, label, sub }) => (
                  <Link
                    key={to}
                    to={to}
                    className="text-3xl font-semibold text-muted hover:text-black transition-colors"
                  >
                    {label} <span className="text-base font-medium align-middle ml-1">{sub}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.1em] text-black">
                Categories
              </p>
              <div className="mt-6 md:mt-10 flex flex-col gap-3">
                {BLOG_CATEGORIES.map((category) => (
                  <Link
                    key={category}
                    to={`/blog-main?tag=${category}`}
                    className="text-3xl font-semibold capitalize text-muted hover:text-black transition-colors"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16 md:mt-24 max-w-5xl">
            <Link to="/about" className="group block w-fit">
              <span className="text-xl text-black">Get in touch with us</span>
              <p className="text-3xl md:text-4xl font-black uppercase tracking-wide text-black group-hover:text-accent transition-colors">
                Contact &rarr;
              </p>
            </Link>
            <p className="mt-10 text-sm text-muted max-w-md">
              © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      <Outlet />
      <Footer />
    </Fragment>
  );
};

export default Navbar;
