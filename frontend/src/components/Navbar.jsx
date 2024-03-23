import { IoIosSearch } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../contexts/authContext";

function Navbar({ isLoggedin }) {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [searchInput, setSearchInput] = useState("");
  const [profileClicked, setProfileClicked] = useState(false);
  const modalRef = useRef(null);

  const handleLogoutClick = async () => {
    try {
      const response = await fetch("http://localhost:3000/user/logout", {
        method: "GET",
        credentials: "include",
      });
      const responseData = await response.json();
      console.log("Response from backend:", responseData);
      if (response.status === 200) {
        toast.success(responseData.message, {
          position: "top-right",
        });
        authContext.setAuth(false);
        navigate("/");
      } else {
        toast.error(responseData.error, {
          position: "top-right",
        });
      }
    } catch (err) {
      toast.error("Something went wrong!", { position: "top-right" });
    }
  };

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

  const handleProfieClick = (e) => {
    setProfileClicked(true);
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setProfileClicked(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="z-10 flex justify-between">
        <Link
          to="/"
          className=" font-bold text-[3rem] select-none cursor-pointer"
        >
          Blogify.
        </Link>
        <div className="flex items-center gap-5">
          {isLoggedin && (
            <Link to="/add">
              {" "}
              <div className="bg-[#4B6BFB] text-white py-2 px-5 font-semibold  rounded-md cursor-pointer">
                Add Blog
              </div>{" "}
            </Link>
          )}
          <div className="relative">
            <input
              className="h-10 w-60 pl-4 pr-10 border-2 border-[#F4F4F5] bg-[#F4F4F5] rounded-[5px] outline-none placeholder-[#A1A1AA]  font-medium "
              type="text"
              placeholder="Search"
              onChange={handleSearch}
              value={searchInput}
            />
            <IoIosSearch className="size-7 absolute top-2 right-2 text-[#52525B] cursor-pointer" />
          </div>
          <div className="relative">
            <CgProfile
              className="size-8 text-[#52525B] cursor-pointer hover:opacity-60 "
              onClick={handleProfieClick}
            />
            {profileClicked && (
              <div
                ref={modalRef}
                className="absolute bg-[#F4F4F5] mt-1 ml-1 text-pretty cursor-pointer text-[1rem]  rounded-[5px] z-40"
              >
                <div>
                  {!isLoggedin && (
                    <Link to="/auth">
                      <p className=" pr-14 pl-3 py-2 hover:bg-[#4B6BFB] hover:text-white ">
                        Signin
                      </p>
                    </Link>
                  )}
                  {!isLoggedin && (
                    <Link to="/auth">
                      <p className="pr-14 pl-3  py-2 hover:bg-[#4B6BFB] hover:text-white ">
                        Signup
                      </p>
                    </Link>
                  )}
                  {isLoggedin && (
                    <p
                      onClick={handleLogoutClick}
                      className=" pr-14 pl-3 py-2 hover:bg-[#4B6BFB] hover:text-white "
                    >
                      Logout
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
