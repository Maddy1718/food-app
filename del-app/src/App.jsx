import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import ThemeProvider from "./context/ThemeContext";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Dashboard from "./pages/Dashboard";
import AvailableOrders from "./pages/AvailableOrders";
import MyDeliveries from "./pages/MyDeliveries";
import DeliveryHistory from "./pages/DeliveryHistory";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/available-orders"
          element={<AvailableOrders />}
        />

        <Route
          path="/my-deliveries"
          element={<MyDeliveries />}
        />

        <Route
          path="/history"
          element={<DeliveryHistory />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}