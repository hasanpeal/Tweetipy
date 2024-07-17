import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import "./About.css"
import { useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
function About() {
    document.title = "Tweetipy | About";
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
    return (
      <div>
        <div className="navbar bg-base-100">
          <div className="navbar-start">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost lg:hidden"
              >
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
                  <a onClick={() => navigate("/")}>Home</a>
                </li>
                <li>
                  <a onClick={() => navigate("/login")}>Sign in</a>
                </li>
                <li>
                  <a onClick={() => navigate("/signup")}>Sign up</a>
                </li>
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
                <a onClick={() => navigate("/")}>Home</a>
              </li>
              <li>
                <a onClick={() => navigate("/login")}>Sign in</a>
              </li>
              <li>
                <a onClick={() => navigate("/signup")}> Sign up</a>
              </li>
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

        <div className="features bg-base-300">
          <div className="card bg-neutral w-96 shadow-xl">
            <div className="card-body">
              <h2 className="card-title tit text-center">About Us</h2>
              <p className="abt">
                Welcome to Tweetipy – your ultimate companion for staying
                up-to-date with your favorite Twitter content, effortlessly! Our
                web application is designed to provide you with daily
                newsletters and podcasts tailored to the Twitter accounts you
                follow, all delivered seamlessly to your email. Convenience: Get
                daily updates in a format that suits you best. Customization:
                Tailor your content by selecting which accounts to follow and
                when to receive updates. Quality Content: Our newsletters and
                podcasts are crafted to provide you with the most relevant and
                engaging information. Seamless Experience: Enjoy a user-friendly
                interface and effortless navigation.
              </p>
            </div>
          </div>

          <div className="card bg-neutral w-96 shadow-xl">
            <div className="card-body">
              <h2 className="card-title tit text-center">Account</h2>
              <p className="abt">
                Sign In Sign in securely using your email or Twitter account. We
                offer a forget password option, dynamic error checks, and OTP
                verification to ensure your account's safety. Sign Up Create a
                new account using your email or Twitter. Rest assured, we only
                retrieve your Twitter profile information to ensure your privacy
                and security. New User Page Once signed up, you can: Choose a
                time for your daily newsletter and podcast. Add Twitter accounts
                you want to receive updates from, with search and auto-complete
                suggestions. If signed up with Twitter, easily add or remove all
                accounts you follow on Twitter.
              </p>
            </div>
          </div>

          <div className="card bg-neutral w-96 shadow-xl">
            <div className="card-body">
              <h2 className="card-title tit text-center">Dashboard</h2>
              <p className="abt">
                Your personal dashboard is designed for maximum convenience and
                customization, offering a comprehensive suite of tools to manage
                your Tweetipy experience. Here’s what you can do with your
                personalized dashboard: Modify Twitter Accounts: Easily add or
                remove Twitter accounts you follow. With just a few clicks, you
                can tailor your daily digests to include only the content that
                matters most to you. The dashboard provides a seamless interface
                for managing your Twitter account list, ensuring you receive the
                most relevant updates every day. Update Preferred Time: Adjust
                your preferred time for receiving newsletters and podcasts
                according to your schedule.
              </p>
            </div>
          </div>

          <div className="card bg-neutral w-96 shadow-xl">
            <div className="card-body">
              <h2 className="card-title tit text-center">How It Works?</h2>
              <p className="abt">
                At your preferred time each day, Tweetipy: Makes API calls to
                retrieve the latest tweets from your selected accounts.
                Aggregates these tweets and uses Google’s Gemini API to generate
                engaging newsletters. Converts these newsletters into podcasts
                using text-to-speech technology Sends both the newsletter and
                podcast to your email, where the podcast can be played in the
                background on your phone.
              </p>
            </div>
          </div>

          <div className="card bg-neutral w-96 shadow-xl">
            <div className="card-body">
              <h2 className="card-title tit text-center">Our Mission</h2>
              <p className="abt">
                Our mission is to make it easy for you to stay informed about
                the Twitter content you care about, without the need to scroll
                through endless feeds. With Tweetipy, you get personalized,
                digestible content delivered right to your inbox, making your
                daily routine more efficient and enjoyable. Thank you for
                choosing Tweetipy. We are committed to enhancing your Twitter
                experience and look forward to bringing you the best of Twitter,
                daily!
              </p>
            </div>
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
}

export default About;