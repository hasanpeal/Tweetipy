import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  document.title = "Tweetipy | Home"
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
                <a>Sign in</a>
              </li>
              <li>
                <a>Sign up</a>
              </li>
              <li>
                <a>Contact us</a>
              </li>
              <li>
                <a>Terms and condition</a>
              </li>
              {/* <li>
                <a>Item 3</a>
              </li> */}
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">Tweetipy</a>
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
              <a onClick={() => navigate("/login")}>Contact us</a>
            </li>
            <li>
              <a onClick={() => navigate("/aboutus")}>About us</a>
            </li>
            {/* <li>
              <a>Ab</a>
            </li> */}
          </ul>
        </div>
      </div>

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

export default Home;
