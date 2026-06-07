import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home
  from "./pages/Home";

import Login
  from "./pages/Login";

import Signup
  from "./pages/Signup";

import Cart
  from "./pages/Cart";

import Orders
  from "./pages/Orders";

import Admin
  from "./pages/Admin";

import RestaurantDetails
  from "./pages/RestaurantDetails";

import RestaurantDashboard
  from "./pages/RestaurantDashboard";

import RestaurantSettings
  from "./pages/RestaurantSettings";

import Profile
from "./pages/Profile";

import RoleRoute
  from "./components/RoleRoute";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />

        <Route
          path="/admin"
          element={<Admin />}
        />

        <Route
          path="/restaurant/:id"
          element={<RestaurantDetails />}
        />

        <Route
          path="/restaurant-dashboard"
          element={
            <RoleRoute requireRestaurantOwner>
              <RestaurantDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/restaurant-settings"
          element={
            <RoleRoute requireRestaurantOwner>
              <RestaurantSettings />
            </RoleRoute>
          }
        />

        <Route
        path="/profile"
        element={
          <RoleRoute requireCustomer>
            <Profile />
          </RoleRoute>
        }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;