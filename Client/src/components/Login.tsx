"use client";
import { useNavigate } from "react-router-dom";
import { useRef, useState, KeyboardEvent } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import "./Login.css";
import React from "react";
import emailjs from "@emailjs/browser";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forget, setForget] = useState(true);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpError, setOtpError] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [passFlag, setPassFlag] = useState(false);
  const [verified, setVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [load, setLoad] = useState(false);
  const [load2, setLoad2] = useState(false);
  const [username, setUserName] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });
  const [emailErrors, setEmailErrors] = useState({
    email: "",
  });
  const [newPasswordError, setNewPasswordError] = useState({
    confirmPassword: "",
    nPass: "",
    cnPass: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);

  const navigate = useNavigate();

  const form = useRef<HTMLFormElement>(null);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.current) {
      emailjs
        .sendForm(
          import.meta.env.VITE_SERVICE_ID,
          import.meta.env.VITE_TEMPLATE_ID,
          form.current,
          {
            publicKey: import.meta.env.VITE_PUBLIC_KEY,
          }
        )
        .then(
          () => {
            console.log("SUCCESS!");
            toast.success("Email sent successfully");
          },
          (error: { text: unknown }) => {
            console.log("FAILED...", error.text);
            toast.error("Failed to send email");
          }
        );
    }
  };

  const handleX = () => {
    window.location.href = "http://localhost:3001/x/oauth/signin";
  };

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const message = params.get("message");
    const capturedEmail = params.get("email");
    const capturedUsername = params.get("screen_name");
    document.title = "Tweetipy | Login"
    if (code) {
      if (parseInt(code) === 0) {
        setEmail(capturedEmail || "");
        setUserName(capturedUsername || "");
        setLoad(true);
        toast.success(message, {
          id: "success1",
        });
        const fetchData = async () => {
          const res = await axios.get("http://localhost:3001/isNewUser", {
            params: { email: email },
          });
          console.log(res.data.bool);
          if (res.data.bool) navigate("/newuser", { state: { email, username } });
          else navigate("/dashboard", { state: { email, username } });
        };
        fetchData();
      } else {
        toast.error(message || "Authentication failed", {
          id: "success3",
        });
      }
    }
  }, [email, navigate, username]);

  async function emailDoesntExist() {
    try {
      const result = await axios.get("http://localhost:3001/validateEmail", {
        params: { email: email },
      });
      const code = result.data.code;
      console.log("Email exist code: ", code);
      if (code === 0) return false;
      else true;
    } catch (err) {
      console.log("Error in emailAlreadyExist function");
    }
  }

  const handleLogin = async () => {
    if (await validateForm()) {
      try {
        const result = await axios.post("http://localhost:3001/login", {
          email,
          password,
        });
        const { code, message } = result.data;
        console.log(code);
        console.log(message);
        if (code === 0) {
          toast.success(message);
          setLoad(true);
          const res = await axios.get("http://localhost:3001/isNewUser", {
            params: { email: email },
          });
          if (res.data.bool) navigate("/newuser", { state: { email } });
          else navigate("/dashboard", { state: { email } });
        } else {
          toast.error(message);
        }
      } catch (err) {
        console.error("Error in handleLogin function in Login.tsx");
      }
    } else {
      setTimeout(() => {
        setFormErrors({
          email: "",
          password: "",
        });
      }, 3000);
    }
  };

  const generateOtp = async () => {
    try {
      const result = await axios.post("http://localhost:3001/sentOTP", {
        email: email,
      });
      setGeneratedOtp(result.data.otp);
    } catch (error) {
      console.log("Error calling http://localhost:3000/sentOTP on login.tsx");
    }
    console.log("OTP generated");
  };

  const handleOtpChange = (index: number, value: string) => {
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  const validateForm = async () => {
    const errors = {
      email: "",
      password: "",
    };
    let isValid = true;

    if (!email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Not a valid email";
      isValid = false;
    } else if (await emailDoesntExist()) {
      errors.email = "Email isn't registered";
      isValid = false;
      setTimeout(() => {
        setFormErrors((prevErrors) => ({ ...prevErrors, email: "" }));
      }, 3000);
    }
    if (!password) {
      errors.password = "Password is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  async function validateEmail() {
    const errors = {
      email: "",
    };
    let isValid = true;
    if (!email) {
      errors.email = "Email is required";
      isValid = false;
      setTimeout(() => {
        setFormErrors((prevErrors) => ({ ...prevErrors, email: "" }));
      }, 3000);
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Not a valid email";
      isValid = false;
      setTimeout(() => {
        setFormErrors((prevErrors) => ({ ...prevErrors, email: "" }));
      }, 3000);
    } else if (await emailDoesntExist()) {
      errors.email = "Email isn't registered";
      isValid = false;
      setTimeout(() => {
        setFormErrors((prevErrors) => ({ ...prevErrors, email: "" }));
      }, 3000);
    }
    setEmailErrors(errors);
    return isValid;
  }

  function validateNewPassword() {
    const errors = {
      confirmPassword: "",
      nPass: "",
      cnPass: "",
    };
    let isValid = true;

    if (!newPassword) {
      errors.nPass = "Password is required";
      isValid = false;
      setTimeout(() => {
        setFormErrors((prevErrors) => ({ ...prevErrors, nPass: "" }));
      }, 5000);
    } else if (
      newPassword.length < 8 ||
      !/[a-zA-Z]/.test(newPassword) ||
      !/[0-9]/.test(newPassword)
    ) {
      errors.nPass =
        "Password must be at least 8 characters long and include a letter and a number";
      isValid = false;
      setTimeout(() => {
        setFormErrors((prevErrors) => ({ ...prevErrors, nPass: "" }));
      }, 5000);
    }

    if (!confirmNewPassword) {
      errors.cnPass = "Password is required";
      isValid = false;
      setTimeout(() => {
        setFormErrors((prevErrors) => ({ ...prevErrors, cnPass: "" }));
      }, 5000);
    } else if (
      confirmNewPassword.length < 8 ||
      !/[a-zA-Z]/.test(confirmNewPassword) ||
      !/[0-9]/.test(confirmNewPassword)
    ) {
      errors.cnPass =
        "Password must be at least 8 characters long and include a letter and a number";
      isValid = false;
      setTimeout(() => {
        setFormErrors((prevErrors) => ({ ...prevErrors, cnPass: "" }));
      }, 5000);
    }

    if (newPassword !== confirmNewPassword) {
      errors.confirmPassword = "Password doesn't match";
      isValid = false;
      setTimeout(() => {
        setFormErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "" }));
      }, 5000);
    }
    setNewPasswordError(errors);
    return isValid;
  }

  const handleOtpKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleOtpVerify = async () => {
    if (otp.includes("")) {
      setOtpError(true);
    } else {
      setOtpError(false);

      if (generatedOtp === otp.join("")) {
        setPassFlag(true);
        setForget(true);
      } else {
        setVerified(true);
        setTimeout(() => {
          setVerified(false);
        }, 3000);
      }
      console.log("OTP entered:", otp.join(""));
    }
  };

  const handleForgetPass = () => {
    setForget(false);
  };

  async function handleSend() {
    console.log("Handle send function triggered");
    console.log(formErrors);
    if (await validateEmail()) {
      generateOtp();
      setShowOtp(true);
    } else {
      setTimeout(() => {
        setEmailErrors({
          email: "",
        });
      }, 3000);
    }
  }

  async function resetPassword() {
    if (validateNewPassword()) {
      try {
        const result = await axios.post("http://localhost:3001/resetPassword", {
          email: email,
          newPassword: confirmNewPassword,
        });
        if (result.data.code === 0) {
          console.log("Success resetting password");
          toast.success("Password reset successful");
          setLoad2(true);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } catch (err) {
        console.log("Error resetting password in Login.tsx");
      }
    } else {
      setTimeout(() => {
        setNewPasswordError({
          confirmPassword: "",
          nPass: "",
          cnPass: "",
        });
      }, 3000);
    }
  }

  return (
    <div className="bg-base-300">
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a
                  onClick={() => {
                    const modal = document.getElementById(
                      "my_modal_3"
                    ) as HTMLDialogElement;
                    if (modal) {
                      modal.showModal();
                    }
                  }}
                >
                  Contact us
                </a>
              </li>
              <li>
                <a onClick={() => navigate("/aboutus")}>About us</a>
              </li>
              {/* <li>
                <a>Item 3</a>
              </li> */}
            </ul>
          </div>
          <a
            className="btn btn-ghost text-xl"
            onClick={() => navigate("/")}
          >
            Tweetipy
          </a>
        </div>
        <div className="navbar-end hidden lg:flex menu1">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a
                onClick={() => {
                  const modal = document.getElementById(
                    "my_modal_3"
                  ) as HTMLDialogElement;
                  if (modal) {
                    modal.showModal();
                  }
                }}
              >
                Contact us
              </a>
            </li>
            <li>
              <a onClick={() => navigate("/aboutus")}>About us</a>
            </li>
          </ul>
        </div>
      </div>

      <Toaster />

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <form className="contactForm" ref={form} onSubmit={sendEmail}>
            <label className="lab">&nbsp;Name</label>
            <input
              type="text"
              name="user_name"
              className="input-bordered input-md w-full max-w-md formInput"
            />
            <label className="lab">&nbsp;Email</label>
            <input
              type="email"
              name="user_email"
              className="input-bordered input-md w-full max-w-md formInput"
            />
            <label className="lab">&nbsp;Message</label>
            <textarea
              name="message"
              className="textarea bg-base-200 textarea-bordered textarea-lg w-full max-w-md formInput"
              rows={5}
            />
            <button
              className="btn btn-active btn-primary my-4"
              type="submit"
              value="Send"
            >
              {" "}
              Submit{" "}
            </button>
          </form>
        </div>
      </dialog>

      <div className="mainContainer pb-40">
        <div className="card bg-base-100 w-96 shadow-xl cardDiv">
          <article className="prose-2xl headText flex items-center gap-2">
            <span> Tweetipy</span>
            <img
              src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f426_200d_2b1b/512.gif"
              alt="🐦"
              width="20"
              height="20"
            ></img>
            <span> </span>
          </article>
          <Toaster />
          <div>
            {forget && !passFlag && (
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <input
                  type="email"
                  className={`grow ${formErrors.email ? "border-red-500" : ""}`}
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>
            )}
            {formErrors.email && !passFlag && forget && !showOtp && (
              <p className="alertText text-red-500">{formErrors.email}</p>
            )}
          </div>

          <div>
            {forget && !passFlag && (
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`grow ${
                    formErrors.password ? "border-red-500" : ""
                  }`}
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  className="btn btn-ghost showBtn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJjb2xvcjojODA1MkY2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGNsYXNzPSJoLWZ1bGwgdy1mdWxsIj48cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgcng9IjMwIiBmaWxsPSJ0cmFuc3BhcmVudCIgc3Ryb2tlPSJ0cmFuc3BhcmVudCIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2Utb3BhY2l0eT0iMTAwJSIgcGFpbnQtb3JkZXI9InN0cm9rZSI+PC9yZWN0Pjxzdmcgd2lkdGg9IjI1NnB4IiBoZWlnaHQ9IjI1NnB4IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiBmaWxsPSIjODA1MkY2IiB4PSIxMjgiIHk9IjEyOCIgcm9sZT0iaW1nIiBzdHlsZT0iZGlzcGxheTppbmxpbmUtYmxvY2s7dmVydGljYWwtYWxpZ246bWlkZGxlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9IiM4MDUyRjYiPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1vcGFjaXR5PSIuMTUiIGQ9Ik04MS44IDUzNy44YTYwLjMgNjAuMyAwIDAgMSAwLTUxLjVDMTc2LjYgMjg2LjUgMzE5LjggMTg2IDUxMiAxODZjLTE5Mi4yIDAtMzM1LjQgMTAwLjUtNDMwLjIgMzAwLjNhNjAuMyA2MC4zIDAgMCAwIDAgNTEuNUMxNzYuNiA3MzcuNSAzMTkuOSA4MzggNTEyIDgzOGMtMTkyLjEgMC0zMzUuNC0xMDAuNS00MzAuMi0zMDAuMnoiPjwvcGF0aD48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGZpbGwtb3BhY2l0eT0iLjE1IiBkPSJNNTEyIDI1OGMtMTYxLjMgMC0yNzkuNCA4MS44LTM2Mi43IDI1NEMyMzIuNiA2ODQuMiAzNTAuNyA3NjYgNTEyIDc2NmMxNjEuNCAwIDI3OS41LTgxLjggMzYyLjctMjU0Qzc5MS40IDMzOS44IDY3My4zIDI1OCA1MTIgMjU4em0tNCA0MzBjLTk3LjIgMC0xNzYtNzguOC0xNzYtMTc2czc4LjgtMTc2IDE3Ni0xNzZzMTc2IDc4LjggMTc2IDE3NnMtNzguOCAxNzYtMTc2IDE3NnoiPjwvcGF0aD48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik05NDIuMiA0ODYuMkM4NDcuNCAyODYuNSA3MDQuMSAxODYgNTEyIDE4NmMtMTkyLjIgMC0zMzUuNCAxMDAuNS00MzAuMiAzMDAuM2E2MC4zIDYwLjMgMCAwIDAgMCA1MS41QzE3Ni42IDczNy41IDMxOS45IDgzOCA1MTIgODM4YzE5Mi4yIDAgMzM1LjQtMTAwLjUgNDMwLjItMzAwLjNjNy43LTE2LjIgNy43LTM1IDAtNTEuNXpNNTEyIDc2NmMtMTYxLjMgMC0yNzkuNC04MS44LTM2Mi43LTI1NEMyMzIuNiAzMzkuOCAzNTAuNyAyNTggNTEyIDI1OHMyNzkuNCA4MS44IDM2Mi43IDI1NEM3OTEuNSA2ODQuMiA2NzMuNCA3NjYgNTEyIDc2NnoiPjwvcGF0aD48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik01MDggMzM2Yy05Ny4yIDAtMTc2IDc4LjgtMTc2IDE3NnM3OC44IDE3NiAxNzYgMTc2czE3Ni03OC44IDE3Ni0xNzZzLTc4LjgtMTc2LTE3Ni0xNzZ6bTAgMjg4Yy02MS45IDAtMTEyLTUwLjEtMTEyLTExMnM1MC4xLTExMiAxMTItMTEyczExMiA1MC4xIDExMiAxMTJzLTUwLjEgMTEyLTExMiAxMTJ6Ij48L3BhdGg+PC9nPjwvc3ZnPjwvc3ZnPg=="
                    alt="eye-twotone"
                    className="showIcon"
                  ></img>
                </button>
              </label>
            )}
            {formErrors.password && !passFlag && (
              <p className="alertText text-red-500">{formErrors.password}</p>
            )}
          </div>

          {forget && !passFlag && (
            <a
              className="link link-primary forgetLink"
              onClick={handleForgetPass}
            >
              Forget Password
            </a>
          )}

          {forget && !passFlag && (
            <button className="btn btn-primary btnSubmit" onClick={handleLogin}>
              Login
            </button>
          )}
          {forget && !passFlag && (
            <button
              className="btn btn-outline btn-primary whiteText"
              onClick={handleX}
            >
              Login with{" "}
              <img
                src="https://cdn.prod.website-files.com/5d66bdc65e51a0d114d15891/64cebe1d31f50e161e4c825a_X-logo-transparent-white-twitter.png"
                className="xLogo"
              />
            </button>
          )}

          {!forget && (
            <label className="input input-bordered flex items-center gap-2 resetEmail">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <input
                type="email"
                className={`grow ${formErrors.email ? "border-red-500" : ""}`}
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <button
                className="btn btn-active btn-primary otpBtn"
                onClick={handleSend}
              >
                Send
              </button>
            </label>
          )}
          {emailErrors.email && !forget && (
            <p className="custoText text-red-500">{emailErrors.email}</p>
          )}

          {!forget && showOtp && (
            <div id="otpSection">
              <p>Please enter the 6-digit OTP sent to your email</p>
              <div className="otpBox">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    value={digit}
                    className={`otpInput w-12 h-12 ${
                      otpError && !digit ? "border-red-500" : ""
                    }`}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    ref={(el) => (otpRefs.current[index] = el)}
                  />
                ))}
              </div>

              {verified && (
                <p className="alertText text-red-500 customAlertLogin">
                  {" "}
                  Wrong OTP
                </p>
              )}

              {!forget && (
                <div className="verifyBtn">
                  <button
                    className="btn btn-active btn-primary"
                    onClick={handleOtpVerify}
                  >
                    Verify
                  </button>
                </div>
              )}
            </div>
          )}

          {passFlag && (
            <div className="resetDiv">
              <label className="input input-bordered flex items-center gap-2 resetBox">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type={showPassword2 ? "text" : "password"}
                  className={`grow ${
                    formErrors.password ? "border-red-500" : ""
                  }`}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                />
                <button
                  className="btn btn-ghost showBtn"
                  onClick={() => setShowPassword2(!showPassword2)}
                >
                  <img
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJjb2xvcjojODA1MkY2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGNsYXNzPSJoLWZ1bGwgdy1mdWxsIj48cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgcng9IjMwIiBmaWxsPSJ0cmFuc3BhcmVudCIgc3Ryb2tlPSJ0cmFuc3BhcmVudCIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2Utb3BhY2l0eT0iMTAwJSIgcGFpbnQtb3JkZXI9InN0cm9rZSI+PC9yZWN0Pjxzdmcgd2lkdGg9IjI1NnB4IiBoZWlnaHQ9IjI1NnB4IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiBmaWxsPSIjODA1MkY2IiB4PSIxMjgiIHk9IjEyOCIgcm9sZT0iaW1nIiBzdHlsZT0iZGlzcGxheTppbmxpbmUtYmxvY2s7dmVydGljYWwtYWxpZ246bWlkZGxlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9IiM4MDUyRjYiPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1vcGFjaXR5PSIuMTUiIGQ9Ik04MS44IDUzNy44YTYwLjMgNjAuMyAwIDAgMSAwLTUxLjVDMTc2LjYgMjg2LjUgMzE5LjggMTg2IDUxMiAxODZjLTE5Mi4yIDAtMzM1LjQgMTAwLjUtNDMwLjIgMzAwLjNhNjAuMyA2MC4zIDAgMCAwIDAgNTEuNUMxNzYuNiA3MzcuNSAzMTkuOSA4MzggNTEyIDgzOGMtMTkyLjEgMC0zMzUuNC0xMDAuNS00MzAuMi0zMDAuMnoiPjwvcGF0aD48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGZpbGwtb3BhY2l0eT0iLjE1IiBkPSJNNTEyIDI1OGMtMTYxLjMgMC0yNzkuNCA4MS44LTM2Mi43IDI1NEMyMzIuNiA2ODQuMiAzNTAuNyA3NjYgNTEyIDc2NmMxNjEuNCAwIDI3OS41LTgxLjggMzYyLjctMjU0Qzc5MS40IDMzOS44IDY3My4zIDI1OCA1MTIgMjU4em0tNCA0MzBjLTk3LjIgMC0xNzYtNzguOC0xNzYtMTc2czc4LjgtMTc2IDE3Ni0xNzZzMTc2IDc4LjggMTc2IDE3NnMtNzguOCAxNzYtMTc2IDE3NnoiPjwvcGF0aD48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik05NDIuMiA0ODYuMkM4NDcuNCAyODYuNSA3MDQuMSAxODYgNTEyIDE4NmMtMTkyLjIgMC0zMzUuNCAxMDAuNS00MzAuMiAzMDAuM2E2MC4zIDYwLjMgMCAwIDAgMCA1MS41QzE3Ni42IDczNy41IDMxOS45IDgzOCA1MTIgODM4YzE5Mi4yIDAgMzM1LjQtMTAwLjUgNDMwLjItMzAwLjNjNy43LTE2LjIgNy43LTM1IDAtNTEuNXpNNTEyIDc2NmMtMTYxLjMgMC0yNzkuNC04MS44LTM2Mi43LTI1NEMyMzIuNiAzMzkuOCAzNTAuNyAyNTggNTEyIDI1OHMyNzkuNCA4MS44IDM2Mi43IDI1NEM3OTEuNSA2ODQuMiA2NzMuNCA3NjYgNTEyIDc2NnoiPjwvcGF0aD48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik01MDggMzM2Yy05Ny4yIDAtMTc2IDc4LjgtMTc2IDE3NnM3OC44IDE3NiAxNzYgMTc2czE3Ni03OC44IDE3Ni0xNzZzLTc4LjgtMTc2LTE3Ni0xNzZ6bTAgMjg4Yy02MS45IDAtMTEyLTUwLjEtMTEyLTExMnM1MC4xLTExMiAxMTItMTEyczExMiA1MC4xIDExMiAxMTJzLTUwLjEgMTEyLTExMiAxMTJ6Ij48L3BhdGg+PC9nPjwvc3ZnPjwvc3ZnPg=="
                    alt="eye-twotone"
                    className="showIcon"
                  ></img>
                </button>
              </label>

              {newPasswordError.nPass && (
                <p className="newPassText text-red-500">
                  {newPasswordError.nPass}
                </p>
              )}

              <label className="input input-bordered flex items-center gap-2 resetBox">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type={showPassword3 ? "text" : "password"}
                  className={`grow ${
                    formErrors.password ? "border-red-500" : ""
                  }`}
                  placeholder="Confirm New Password"
                  value={confirmNewPassword}
                  onChange={(event) =>
                    setConfirmNewPassword(event.target.value)
                  }
                />
                <button
                  className="btn btn-ghost showBtn"
                  onClick={() => setShowPassword3(!showPassword3)}
                >
                  <img
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJjb2xvcjojODA1MkY2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGNsYXNzPSJoLWZ1bGwgdy1mdWxsIj48cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgcng9IjMwIiBmaWxsPSJ0cmFuc3BhcmVudCIgc3Ryb2tlPSJ0cmFuc3BhcmVudCIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2Utb3BhY2l0eT0iMTAwJSIgcGFpbnQtb3JkZXI9InN0cm9rZSI+PC9yZWN0Pjxzdmcgd2lkdGg9IjI1NnB4IiBoZWlnaHQ9IjI1NnB4IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiBmaWxsPSIjODA1MkY2IiB4PSIxMjgiIHk9IjEyOCIgcm9sZT0iaW1nIiBzdHlsZT0iZGlzcGxheTppbmxpbmUtYmxvY2s7dmVydGljYWwtYWxpZ246bWlkZGxlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9IiM4MDUyRjYiPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1vcGFjaXR5PSIuMTUiIGQ9Ik04MS44IDUzNy44YTYwLjMgNjAuMyAwIDAgMSAwLTUxLjVDMTc2LjYgMjg2LjUgMzE5LjggMTg2IDUxMiAxODZjLTE5Mi4yIDAtMzM1LjQgMTAwLjUtNDMwLjIgMzAwLjNhNjAuMyA2MC4zIDAgMCAwIDAgNTEuNUMxNzYuNiA3MzcuNSAzMTkuOSA4MzggNTEyIDgzOGMtMTkyLjEgMC0zMzUuNC0xMDAuNS00MzAuMi0zMDAuMnoiPjwvcGF0aD48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGZpbGwtb3BhY2l0eT0iLjE1IiBkPSJNNTEyIDI1OGMtMTYxLjMgMC0yNzkuNCA4MS44LTM2Mi43IDI1NEMyMzIuNiA2ODQuMiAzNTAuNyA3NjYgNTEyIDc2NmMxNjEuNCAwIDI3OS41LTgxLjggMzYyLjctMjU0Qzc5MS40IDMzOS44IDY3My4zIDI1OCA1MTIgMjU4em0tNCA0MzBjLTk3LjIgMC0xNzYtNzguOC0xNzYtMTc2czc4LjgtMTc2IDE3Ni0xNzZzMTc2IDc4LjggMTc2IDE3NnMtNzguOCAxNzYtMTc2IDE3NnoiPjwvcGF0aD48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik05NDIuMiA0ODYuMkM4NDcuNCAyODYuNSA3MDQuMSAxODYgNTEyIDE4NmMtMTkyLjIgMC0zMzUuNCAxMDAuNS00MzAuMiAzMDAuM2E2MC4zIDYwLjMgMCAwIDAgMCA1MS41QzE3Ni42IDczNy41IDMxOS45IDgzOCA1MTIgODM4YzE5Mi4yIDAgMzM1LjQtMTAwLjUgNDMwLjItMzAwLjNjNy43LTE2LjIgNy43LTM1IDAtNTEuNXpNNTEyIDc2NmMtMTYxLjMgMC0yNzkuNC04MS44LTM2Mi43LTI1NEMyMzIuNiAzMzkuOCAzNTAuNyAyNTggNTEyIDI1OHMyNzkuNCA4MS44IDM2Mi43IDI1NEM3OTEuNSA2ODQuMiA2NzMuNCA3NjYgNTEyIDc2NnoiPjwvcGF0aD48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik01MDggMzM2Yy05Ny4yIDAtMTc2IDc4LjgtMTc2IDE3NnM3OC44IDE3NiAxNzYgMTc2czE3Ni03OC44IDE3Ni0xNzZzLTc4LjgtMTc2LTE3Ni0xNzZ6bTAgMjg4Yy02MS45IDAtMTEyLTUwLjEtMTEyLTExMnM1MC4xLTExMiAxMTItMTEyczExMiA1MC4xIDExMiAxMTJzLTUwLjEgMTEyLTExMiAxMTJ6Ij48L3BhdGg+PC9nPjwvc3ZnPjwvc3ZnPg=="
                    alt="eye-twotone"
                    className="showIcon"
                  ></img>
                </button>
              </label>

              {newPasswordError.cnPass && (
                <p className="newPassText text-red-500">
                  {newPasswordError.cnPass}
                </p>
              )}

              {newPasswordError.confirmPassword && (
                <p className="newPassText text-red-500">
                  {newPasswordError.confirmPassword}
                </p>
              )}

              <button
                className="btn btn-outline btn-primary resetBtn"
                onClick={resetPassword}
              >
                Set Password
              </button>
            </div>
          )}

          <p>
            {" "}
            Don't have an account?{" "}
            <a
              className="link link-primary forgetLink"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </a>
          </p>
          {load && (
            <span className="loading loading-spinner text-primary Load1"></span>
          )}

          {load2 && (
            <span className="loading loading-spinner text-primary Load1"></span>
          )}
        </div>
      </div>
      <footer className="footer footer-center bg-primary text-primary-content p-10">
        <aside>
          <svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
            className="inline-block fill-current"
          >
            <path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
          </svg>
          <p className="font-bold">
            Tweetipy
            <br />
            Your Personalized Daily Digest
          </p>
          <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
        </aside>
        <nav>
          <div className="grid grid-flow-col gap-4">
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
          </div>
        </nav>
      </footer>
    </div>
  );
}

export default Login;
