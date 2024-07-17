import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import "./Home.css";
import { useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

function Home() {
  const navigate = useNavigate();
  document.title = "Tweetipy | Home";
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
    <div className="home">
      {/*  */}
      {/* Navbar */}
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
            onClick={() => window.location.reload()}
          >
            Tweetipy
          </a>
        </div>
        <div className="navbar-end hidden lg:flex menu1">
          <ul className="menu menu-horizontal px-1">
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

      {/* Hero */}
      <div className="hero bg-base-200  heroContainer">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Welcome to Tweetipy </h1>
            <article className="prose prose-lg py-6">
              Transform your Twitter/X experience into a daily dose of tailored
              content that keeps you informed and engaged. Our innovative
              platform harnesses the power of artificial intelligence to curate
              and deliver personalized newsletters and podcasts, bringing you
              the latest updates from your favorite Twitter/X accounts.
            </article>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="features flex flex-wrap lg:flex-nowrap">
        <div className="card bg-neutral w-96 shadow-xl">
          <div className="card-body">
            <h2 className="card-title tit text-center">Seamless Integration</h2>
            <p>
              Effortlessly connect your Twitter/X and Instagram profiles. Our
              platform securely fetches your followed accounts, allowing you to
              handpick the profiles you care about the most.
            </p>
          </div>
        </div>

        <div className="card bg-neutral w-96 shadow-xl">
          <div className="card-body">
            <h2 className="card-title tit text-center">AI-Driven Content</h2>
            <p>
              Leveraging cutting-edge AI technology, we analyze and summarize
              the latest posts and trends, ensuring you receive the most
              relevant and insightful updates.
            </p>
          </div>
        </div>

        <div className="card bg-neutral w-96 shadow-xl">
          <div className="card-body">
            <h2 className="card-title tit text-center">Engaging Podcasts</h2>
            <p>
              Prefer listening to reading? Our platform converts the curated
              content into engaging podcasts, perfect for on-the-go updates
              during your commute, workout, or relaxation time.
            </p>
          </div>
        </div>

        <div className="card bg-neutral w-96 shadow-xl">
          <div className="card-body">
            <h2 className="card-title tit text-center">
              AI-Driven Customizable Delivery
            </h2>
            <p>
              Set your preferred time for receiving newsletters and podcasts, so
              you get your updates exactly when you need them. Personalization
              at its finest.
            </p>
          </div>
        </div>

        <div className="card bg-neutral w-96 shadow-xl">
          <div className="card-body">
            <h2 className="card-title tit text-center">Stay Connected</h2>
            <p>
              Never miss a beat on the topics and influencers you follow. Our
              platform ensures you are always in the loop, with timely and
              relevant content delivered straight to your inbox and ears.
            </p>
          </div>
        </div>

        <div className="card bg-neutral shadow-xl w-96">
          <div className="card-body">
            <h2 className="card-title tit text-center">
              User-Friendly Interface
            </h2>
            <p>
              Navigate with ease through our intuitive and sleek interface.
              Personalizing your content preferences has never been simpler.
            </p>
          </div>
        </div>
      </div>

      <div className="mainyDiv ">
        <div className="mockup-window bg-base-300 border container hidden lg:block">
          <h2 className="card-title desktop">User-Friendly Dashboard</h2>
          <div className="bg-base-200 flex justify-center">
            <img className="imgItem" src="PP.png" />
          </div>
        </div>
      </div>

      <div className="flex-container py-20">
        <div className="changeBack">
          <div className="mbox">
            <div className="mockup-phone">
              <div className="camera"></div>
              <div className="display">
                <div className="artboard artboard-demo phone-1">
                  <img
                    className="emailItem"
                    src="Email.png"
                    alt="Email example"
                  />
                </div>
              </div>
            </div>
            <h4 className="mobtext">Newsletter and podcast all in email</h4>
          </div>
        </div>

        <div className="mbox">
          <div className="changeBack ">
            <div className="mockup-phone">
              <div className="camera"></div>
              <div className="display">
                <div className="artboard artboard-demo phone-1 emailItem2">
                  <img
                    className="emailItem2"
                    src="P2.PNG"
                    alt="Email example"
                  />
                </div>
              </div>
            </div>
            <h4 className="mobtext mt-2">
              Supports podcast play on background
            </h4>
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

export default Home;
