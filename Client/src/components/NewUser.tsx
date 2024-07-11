import "./Login.css";
import { useState, ChangeEvent, useRef, useEffect } from "react";

function NewUser() {
  const [user, setUser] = useState<string>("");
  const [data, setData] = useState<string[]>([
    "elonmusk",
    "pealhasan",
    "peter",
    "peref",
    "pded",
    "pde",
  ]);
  const [enteredUsers, setEnteredUsers] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    setUser(event.target.value);
    setShowDropdown(event.target.value.length > 0);
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

  function handleContinue() {
    const newUsers = user
      .split(",")
      .map((u) => u.trim())
      .filter((u) => u && !enteredUsers.includes(u));
    setData((prevData) => [...prevData, ...newUsers]);
    setEnteredUsers((prevUsers) => [...prevUsers, ...newUsers]);
    setUser("");
    console.log(enteredUsers);
  }

  // Adjust input container height based on content
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

        <label className="customLabel">
          {" "}
          &nbsp;Pick a time for daily newsletter
        </label>
        <div>
          <label className="input input-bordered flex items-center gap-2">
            <input type="time" required={true} />
          </label>
        </div>

        <label className="customLabel">&nbsp;Select preferred usernames</label>
        <div className="relative searchBox">
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
                  x
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
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-full p-2 shadow absolute mt-1"
            >
              {data
                .filter((item) => {
                  const searchTerm = user.toLowerCase();
                  const fullName = item.toLowerCase();
                  return searchTerm && fullName.startsWith(searchTerm);
                })
                .map((item, index) => (
                  <li key={index}>
                    <a onClick={() => handleSelect(item)}>{item}</a>
                  </li>
                ))}
            </ul>
          )}
        </div>

        <button
          className="btn btn-outline btn-primary contBtn"
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default NewUser;
