import "./Login.css";
import { useState, ChangeEvent, useRef, useEffect, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
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
  );
}

export default NewUser;

//changes
