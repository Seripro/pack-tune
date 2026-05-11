import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Trips } from "./pages/Trips";
import { NewTrips } from "./pages/NewTrips";
import { TripDetail } from "./pages/TripDetail";
import { FeedBack } from "./pages/FeedBack";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/trips" element={<Trips />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/trips/new" element={<NewTrips />} />
        <Route path="/trips/:tripId" element={<TripDetail />} />
        <Route path="/trips/:tripId/feedback" element={<FeedBack />} />
      </Routes>
    </Router>
  );
}

export default App;
