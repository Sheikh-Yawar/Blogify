import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginClick = async () => {
    if (email.length === 0 || password.length === 0) {
      toast.error("Please enter email and password first!!");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/user/signin", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      const responseData = await response.json();
      console.log("Response from backend:", responseData);

      if (response.status == 200) {
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
  return (
    <div>
      <label className="flex flex-col mt-4 ">
        Email
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="border-gray-400 rounded-md border-[1px] h-11  outline-[#4B6BFB] font-medium px-2 text-xl"
        />
      </label>
      <label className="flex flex-col mt-4 ">
        Password
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="border-gray-400 rounded-md border-[1px] h-11  outline-[#4B6BFB] font-medium px-2 text-xl"
        />
      </label>
      <div className="flex justify-center mt-8 ">
        <button
          onClick={handleLoginClick}
          className="bg-[#4B6BFB] py-2 px-20 transition-colors duration-300 ease-in-out rounded-s-md text-2xl font-medium text-white cursor-pointer"
        >
          Log in
        </button>
      </div>
    </div>
  );
}

export default Login;
