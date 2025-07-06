import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/GlobalContext";
import AnimationWrapper from "./common/AnimationWrapper";

const UserNavigationPanel = () => {
  const {
    adminData: { username },
    updateAdminData,
  } = useStateContext();

  const signOutUser = () => {
    updateAdminData({ type: "LOGOUT" });
    console.log(username);
  };

  return (
    <AnimationWrapper
      transition={{ duration: 0.2 }}
      className="absolute right-0 z-50"
    >
      <div className="bg-white absolute right-0 border border-grey w-60 overflow-hidden duration-200">
        <Link to="/editor" className="flex gap-2 link md:hidden pl-8 py-4">
          <i className="fi fi-rr-file-edit"></i>
          Write
        </Link>
        {/* <Link to={`/admin/${username}`} className="link pl-8 py-4">
          Profile
        </Link> */}
        <Link to="/admin/blogs" className="link pl-8 py-4">
          Dashboard
        </Link>
        <Link to="/admin/reports" className="link pl-8 py-4">
          Reports
        </Link>
        <span className="absolute border-t border-grey w-[100%]"></span>

        <button
          className="text-left p-4 hover:bg-grey w-full pl-8 py-4"
          onClick={signOutUser}
        >
          <h1 className="font-bold text-xl mg-1">Sign out</h1>
        </button>
      </div>
    </AnimationWrapper>
  );
};

export default UserNavigationPanel;
