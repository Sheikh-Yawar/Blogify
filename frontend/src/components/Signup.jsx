import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { toast } from "react-toastify";

function Signup() {
  const navigate = useNavigate();
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState(initialValues);
  const [isFormValidated, setIsFormValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormValuesChange = (e) => {
    const { name, value } = e.target;
    setIsFormValidated(
      Object.values(formValues).every((value) => value.length > 0)
    );
    setFormValues({ ...formValues, [name]: value });
  };

  const validateForm = (values) => {
    const errors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (values.firstName.length <= 3) {
      errors.firstName = "First Name should be minimum 4 characters long!";
    }
    if (values.lastName.length <= 3) {
      errors.lastName = "Last Name should be minimum 4 characters long!";
    }
    if (!emailRegex.test(values.email)) {
      errors.email = "Not a valid email.";
    }
    if (values.password.length < 8) {
      errors.password = "Password should be minimum 8 characters long!";
    }

    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Passwords do not match!";
    }

    return errors;
  };

  const handleSignupClick = async () => {
    if (!isLoading) {
      setFormErrors(validateForm(formValues));
      const validationPassed = Object.values(formErrors).every(
        (value) => value.length === 0
      );
      if (validationPassed && isFormValidated) {
        console.log("Validation Passed");
        setIsLoading(true);
        try {
          const response = await fetch("http://localhost:3000/user/signup", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fullName: `${formValues.firstName} ${formValues.lastName}`,
              email: formValues.email,
              password: formValues.password,
            }),
          });
          setIsLoading(false);
          const responseData = await response.json();
          console.log("Response from backend:", responseData);

          if (response.status === 200) {
            navigate("/");
          } else {
            toast.error(responseData.error, {
              position: "top-right",
            });
          }
        } catch (error) {
          // Handle errors
          toast.error("Something went wrong!", { position: "top-right" });
        }
      }
    } else {
      toast.warn("Please wait for the previous request to complete!!!", {
        position: "top-right",
      });
    }
  };

  return (
    <div>
      <div className="flex gap-10 ">
        <label className="flex flex-col w-[50%] ">
          First Name
          <input
            value={formValues.firstName}
            name="firstName"
            onChange={handleFormValuesChange}
            type="text"
            className={`${
              formErrors.firstName.length > 0
                ? "border-red-400"
                : "border-gray-400"
            } rounded-md  h-11 border-[1px] outline-[#4B6BFB] font-medium px-2 text-xl`}
          />
          <p className="text-red-500 ">{formErrors.firstName}</p>
        </label>
        <label className="flex flex-col w-[50%]">
          Last Name
          <input
            value={formValues.lastName}
            name="lastName"
            onChange={handleFormValuesChange}
            type="text"
            className={`${
              formErrors.lastName.length > 0
                ? "border-red-400"
                : "border-gray-400"
            } rounded-md  h-11 border-[1px] outline-[#4B6BFB] font-medium px-2 text-xl`}
          />
          <p className="text-red-500 ">{formErrors.lastName}</p>
        </label>
      </div>
      <label className="flex flex-col mt-4 ">
        Email
        <input
          value={formValues.email}
          name="email"
          onChange={handleFormValuesChange}
          type="email"
          className={`${
            formErrors.email.length > 0 ? "border-red-400" : "border-gray-400"
          } rounded-md  h-11 border-[1px] outline-[#4B6BFB] font-medium px-2 text-xl`}
        />
        <p className="text-red-500 ">{formErrors.email}</p>
      </label>
      <label className="flex flex-col mt-4 ">
        Password
        <input
          value={formValues.password}
          name="password"
          onChange={handleFormValuesChange}
          type="text"
          className={`${
            formErrors.password.length > 0
              ? "border-red-400"
              : "border-gray-400"
          } rounded-md  h-11 border-[1px] outline-[#4B6BFB] font-medium px-2 text-xl`}
        />
        <p className="text-red-500 ">{formErrors.password}</p>
      </label>
      <label className="flex flex-col mt-4">
        Confirm Password
        <input
          value={formValues.confirmPassword}
          name="confirmPassword"
          onChange={handleFormValuesChange}
          type="password"
          className={`${
            formErrors.confirmPassword.length > 0
              ? "border-red-400"
              : "border-gray-400"
          } rounded-md  h-11 border-[1px] outline-[#4B6BFB] font-medium px-2 text-xl`}
        />
        <p className="text-red-500 ">{formErrors.confirmPassword}</p>
      </label>
      <div className="flex justify-center mt-8">
        <button
          onClick={handleSignupClick}
          className={`${
            isFormValidated ? "bg-[#4B6BFB]" : "bg-gray-400"
          } py-2 px-20 transition-colors duration-300 ease-in-out rounded-s-md text-2xl font-medium text-white cursor-pointer`}
        >
          {isLoading ? <Spinner height={"40px"} width={"40px"} /> : "Sign up"}
        </button>
      </div>
    </div>
  );
}

export default Signup;
