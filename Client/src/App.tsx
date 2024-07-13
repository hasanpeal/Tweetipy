import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import NewUser from "./components/NewUser"
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />}>
            {" "}
          </Route>
          <Route path="/login" element={<Login />}>
            {" "}
          </Route>
          <Route path="/signup" element={<Signup />}>
            {" "}
          </Route>
          <Route path="/newuser" element={<NewUser />}>
            {" "}
          </Route>
          <Route path="/dashboard" element={<Dashboard />}>
            {" "}
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
