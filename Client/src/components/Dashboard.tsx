import "./Dashboard.css";
import { useState, useRef, useEffect, useCallback, ChangeEvent } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import _ from "lodash";
import { useLocation, useNavigate } from "react-router-dom";

function Dashboard() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [user, setUser] = useState<string>("");
  const [data, setData] = useState<string[]>([]);
  const [time, setTime] = useState<string>("9");
  const [load, setLoad] = useState(false);
  const [load2, setLoad2] = useState(false);
  const [load3, setLoad3] = useState(false);
  const [load4, setLoad4] = useState(false);
  const [podcast, setPodcast] = useState("");
  const [newsletter, setNewsletter] = useState("");
  const [showUpdate1, setShowUpdate1] = useState(true);
  const [showUpdate2, setShowUpdate2] = useState(true);
  const [showUpdate3, setShowUpdate3] = useState(true);
  const [showUpdate4, setShowUpdate4] = useState(true);
  const [enteredUsers, setEnteredUsers] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const cache = useRef<{ [key: string]: string[] }>({});
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state;

  useEffect(() => {
    document.title = `${firstName}'s Dashboard`;x
  }, [firstName])

  const fetchData = useCallback(async () => {
    try {
      const capturedProfiles = await axios.get(
        "http://localhost:3001/getFollowedProfiles",
        {
          params: { email: email },
        }
      );
      setEnteredUsers(capturedProfiles.data.profiles);
      const capturedTime = await axios.get(
        "http://localhost:3001/getPreferredTime",
        {
          params: { email: email },
        }
      );
      setTime(capturedTime.data.time);
      const capturedUserInfo = await axios.get(
        "http://localhost:3001/getUserInfo",
        {
          params: { email: email },
        }
      );
      setFirstName(capturedUserInfo.data.userInfo.firstName);
      setLastName(capturedUserInfo.data.userInfo.lastName);
      const capturedPodcast = await axios.get(
        "http://localhost:3001/getPodcast",
        {
          params: { email: email },
        }
      );
      setPodcast(capturedPodcast.data.podcast);
      const capturedNewsletter = await axios.get(
        "http://localhost:3001/getNewsletter",
        {
          params: { email: email },
        }
      );
      setNewsletter(capturedNewsletter.data.newsletter);
    } catch (err) {
      console.log("Error retriving datas in useEffect");
    }
  }, [email]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
        "Error fetching data for searchAccount in Dashboard.tsx\n",
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

  async function updateInfos(){
    try {
        setShowUpdate3(false);
        setLoad3(true);
        const result = await axios.post("http://localhost:3001/updateUserInfo", {email, firstName, lastName});
        setShowUpdate3(true);
        setLoad3(false);
        if(result.data.code === 0) {
            toast.success("Successful account update")
        }
        else {
            toast.error("Error updating profile");
        }
    } catch (err) {
        console.log("Error in updateInfos in Dashboard.tsx");
    }
  }

  async function handleLogout() {
    try {
        const res = await axios.post("http://localhost:3001/logout");
        if(res.data.code === 0){
            toast.success("Logout successful");
            navigate("/");
        } else {
            toast.error("Logout unsuccessful");
        }
    } catch (err) {
        console.log("Error in handleLogout function in Dashboard.tsx");
    }
  }

  async function handleDelete() {
    try {
      setShowUpdate4(false);
      setLoad4(true);
      const result = await axios.post("http://localhost:3001/deleteUser", {
        email,
      });
      setShowUpdate4(true);
      setLoad4(false);
      if (result.data.code === 0) {
        toast.success("Account deletion successful");
        await axios.post("http://localhost:3001/logout");
        navigate("/");
      } else {
        toast.error("Error deleting account");
      }
    } catch (err) {
      console.log("Error in handleDelete in Dashboard.tsx");
    }
  }

  async function handleUpdateUsernames() {
    try {
        console.log(enteredUsers);
      setShowUpdate1(false);
      setLoad(true);
      const result = await axios.post("http://localhost:3001/updateProfile", {
        email,
        profiles: enteredUsers,
      });
      setLoad(false);
      setShowUpdate1(true);
      if (result.data.code === 0) {
        toast.success("Profile lists got updated");
      } else toast.error("Error updating profiles");
    } catch (error) {
      console.log("Error updating usernames in Dashboard.tsx");
      toast.error("Failed to update usernames");
    }
  }

  useEffect(() => {
    if (inputContainerRef.current) {
      inputContainerRef.current.style.height = "auto";
      inputContainerRef.current.style.height = `${inputContainerRef.current.scrollHeight}px`;
    }
  }, [enteredUsers, user]);

  async function handleUpdateTime() {
    try {
      setShowUpdate2(false);
      setLoad2(true);
      const result = await axios.post("http://localhost:3001/updateTime", {
        email,
        time,
      });
      setLoad2(false);
      setShowUpdate2(true);
      if (result.data.code === 0) {
        toast.success("Time update successful");
      } else toast.error("Error updating time");
    } catch (error) {
      console.log("Error updating time in Dashboard.tsx");
      toast.error("Failed to update time");
    }
  }

  return (
    <div className="mainDiv">
      <div className="navbar bg-base- navBox bg-neutral">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl text-white">Tweetipy</a>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end ppIcon">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                {/* <img
                  alt="Profile"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                /> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-8 w-8 mt-1 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow ulItem bg-neutral"
            >
              <li>
                <a
                  // onClick={() =>
                  //   document.getElementById("my_modal_3")?.showModal()
                  // }
                  onClick={() => {
                    const dialog = document.getElementById("my_modal_3");
                    if (dialog instanceof HTMLDialogElement) {
                      dialog.showModal();
                    }
                  }}
                >
                  Profile
                  <dialog id="my_modal_3" className="modal accountBox">
                    <div className="modal-box">
                      <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                          ✕
                        </button>
                      </form>
                      <h3 className="font-bold text-lg mb-5">Account</h3>
                      <h4 className="mb-1"> &nbsp;First Name</h4>
                      <input
                        type="text"
                        placeholder="Type here"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        className="input input-bordered input-md w-full max-w-lg mb-4"
                      />
                      <h4 className="mb-1"> &nbsp;Last Name</h4>
                      <input
                        type="text"
                        placeholder="Type here"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                        className="input input-bordered input-md w-full max-w-lg mb-4"
                      />
                      <h4 className="mb-1"> &nbsp;Email</h4>
                      <input
                        type="email"
                        placeholder="Type here"
                        value={email}
                        className="input input-bordered input-md w-full max-w-lg mb-4"
                        disabled
                      />
                      <div className="buttons">
                        <button
                          className="btn btn-success"
                          onClick={updateInfos}
                        >
                          {showUpdate3 && "Update"}
                          {load3 && (
                            <span className="loading loading-dots loading-lg"></span>
                          )}
                        </button>
                        <button
                          className="btn btn-error"
                          onClick={handleDelete}
                        >
                          {showUpdate4 && "Delete Account"}
                          {load4 && (
                            <span className="loading loading-dots loading-lg"></span>
                          )}
                        </button>
                      </div>
                    </div>
                  </dialog>
                </a>
              </li>
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="min-h-screen grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-4 gridContent">
        {/* First Column */}
        <div className="p-4 column1 flex flex-col items-center w-full">
          <article className="prose prose-lg text-center text-white">
            Followed profiles
          </article>
          <div className="relative searchBox mt-4 mb-4 flex flex-col items-center w-full">
            <div
              ref={inputContainerRef}
              className="input input-bordered flex items-center pb-4 gap-2 userName w-full"
            >
              {enteredUsers.map((user, index) => (
                <span key={index} className="userBox">
                  @{user}
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
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-full p-2 shadow mt-1 suggList"
                style={{ width: inputContainerRef.current?.offsetWidth }}
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
          <div className="flex mb-4 justify-center mt-4 w-full">
            <button
              className="btn btn-primary btn-wide"
              onClick={handleUpdateUsernames}
            >
              {showUpdate1 && "Update Profile List"}
              {load && (
                <span className="loading loading-dots loading-lg"></span>
              )}
            </button>
          </div>
          <Toaster />
        </div>

        {/* Second Column */}
        <div className="flex flex-col gap-4 secCol flex-grow">
          <div className="p-4 row1 digestDiv flex-grow">
            <article className="prose prose-lg mb-0.5 text-white">
              Daily digest time
            </article>
            <div className="p-2.5 timeGrid">
              <label className="form-control w-full timeBox">
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
              <div className="flex justify-center mt-8 w-full">
                <button
                  className="btn btn-primary btn-wide"
                  onClick={handleUpdateTime}
                >
                  {showUpdate2 && "Update Time"}
                  {load2 && (
                    <span className="loading loading-dots loading-lg"></span>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="p-4 row2 podcastDiv flex-grow">
            <article className="prose prose-lg text-white">
              Latest podcast
            </article>
            <div className="audioDiv">
              <audio
                controls
                src={podcast}
                crossOrigin="anonymous"
                className="audioFile"
              ></audio>
            </div>
          </div>
          <div className="p-4 row3 newsDiv flex-grow">
            <article className="prose prose-lg text-white mb-1">
              Latest newsletter
            </article>
            <p className="newsL">{newsletter}</p>
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

export default Dashboard;
