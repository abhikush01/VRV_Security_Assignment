import { useState } from "react";
import { Typography, Input, Button } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function Signup({ setUser }) {
  const [passwordShown, setPasswordShown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setPasswordShown((cur) => !cur);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    setLoading(false);
  };

  const validateForm = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!emailPattern.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);

      try {
        const response = await axios.post("http://localhost:8080/auth/signup", {
          name: form.name,
          email: form.email,
          password: form.password,
        });

        // Save JWT token to local storage
        localStorage.setItem("jwt", response.data.jwt);

        const userResponse = await axios.get("http://localhost:8080/api", {
          headers: {
            Authorization: `Bearer ${response.data.jwt}`,
          },
        });

        setUser(userResponse?.data);

        // Navigate to the home page
        navigate("/");
      } catch (error) {
        // Handle API errors
        const errorMessage =
          error.response?.data?.message ||
          "Something went wrong. Please try again.";
        setErrors({ api: errorMessage });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <section className="grid text-center items-center ">
        <div>
          <Typography variant="h3" color="blue-gray" className="mb-2">
            Sign Up
          </Typography>
          <Typography className="mb-16 text-gray-600 font-normal text-[18px]">
            Enter your details to create a new account
          </Typography>
          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-[24rem] text-left"
          >
            <div className="mb-6">
              <label htmlFor="name">
                <Typography
                  variant="small"
                  className="mb-2 block font-medium text-gray-900"
                >
                  Your Name
                </Typography>
              </label>
              <Input
                id="name"
                color="gray"
                size="lg"
                type="text"
                name="name"
                placeholder="Your Name"
                className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                value={form.name}
                onChange={handleChange}
                labelProps={{
                  className: "hidden",
                }}
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="email">
                <Typography
                  variant="small"
                  className="mb-2 block font-medium text-gray-900"
                >
                  Your Email
                </Typography>
              </label>
              <Input
                id="email"
                color="gray"
                size="lg"
                type="email"
                name="email"
                placeholder="name@mail.com"
                className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                value={form.email}
                onChange={handleChange}
                required
                labelProps={{
                  className: "hidden",
                }}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-2">{errors.email}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="password">
                <Typography
                  variant="small"
                  className="mb-2 block font-medium text-gray-900"
                >
                  Password
                </Typography>
              </label>
              <Input
                size="lg"
                placeholder="********"
                labelProps={{
                  className: "hidden",
                }}
                className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                type={passwordShown ? "text" : "password"}
                icon={
                  <i onClick={togglePasswordVisibility}>
                    {passwordShown ? (
                      <EyeIcon className="h-5 w-5" />
                    ) : (
                      <EyeSlashIcon className="h-5 w-5" />
                    )}
                  </i>
                }
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-2">{errors.password}</p>
              )}
            </div>

            <Button
              color="gray"
              size="lg"
              className="mt-6"
              fullWidth
              type="submit"
              disabled={loading}
            >
              Sign Up
            </Button>

            <Typography
              variant="small"
              color="gray"
              className="!mt-4 text-center font-normal"
            >
              Already has an account?{" "}
              <a href="/login" className="font-medium text-gray-900">
                Signin
              </a>
            </Typography>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Signup;
