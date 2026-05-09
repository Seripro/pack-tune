import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Trips } from "./pages/Trips";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/trips" element={<Trips />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
