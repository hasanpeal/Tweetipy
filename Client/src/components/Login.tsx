"use client";
import { useNavigate } from "react-router-dom";
import { useRef, useState, KeyboardEvent } from "react";
import toast, {Toaster} from "react-hot-toast";
import axios from "axios";
import "./Login.css";

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
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nPass: "",
    cnPass: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (validateForm()) {
      const result = axios.post("/login", { email, password });
      console.log(result);
    } else {
      setTimeout(() => {
        setFormErrors({
          email: "",
          password: "",
          confirmPassword: "",
          nPass: "",
          cnPass: "",
        });
      }, 5000);
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

  const validateForm = () => {
    const errors = {
      email: "",
      password: "",
      confirmPassword: "",
      nPass: "",
      cnPass: "",
    };
    let isValid = true;

    if (!email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Not a valid email";
      isValid = false;
    }
    if (!password) {
      errors.password = "Password is required";
      isValid = false;
    }

    if (!newPassword) {
      errors.nPass = "Password is required";
      isValid = false;
      setTimeout(() => {
        setFormErrors((prevErrors) => ({ ...prevErrors, nPass: "" }));
      }, 3000);
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
      }, 3000);
    }

    if (!confirmNewPassword) {
      errors.cnPass = "Password is required";
      isValid = false;
      setTimeout(() => {
        setFormErrors((prevErrors) => ({ ...prevErrors, cnPass: "" }));
      }, 3000);
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
      }, 3000);
    }

    if (newPassword === confirmNewPassword) {
      errors.confirmPassword = "Password doesn't match";
      isValid = false;
      setTimeout(() => {
        setFormErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "" }));
      }, 3000);
    }
    setFormErrors(errors);
    return isValid;
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

  function handleSend() {
    // Generates OTP
    generateOtp();
    setShowOtp(true);
  }

  async function resetPassword(){
    try {
      const result = await axios.post("http://localhost:3001/resetPassword", {email: email, newPassword: confirmNewPassword});
      if(result.data.code === 0) {
        console.log("Success resetting password")
        toast.success("Password reset successful");
        setTimeout(() => {
          window.location.reload();
        }, 1000)
      }
    } catch (err) {
      console.log("Error resetting password in Login.tsx");
    }
  }

  return (
    <div className="mainContainer">
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
        <Toaster/>
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
          {formErrors.email && !passFlag && (
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
                {/* {showPassword ? "Hide" : "Show"} */}
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
          <button className="btn btn-outline btn-primary whiteText">
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
              {/* {showPassword ? "Hide" : "Show"} */}
              Send
            </button>
          </label>
        )}
        {formErrors.email && (
          <p className="alertText text-red-500">{formErrors.email}</p>
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
                {/* {showPassword ? "Hide" : "Show"} */}
                <img
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJjb2xvcjojODA1MkY2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGNsYXNzPSJoLWZ1bGwgdy1mdWxsIj48cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgcng9IjMwIiBmaWxsPSJ0cmFuc3BhcmVudCIgc3Ryb2tlPSJ0cmFuc3BhcmVudCIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2Utb3BhY2l0eT0iMTAwJSIgcGFpbnQtb3JkZXI9InN0cm9rZSI+PC9yZWN0Pjxzdmcgd2lkdGg9IjI1NnB4IiBoZWlnaHQ9IjI1NnB4IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiBmaWxsPSIjODA1MkY2IiB4PSIxMjgiIHk9IjEyOCIgcm9sZT0iaW1nIiBzdHlsZT0iZGlzcGxheTppbmxpbmUtYmxvY2s7dmVydGljYWwtYWxpZ246bWlkZGxlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9IiM4MDUyRjYiPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1vcGFjaXR5PSIuMTUiIGQ9Ik04MS44IDUzNy44YTYwLjMgNjAuMyAwIDAgMSAwLTUxLjVDMTc2LjYgMjg2LjUgMzE5LjggMTg2IDUxMiAxODZjLTE5Mi4yIDAtMzM1LjQgMTAwLjUtNDMwLjIgMzAwLjNhNjAuMyA2MC4zIDAgMCAwIDAgNTEuNUMxNzYuNiA3MzcuNSAzMTkuOSA4MzggNTEyIDgzOGMtMTkyLjEgMC0zMzUuNC0xMDAuNS00MzAuMi0zMDAuMnoiPjwvcGF0aD48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGZpbGwtb3BhY2l0eT0iLjE1IiBkPSJNNTEyIDI1OGMtMTYxLjMgMC0yNzkuNCA4MS44LTM2Mi43IDI1NEMyMzIuNiA2ODQuMiAzNTAuNyA3NjYgNTEyIDc2NmMxNjEuNCAwIDI3OS41LTgxLjggMzYyLjctMjU0Qzc5MS40IDMzOS44IDY3My4zIDI1OCA1MTIgMjU4em0tNCA0MzBjLTk3LjIgMC0xNzYtNzguOC0xNzYtMTc2czc4LjgtMTc2IDE3Ni0xNzZzMTc2IDc4LjggMTc2IDE3NnMtNzguOCAxNzYtMTc2IDE3NnoiPjwvcGF0aD48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik05NDIuMiA0ODYuMkM4NDcuNCAyODYuNSA3MDQuMSAxODYgNTEyIDE4NmMtMTkyLjIgMC0zMzUuNCAxMDAuNS00MzAuMiAzMDAuM2E2MC4zIDYwLjMgMCAwIDAgMCA1MS41QzE3Ni42IDczNy41IDMxOS45IDgzOCA1MTIgODM4YzE5Mi4yIDAgMzM1LjQtMTAwLjUgNDMwLjItMzAwLjNjNy43LTE2LjIgNy43LTM1IDAtNTEuNXpNNTEyIDc2NmMtMTYxLjMgMC0yNzkuNC04MS44LTM2Mi43LTI1NEMyMzIuNiAzMzkuOCAzNTAuNyAyNTggNTEyIDI1OHMyNzkuNCA4MS44IDM2Mi43IDI1NEM3OTEuNSA2ODQuMiA2NzMuNCA3NjYgNTEyIDc2NnoiPjwvcGF0aD48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik01MDggMzM2Yy05Ny4yIDAtMTc2IDc4LjgtMTc2IDE3NnM3OC44IDE3NiAxNzYgMTc2czE3Ni03OC44IDE3Ni0xNzZzLTc4LjgtMTc2LTE3Ni0xNzZ6bTAgMjg4Yy02MS45IDAtMTEyLTUwLjEtMTEyLTExMnM1MC4xLTExMiAxMTItMTEyczExMiA1MC4xIDExMiAxMTJzLTUwLjEgMTEyLTExMiAxMTJ6Ij48L3BhdGg+PC9nPjwvc3ZnPjwvc3ZnPg=="
                  alt="eye-twotone"
                  className="showIcon"
                ></img>
              </button>
            </label>

            {formErrors.nPass && (
              <p className="alertText text-red-500">{formErrors.nPass}</p>
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
                onChange={(event) => setConfirmNewPassword(event.target.value)}
              />
              <button
                className="btn btn-ghost showBtn"
                onClick={() => setShowPassword3(!showPassword3)}
              >
                {/* {showPassword ? "Hide" : "Show"} */}
                <img
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJjb2xvcjojODA1MkY2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGNsYXNzPSJoLWZ1bGwgdy1mdWxsIj48cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgcng9IjMwIiBmaWxsPSJ0cmFuc3BhcmVudCIgc3Ryb2tlPSJ0cmFuc3BhcmVudCIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2Utb3BhY2l0eT0iMTAwJSIgcGFpbnQtb3JkZXI9InN0cm9rZSI+PC9yZWN0Pjxzdmcgd2lkdGg9IjI1NnB4IiBoZWlnaHQ9IjI1NnB4IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiBmaWxsPSIjODA1MkY2IiB4PSIxMjgiIHk9IjEyOCIgcm9sZT0iaW1nIiBzdHlsZT0iZGlzcGxheTppbmxpbmUtYmxvY2s7dmVydGljYWwtYWxpZ246bWlkZGxlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9IiM4MDUyRjYiPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1vcGFjaXR5PSIuMTUiIGQ9Ik04MS44IDUzNy44YTYwLjMgNjAuMyAwIDAgMSAwLTUxLjVDMTc2LjYgMjg2LjUgMzE5LjggMTg2IDUxMiAxODZjLTE5Mi4yIDAtMzM1LjQgMTAwLjUtNDMwLjIgMzAwLjNhNjAuMyA2MC4zIDAgMCAwIDAgNTEuNUMxNzYuNiA3MzcuNSAzMTkuOSA4MzggNTEyIDgzOGMtMTkyLjEgMC0zMzUuNC0xMDAuNS00MzAuMi0zMDAuMnoiPjwvcGF0aD48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGZpbGwtb3BhY2l0eT0iLjE1IiBkPSJNNTEyIDI1OGMtMTYxLjMgMC0yNzkuNCA4MS44LTM2Mi43IDI1NEMyMzIuNiA2ODQuMiAzNTAuNyA3NjYgNTEyIDc2NmMxNjEuNCAwIDI3OS41LTgxLjggMzYyLjctMjU0Qzc5MS40IDMzOS44IDY3My4zIDI1OCA1MTIgMjU4em0tNCA0MzBjLTk3LjIgMC0xNzYtNzguOC0xNzYtMTc2czc4LjgtMTc2IDE3Ni0xNzZzMTc2IDc4LjggMTc2IDE3NnMtNzguOCAxNzYtMTc2IDE3NnoiPjwvcGF0aD48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik05NDIuMiA0ODYuMkM4NDcuNCAyODYuNSA3MDQuMSAxODYgNTEyIDE4NmMtMTkyLjIgMC0zMzUuNCAxMDAuNS00MzAuMiAzMDAuM2E2MC4zIDYwLjMgMCAwIDAgMCA1MS41QzE3Ni42IDczNy41IDMxOS45IDgzOCA1MTIgODM4YzE5Mi4yIDAgMzM1LjQtMTAwLjUgNDMwLjItMzAwLjNjNy43LTE2LjIgNy43LTM1IDAtNTEuNXpNNTEyIDc2NmMtMTYxLjMgMC0yNzkuNC04MS44LTM2Mi43LTI1NEMyMzIuNiAzMzkuOCAzNTAuNyAyNTggNTEyIDI1OHMyNzkuNCA4MS44IDM2Mi43IDI1NEM3OTEuNSA2ODQuMiA2NzMuNCA3NjYgNTEyIDc2NnoiPjwvcGF0aD48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik01MDggMzM2Yy05Ny4yIDAtMTc2IDc4LjgtMTc2IDE3NnM3OC44IDE3NiAxNzYgMTc2czE3Ni03OC44IDE3Ni0xNzZzLTc4LjgtMTc2LTE3Ni0xNzZ6bTAgMjg4Yy02MS45IDAtMTEyLTUwLjEtMTEyLTExMnM1MC4xLTExMiAxMTItMTEyczExMiA1MC4xIDExMiAxMTJzLTUwLjEgMTEyLTExMiAxMTJ6Ij48L3BhdGg+PC9nPjwvc3ZnPjwvc3ZnPg=="
                  alt="eye-twotone"
                  className="showIcon"
                ></img>
              </button>
            </label>

            {formErrors.cnPass && (
              <p className="alertText text-red-500">{formErrors.cnPass}</p>
            )}

            {formErrors.confirmPassword && (
              <p className="alertText text-red-500">
                {formErrors.confirmPassword}
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
      </div>
    </div>
  );
}

export default Login;
