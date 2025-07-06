import { Fragment, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import UserNavigationPanel from "./UserNavigationPanel";

import { useStateContext } from "../contexts/GlobalContext";

// functions
import { setSession } from "../functions/session";

// assets
import { logoDark, logoLight, user } from "../assets";

const Navbar = () => {
  const [searchboxVisibility, setSearchBoxVisibility] = useState(false);
  const [userNavPanel, setUserNavPanel] = useState(false);

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
      <nav className="navbar z-50">
        <Link to="/" className="flex-none w-10">
          <img
            src={theme == "light" ? logoDark : logoLight}
            alt="logo"
            className="w-full"
          />
        </Link>

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
            to="/course"
            className="text-dark-grey hover:text-black dark:hover:text-white transition-colors"
          >
            Сургалт материал
          </Link>
          <Link
            to="/podcast"
            className="text-dark-grey hover:text-black dark:hover:text-white transition-colors"
          >
            Подкаст
          </Link>
          <Link
            to="/about"
            className="text-dark-grey hover:text-black dark:hover:text-white transition-colors"
          >
            Бидний тухай
          </Link>
        </div>

        {/* <div
					className={
						"absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " +
						(searchboxVisibility ? "sow" : "hide")
					}
				>
					<input
						type="text"
						name=""
						placeholder="Search"
						className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
						onKeyDown={handleSearch}
					/>

					<i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
				</div> */}

        <div className="flex items-right gap-3 md:gap-6 ml-auto">
          <button
            className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
            onClick={() => setSearchBoxVisibility((current) => !current)}
          >
            <i className="fi fi-rr-search text-xl"></i>
          </button>
          {/* <Link to="/editor" className="hidden md:flex gap-2 link">
						<i className="fi fi-rr-file-edit"></i>
						<p>Write</p>
					</Link> */}

          {/* change theme */}
          {/* <button
            className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/20"
            onClick={changeTheme}
          >
            <i
              className={
                "fi fi-rr-" +
                (theme == "light" ? "moon-stars" : "sun") +
                " text-2xl block mt-1"
              }
            ></i>
          </button> */}

          {adminData.admin_token && adminData.admin_token !== null && (
            <>
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
            </>
          )}
        </div>
      </nav>

      <Outlet />
    </Fragment>
  );
};

export default Navbar;
