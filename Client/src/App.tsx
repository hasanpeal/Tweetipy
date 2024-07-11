import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import NewUser from "./components/NewUser"

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/newuser" element={<NewUser />}>
            {" "}
          </Route>
          <Route path="/login" element={<Login />}>
            {" "}
          </Route>
          <Route path="/signup" element={<Signup />}>
            {" "}
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
