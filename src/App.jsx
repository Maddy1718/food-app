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
          element={
            <RestaurantDetails />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;