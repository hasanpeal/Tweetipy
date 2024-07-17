import "./Login.css";
import { useState, ChangeEvent, useRef, useEffect, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import _ from "lodash";

function NewUser() {
  const [user, setUser] = useState<string>("");
  const [data, setData] = useState<string[]>([]);
  const [time, setTime] = useState<string>("9");
  const [load, setLoad] = useState(false);
  const [twitter, setTwitter] = useState(false);
  const [enteredUsers, setEnteredUsers] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState<boolean>(false);
  const [addAll, setAddAll] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const cache = useRef<{ [key: string]: string[] }>({});
  const location = useLocation();
  const navigate = useNavigate();
  const { email, username } = location.state;
  document.title = "Tweetipy | New User"

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

  const fetchData = useCallback(async () => {
    try {
      console.log("Username of account is ", username);
      console.log("Data getting fetched");
      const result = await axios.get("http://localhost:3001/isTwitterUser", {
        params: { email: email },
      });
      console.log("Is twitter user? ", result.data.bool);
      if (result.data.bool) {
        setTwitter(true);
        const options = {
          method: "GET",
          url: "https://twitter-api45.p.rapidapi.com/following.php",
          params: {
            screenname: `${username}`,
          },
          headers: {
            "x-rapidapi-key": import.meta.env.VITE_RAPID_API_KEY,
            "x-rapidapi-host": "twitter-api45.p.rapidapi.com",
          },
        };
        const temp: string[] = [];
        const response = await axios.request(options);
        if (response) console.log("Response req successful");
        for (let i = 0; i < response.data.following.length; i++) {
          temp.push(response.data.following[i].screen_name);
        }
        setAddAll(temp);
      }
    } catch (err) {
      console.log("Error fetching isTwitterUser and following in NewUser.tsx");
    }
  }, [email, username]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function handleAddAllUser() {
    setEnteredUsers((prevEnteredUsers) => {
      return [...prevEnteredUsers, ...addAll];
    });
    console.log(enteredUsers);
  }

  function handleRemoveAllUser() {
    setEnteredUsers([]);
  }

  const searchAccount = useCallback(async (keyword: string) => {
    const options = {
      method: "GET",
      url: "https://twitter-api45.p.rapidapi.com/search.php",
      params: {
        query: `${keyword}`,
        search_type: "People",
      },
      headers: {
        "x-rapidapi-key": import.meta.env.VITE_RAPID_API_KEY,
        "x-rapidapi-host": "twitter-api45.p.rapidapi.com",
      },
    };
    try {
      const result: string[] = [];
      const response = await axios.request(options);
      for (let i = 0; i < 6; i++) {
        if (response.data.timeline[i]?.screen_name) {
          result.push(response.data.timeline[i].screen_name);
        } else break;
      }
      return result;
    } catch (error) {
      console.log(
        "Error fetching data for searchAccount in tweetCall.ts\n",
        error
      );
    }
  }, []);

  const debouncedSearchAccount = useCallback(
    _.debounce(async (keyword: string) => {
      if (keyword.length > 0) {
        if (cache.current[keyword]) {
          setData(cache.current[keyword]);
          setLoadingSuggestions(false);
        } else {
          setLoadingSuggestions(true);
          const suggestions = await searchAccount(keyword);
          setLoadingSuggestions(false);
          if (suggestions) {
            setData(suggestions);
            cache.current[keyword] = suggestions;
          } else {
            console.log("Suggestions returned nothing");
          }
        }
      } else {
        setData([]);
      }
    }, 300),
    [searchAccount]
  );

  useEffect(() => {
    if (user.length > 0) {
      setShowDropdown(true);
      debouncedSearchAccount(user);
    } else {
      setShowDropdown(false);
      setData([]);
    }
  }, [user, debouncedSearchAccount]);

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    setUser(event.target.value);
  }

  function handleSelect(item: string) {
    setEnteredUsers((prevUsers) => {
      if (!prevUsers.includes(item)) {
        return [...prevUsers, item];
      }
      return prevUsers;
    });
    setUser("");
    setShowDropdown(false);
    inputRef.current?.focus();
  }

  function handleRemove(index: number) {
    setEnteredUsers((prevUsers) => prevUsers.filter((_, i) => i !== index));
  }

  async function handleContinue() {
    const newUsers = user
      .split(",")
      .map((u) => u.trim())
      .filter((u) => u && !enteredUsers.includes(u));
    setData((prevData) => [...prevData, ...newUsers]);
    setEnteredUsers((prevUsers) => [...prevUsers, ...newUsers]);
    setUser("");
    if (enteredUsers.length === 0) toast.error("Select at least 1 user");
    else {
      try {
        setLoad(true);
        await axios.post("http://localhost:3001/updateTime", { email, time });
        await axios.post("http://localhost:3001/updateProfile", {
          email,
          profiles: enteredUsers,
        });
        await axios.post("http://localhost:3001/updateNewUser", {
          email,
          bool: false,
        });
        navigate("/dashboard", { state: { email, username } });
      } catch (err) {
        console.log("Error in handleContinue in NewUser.tsx");
      }
    }
  }

  useEffect(() => {
    if (inputContainerRef.current) {
      inputContainerRef.current.style.height = "auto";
      inputContainerRef.current.style.height = `${inputContainerRef.current.scrollHeight}px`;
    }
  }, [enteredUsers, user]);

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
          <a className="btn btn-ghost text-xl" onClick={() => window.location.reload()}>
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

      <div className="mainContainer pb-48">
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
            <label className="form-control w-full timeBox">
              &nbsp;Select time for daily newsletter
              <select
                className="select select-bordered selectBox"
                value={time}
                onChange={(event) => setTime(event.target.value)}
              >
                <option disabled>Pick a time</option>
                <option value={"9"}>9:00 am</option>
                <option value={"12"}>12:00 pm</option>
                <option value={"15"}>3:00 pm</option>
                <option value={"18"}>6:00 pm</option>
                <option value={"21"}>9:00 pm</option>
                <option value={"24"}>12:00 am</option>
              </select>
            </label>
          </div>
          <div className="relative searchBox">
            &nbsp;Select preferred usernames
            <div
              ref={inputContainerRef}
              className="input input-bordered flex items-center gap-2 userName"
            >
              {enteredUsers.map((user, index) => (
                <span key={index} className="userBox">
                  {user}
                  <button
                    className="removeBtn"
                    onClick={() => handleRemove(index)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      className="cross"
                    >
                      <path d="M12,2C6.47,2,2,6.47,2,12s4.47,10,10,10s10-4.47,10-10S17.53,2,12,2z M17,15.59L15.59,17L12,13.41L8.41,17L7,15.59 L10.59,12L7,8.41L8.41,7L12,10.59L15.59,7L17,8.41L13.41,12L17,15.59z"></path>
                    </svg>
                  </button>
                </span>
              ))}
              <input
                type="text"
                className="grow userInput"
                placeholder="@"
                onChange={handleSearch}
                value={user}
                ref={inputRef}
                autoFocus
              />
            </div>
            {showDropdown && (
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-full p-2 shadow absolute mt-1 suggList"
              >
                {loadingSuggestions ? (
                  <li>
                    <span className="loading loading-dots loading-sm loadBut"></span>
                  </li>
                ) : (
                  data
                    .filter((item) => {
                      const searchTerm = user.toLowerCase();
                      const fullName = item.toLowerCase();
                      return searchTerm && fullName.startsWith(searchTerm);
                    })
                    .map((item, index) => (
                      <li key={index}>
                        <a onClick={() => handleSelect(item)}> @{item}</a>
                      </li>
                    ))
                )}
              </ul>
            )}
          </div>

          {twitter && (
            <div>
              <p> Want to add all followed users from X?</p>
              <button
                className="btn btn-outline btn-success addAllBtn"
                onClick={handleAddAllUser}
              >
                Add all
              </button>
              <button
                className="btn btn-outline btn-error removeAllBtn"
                onClick={handleRemoveAllUser}
              >
                Remove all
              </button>
            </div>
          )}

          <button
            className="btn btn-active btn-primary contBtn"
            onClick={handleContinue}
          >
            Continue
          </button>
          {load && (
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

export default NewUser;

//changes
