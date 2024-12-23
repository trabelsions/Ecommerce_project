import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./css/LoginSignup.css";

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const validationSchema = Yup.object().shape({
    username: Yup.string().when([], {
      is: () => state === "Sign Up", // Check if in "Sign Up" mode
      then: () =>
        Yup.string()
          .required("Name is required")
          .min(3, "Name must be at least 3 characters"),
      otherwise: () => Yup.string(), // Valid schema for "Login" mode
    }),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    agree: Yup.boolean().when([], {
      is: () => state === "Sign Up", // Only validate "agree" for "Sign Up"
      then: () =>
        Yup.boolean()
          .oneOf([true], "You must agree to the terms and privacy policy")
          .required(),
      otherwise: () => Yup.boolean(), // No validation for "Login" mode
    }),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      agree: false,
    },
    validationSchema, // Use the schema dynamically based on the state
    onSubmit: async (values) => {
      console.log("Form Submitted:", values);

      if (state === "Login") {
        let responseData;
        await fetch("http://localhost:4000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })
          .then((response) => response.json())
          .then((data) => (responseData = data));

        if (responseData.success) {
          localStorage.setItem("auth-token", responseData.token);
          window.location.replace("/");
        } else {
          alert(responseData.errors);
        }
      } else {
        let responseData;
        await fetch("http://localhost:4000/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })
          .then((response) => response.json())
          .then((data) => (responseData = data));

        if (responseData.success) {
          localStorage.setItem("auth-token", responseData.token);
          window.location.replace("/");
        } else {
          alert(responseData.errors);
        }
      }
    },
  });
  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="loginsignup-fields">
            {state === "Sign Up" && (
              <>
                <input
                  type="text"
                  name="username"
                  placeholder="Your Name"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.username && formik.errors.username ? (
                  <div className="error">{formik.errors.username}</div>
                ) : null}
              </>
            )}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="error">{formik.errors.email}</div>
            ) : null}

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="error">{formik.errors.password}</div>
            ) : null}
          </div>

          {state === "Sign Up" && (
            <div className="loginsignup-agree">
              <input
                type="checkbox"
                name="agree"
                checked={formik.values.agree}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <p>
                By continuing, I agree to the terms of use & privacy policy.
              </p>
              {formik.touched.agree && formik.errors.agree ? (
                <div className="error">{formik.errors.agree}</div>
              ) : null}
            </div>
          )}

          <button type="submit">
            {state === "Login" ? "Login" : "Sign Up"}
          </button>
          {state === "Sign Up" ? (
            <p>
              Already have an account?{" "}
              <span onClick={() => setState("Login")}>Login here</span>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <span onClick={() => setState("Sign Up")}>Sign up here</span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginSignup;
