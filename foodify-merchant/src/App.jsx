import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import RestaurantSettings from "./pages/RestaurantSettings";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={<RestaurantDashboard />}
        />

        <Route
          path="/restaurant-settings"
          element={<RestaurantSettings />}
        />

        <Route
          path="*"
          element={<Navigate to="/" />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;