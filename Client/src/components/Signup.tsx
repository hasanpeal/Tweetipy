"use client";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState, useRef, KeyboardEvent } from "react";
import toast, { Toaster } from "react-hot-toast";
import emailjs from "@emailjs/browser";
import "./Login.css";

const handleX = () => {
  window.location.href = "http://localhost:3001/x/oauth/signup?signup=true";
};

const Signup: React.FC = () => {
  const [flag, setFlag] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpError, setOtpError] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [load, setLoad] = useState(false);
  const [username, setUsername] = useState("");
  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  document.title = "Tweetipy | Signup";

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
  
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const message = params.get("message");
    const capturedEmail = params.get("email");
    const screen_name = params.get("screen_name");

    if (code) {
      if (parseInt(code) === 0) {
        setLoad(true);
        toast.success(message, {
          id: "success1",
        });
        setUsername(screen_name || "");
        setEmail(capturedEmail || "");
        navigate("/newuser", {state: {username, email}});
      } else {
        toast.error(message || "Authentication failed", {
          id: "success3",
        });
      }
    }
  }, [email, navigate, username]);


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

  async function emailAlreadyExist() {
    try {
      const result = await axios.get("http://localhost:3001/validateEmail", {
        params: { email: email },
      });
      const code = result.data.code;
      console.log(code);
      if (code === 0) return true;
      else false;
    } catch (err) {
      console.log("Error in emailAlreadyExist function");
    }
  }

  const validateForm = async () => {
    const errors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    };
    let isValid = true;

    if (!firstName) {
      errors.firstName = "First name is required";
      isValid = false;
      setTimeout(() => {
        setFormErrors((prevErrors) => ({ ...prevErrors, firstName: "" }));
      }, 3000);
    }
    if (!lastName) {
      errors.lastName = "Last name is required";
      isValid = false;
      setTimeout(() => {
        setFormErrors((prevErrors) => ({ ...prevErrors, lastName: "" }));
      }, 3000);
    }
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
    } else if (await emailAlreadyExist()) {
      errors.email = "Email already registered";
      isValid = false;
      setTimeout(() => {
        setFormErrors((prevErrors) => ({ ...prevErrors, email: "" }));
      }, 3000);
    }
    if (!password) {
      errors.password = "Password is required";
      isValid = false;
      setTimeout(() => {
        setFormErrors((prevErrors) => ({ ...prevErrors, password: "" }));
      }, 3000);
    } else if (
      password.length < 8 ||
      !/[a-zA-Z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      errors.password =
        "Password must be at least 8 characters long and include a letter and a number";
      isValid = false;
      setTimeout(() => {
        setFormErrors((prevErrors) => ({ ...prevErrors, password: "" }));
      }, 3000);
    }
    setFormErrors(errors);
    return isValid;
  };

  const handleSignup = async () => {
    if (await validateForm()) {
      generateOtp();
      setFlag(false);
    }
  };

  const handleOtpVerify = async () => {
    if (otp.includes("")) {
      setOtpError(true);
    } else {
      setOtpError(false);

      if (generatedOtp === otp.join("")) {
        try {
          setLoad(true);
          const result = await axios.post("http://localhost:3001/register", {
            firstName,
            lastName,
            email,
            password,
          });
          
          if(result){
            navigate("/newuser", {state: {email}});
          }
        } catch (error) {
          console.log("Error registering user froms signup.tsx");
        }
        
      } else {
        setVerified(true);
        setTimeout(() => {
          setVerified(false);
        }, 3000);
      }
      console.log("OTP entered:", otp.join(""));
      console.log("\nFirst name:", firstName);
      console.log("\nLast name:", lastName);
      console.log("\nEmail:", email);
      console.log("\nPassword:", password);
    }
  };

  const generateOtp = async () => {
    try {
      const result = await axios.post("http://localhost:3001/sentOTP", {
        email: email,
      });
      setGeneratedOtp(result.data.otp);
    } catch (error) {
      console.log("Error calling http://localhost:3000/sentOTP on signup.tsx");
    }
    console.log("OTP generated");
  };

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
          <a className="btn btn-ghost text-xl" onClick={() => navigate("/")}>
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

      <div className="mainContainer2 pb-40">
        <div className="card bg-base-100 w-96 shadow-xl cardDiv">
          <article className="prose-2xl headText flex items-center gap-2">
            <span> Tweetipy</span>
            <img
              src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f426_200d_2b1b/512.gif"
              alt="🐦"
              width="20"
              height="20"
            ></img>
            <span></span>
          </article>
          <Toaster />
          <div>
            <label className="input input-bordered flex items-center gap-2">
              <input
                type="text"
                className={`grow ${
                  formErrors.firstName ? "border-red-500" : ""
                }`}
                placeholder="First Name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </label>
            {formErrors.firstName && (
              <p className="alertText text-red-500">{formErrors.firstName}</p>
            )}
          </div>

          <div>
            <label className="input input-bordered flex items-center gap-2">
              <input
                type="text"
                className={`grow ${
                  formErrors.lastName ? "border-red-500" : ""
                }`}
                placeholder="Last Name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
            </label>
            {formErrors.lastName && (
              <p className="alertText text-red-500">{formErrors.lastName}</p>
            )}
          </div>

          <div>
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
            {formErrors.email && (
              <p className="alertText text-red-500">{formErrors.email}</p>
            )}
          </div>

          <div>
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
            {formErrors.password && (
              <p className="alertText text-red-500">{formErrors.password}</p>
            )}
          </div>

          {flag && (
            <button
              className="btn btn-primary btnSubmit "
              onClick={handleSignup}
            >
              Sign up
            </button>
          )}

          {flag && (
            <button
              className="btn btn-outline btn-primary whiteText"
              onClick={handleX}
            >
              Sign up with{" "}
              <img
                src="https://cdn.prod.website-files.com/5d66bdc65e51a0d114d15891/64cebe1d31f50e161e4c825a_X-logo-transparent-white-twitter.png"
                className="xLogo"
              />
            </button>
          )}

          {flag && (
            <p>
              {" "}
              Already have an account?{" "}
              <a
                className="link link-primary forgetLink"
                onClick={() => navigate("/login")}
              >
                Sign in
              </a>
            </p>
          )}

          {/* After sign up is clicked */}
          {!flag && (
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

                {verified && (
                  <p className="alertText text-red-500 customAlert">
                    {" "}
                    Wrong OTP
                  </p>
                )}

                {load && (
                  <span className="loading loading-spinner text-primary Load"></span>
                )}
              </div>

              <div className="verifyBtn">
                <button
                  className="btn btn-active btn-primary"
                  onClick={handleOtpVerify}
                >
                  Verify
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="footer footer-center bg-primary text-primary-content px-10 pt-10">
        <aside>
          <svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
            className="inline-block fill-current mb-5"
          >
            <path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
          </svg>
          <p className="font-bold">
            Tweetipy
            <br />
            Your Personalized Daily Digest
          </p>
          <p>
            <button
              className="btn btn-ghost font-bold"
              onClick={() => navigate("/aboutus")}
            >
              About us
            </button>
            <button
              className="btn btn-ghost font-bold"
              onClick={() => {
                const modal = document.getElementById(
                  "my_modal_4"
                ) as HTMLDialogElement;
                if (modal) {
                  modal.showModal();
                }
              }}
            >
              Contact us
            </button>
          </p>
          <p className="font-bold">
            Copyright © {new Date().getFullYear()} - All right reserved
          </p>
        </aside>
      </footer>
    </div>
  );
};

export default Signup;
