import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Trips } from "./pages/Trips";
import { NewTrips } from "./pages/NewTrips";
import { TripDetail } from "./pages/TripDetail";
import { FeedBack } from "./pages/FeedBack";
import { Stats } from "./pages/Stats";
import ProtectedRoute from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import { NotFound } from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route
            path="/trips"
            element={
              <ProtectedRoute>
                <Trips />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/trips/new"
            element={
              <ProtectedRoute>
                <NewTrips />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips/:tripId"
            element={
              <ProtectedRoute>
                <TripDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips/:tripId/feedback"
            element={
              <ProtectedRoute>
                <FeedBack />
              </ProtectedRoute>
            }
          />
          <Route
            path="/items/stats"
            element={
              <ProtectedRoute>
                <Stats />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
