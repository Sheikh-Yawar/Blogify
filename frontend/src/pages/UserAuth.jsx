import { useState } from "react";
import Signup from "../components/Signup";
import Login from "../components/Login";

function UserAuth() {
  const [userAuthMethod, setUserAuthMethod] = useState("signup");

  const handleSignUpMethodClick = () => {
    setUserAuthMethod("signup");
  };
  const handleLoginMethodClick = () => {
    setUserAuthMethod("login");
  };
  return (
    <div className="h-[100vh] w-[100vw] bg-slate-100 font-workSans">
      <div className="flex justify-center pr-[520px]">
        <p className="font-bold text-[3rem] select-none cursor-pointer">
          Blogify.
        </p>
      </div>

      <div className="flex justify-center pt-10 ml-20">
        <div className="p-12 w-[50vw] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-lg bg-white ">
          <div className="flex justify-center">
            <div className="text-2xl font-medium text-white cursor-pointer">
              <button
                className={`${
                  userAuthMethod === "signup" ? "bg-[#4B6BFB]" : "bg-gray-400"
                } py-3 px-32 transition-colors duration-300 ease-in-out rounded-s-md`}
                onClick={handleSignUpMethodClick}
              >
                Sign up
              </button>
              <button
                className={`${
                  userAuthMethod === "login" ? "bg-[#4B6BFB]" : "bg-gray-400"
                } py-3 px-32 transition-colors duration-300 ease-in-out rounded-e-md`}
                onClick={handleLoginMethodClick}
              >
                Log in
              </button>
            </div>
          </div>
          <div className="mt-5">
            {userAuthMethod === "signup" ? <Signup /> : <Login />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserAuth;
