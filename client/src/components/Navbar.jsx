import { Fragment, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import UserNavigationPanel from "./UserNavigationPanel";

import { useStateContext } from "../contexts/GlobalContext";

// functions
import { setSession } from "../functions/session";

// assets
import { user, logo } from "../assets";

const Navbar = () => {
  const [searchboxVisibility, setSearchBoxVisibility] = useState(false);
  const [userNavPanel, setUserNavPanel] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  const {
    userData,
    userData: { access_token, profile_img, new_notification_available },
    updateUserData,
    theme,
    setTheme,
    adminData,
    adminData: { admin_token },
  } = useStateContext();

  const changeTheme = () => {
    let newTheme = theme == "light" ? "dark" : "light";

    setTheme(newTheme);

    document.body.setAttribute("data-theme", newTheme);

    setSession("theme", newTheme);
  };

  const handleUserNavPanel = () => {
    setUserNavPanel((current) => !current);
  };

  const handleBlur = () => {
    setTimeout(() => setUserNavPanel(false), 200);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((current) => !current);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // search
  const handleSearch = (event) => {
    const query = event.target.value;

    console.log(event);

    if (event.keyCode === 13 && query.length) {
      navigate(`/search/${query}`);
      console.log("hello");
    }
  };

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
  }, [adminData]);

  return (
    <Fragment>
      <nav className="navbar z-50 relative">
        <Link to="/" className="flex-none w-10">
          <img
            src={theme == "light" ? logo : logo}
            alt="logo"
            className="w-full"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 ml-8">
          <Link
            to="/blog-main"
            className="text-dark-grey hover:text-black dark:hover:text-white transition-colors"
          >
            Нийтлэл мэдээлэл
          </Link>
          <Link
            to="/products"
            className="text-dark-grey hover:text-black dark:hover:text-white transition-colors"
          >
            Бүтээгдэхүүн үйлчилгээ
          </Link>
          <Link
            to="/about"
            className="text-dark-grey hover:text-black dark:hover:text-white transition-colors"
          >
            Бидний тухай
          </Link>
        </div>

        <div className="flex items-center gap-3 md:gap-6 ml-auto">
          {/* Desktop User Navigation */}
          {adminData.admin_token && adminData.admin_token !== null && (
            <div className="hidden md:block">
              <div
                className="relative"
                onClick={handleUserNavPanel}
                onBlur={handleBlur}
              >
                <button className="w-12 h-12 mt-1">
                  <img
                    className="w-full h-full object-cover rounded-full"
                    src={user}
                    alt="user"
                  />
                </button>

                {userNavPanel && <UserNavigationPanel />}
              </div>
            </div>
          )}

          {/* Hamburger Menu Button */}
          <button onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
            <div className="flex flex-col justify-center items-center space-y-1">
              <span
                className={`block w-5 h-0.5 bg-black dark:bg-white transition-all duration-300 ${
                  mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              ></span>
              <span
                className={`block w-5 h-0.5 bg-black dark:bg-white transition-all duration-300 ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`block w-5 h-0.5 bg-black dark:bg-white transition-all duration-300 ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`absolute top-full left-0 w-full bg-white dark:bg-black border-b border-grey md:hidden transition-all duration-300 ${
            mobileMenuOpen
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-2"
          }`}
        >
          <div className="px-6 py-4 space-y-4">
            <Link
              to="/blog-main"
              className="block text-dark-grey hover:text-black dark:hover:text-white transition-colors py-2"
              onClick={closeMobileMenu}
            >
              Нийтлэл мэдээлэл
            </Link>
            <Link
              to="/products"
              className="block text-dark-grey hover:text-black dark:hover:text-white transition-colors py-2"
              onClick={closeMobileMenu}
            >
              Бүтээгдэхүүн үйлчилгээ
            </Link>
            <Link
              to="/about"
              className="block text-dark-grey hover:text-black dark:hover:text-white transition-colors py-2"
              onClick={closeMobileMenu}
            >
              Бидний тухай
            </Link>

            {/* Mobile User Navigation */}
            {adminData.admin_token && adminData.admin_token !== null && (
              <div className="pt-4 border-t border-grey">
                <div className="flex items-center gap-3">
                  <img
                    className="w-10 h-10 object-cover rounded-full"
                    src={user}
                    alt="user"
                  />
                  <span className="text-dark-grey dark:text-white">
                    Admin Panel
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Overlay to close mobile menu when clicking outside */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={closeMobileMenu}
          ></div>
        )}
      </nav>

      <Outlet />
    </Fragment>
  );
};

export default Navbar;
