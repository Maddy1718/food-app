import {
  useEffect,
  useState,
  useContext,
} from "react";

import MainLayout from "../layouts/MainLayout";

import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

import { fetchRestaurants } from "../services/api/restaurantService";
import { fetchMenuItems } from "../services/api/menuService";
import { fetchAllOrders, updateOrderStatus } from "../services/api/orderService";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Admin() {
  const { isAdmin } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);

  // DATA
  const [restaurants, setRestaurants] = useState([]);

  const [items, setItems] =
    useState([]);

  const [orders, setOrders] =
    useState([]);

  const fetchData = async () => {
    try {
      // RESTAURANTS
      const restaurantData = await fetchRestaurants();
      setRestaurants(restaurantData);

      // ITEMS
      const itemData = await fetchMenuItems();
      setItems(itemData);

      // ORDERS
      const orderData = await fetchAllOrders();
      setOrders(orderData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // FETCH
  useEffect(() => {

    fetchData();

  }, []);

  // ANALYTICS
  const totalRevenue =
    orders.reduce(
      (sum, order) =>
        sum +
        Number(order.total || 0),
      0
    );

  const analyticsData = [
    {
      name: "Restaurants",
      value: restaurants.length,
    },
    {
      name: "Food Items",
      value: items.length,
    },
    {
      name: "Orders",
      value: orders.length,
    },
  ];

  // UPDATE ORDER STATUS
  const handleUpdateOrderStatus =
    async (id, status) => {
      const result = await updateOrderStatus(id, status);
      if (result) {
        fetchData();
      }
    };

  // BLOCK NON ADMIN
  if (!isAdmin) {
    return (
      <MainLayout>
        <div className={`min-h-[60vh] flex items-center justify-center rounded-[32px] border border-white/10 bg-[#081127] p-12 text-center ${darkMode ? "text-white" : "text-slate-950"}`}>
          <div>
            <h2 className="text-4xl font-black mb-4">Access Denied</h2>
            <p className="text-slate-400">You do not have permission to access the admin panel.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={`min-h-screen py-10 ${darkMode ? "bg-[#071028] text-white" : "bg-[#f8fafc] text-slate-900"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* TITLE */}
        <h1 className="text-4xl font-bold mb-10">

          Admin Dashboard

        </h1>

        {/* ANALYTICS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">

          {/* REVENUE */}
          <div className={`rounded-3xl p-8 shadow-sm ${darkMode ? "bg-slate-900/80 border border-white/10" : "bg-white"}`}>
            <p className={`${darkMode ? "text-slate-400" : "text-gray-500"}`}>
              Total Revenue
            </p>
            <h2 className="text-4xl font-bold mt-3 text-orange-500">
              ₹ {totalRevenue}
            </h2>
          </div>

          {/* ORDERS */}
          <div className={`rounded-3xl p-8 shadow-sm ${darkMode ? "bg-slate-900/80 border border-white/10" : "bg-white"}`}>
            <p className={`${darkMode ? "text-slate-400" : "text-gray-500"}`}>
              Total Orders
            </p>
            <h2 className="text-4xl font-bold mt-3">
              {orders.length}
            </h2>
          </div>

          {/* RESTAURANTS */}
          <div className={`rounded-3xl p-8 shadow-sm ${darkMode ? "bg-slate-900/80 border border-white/10" : "bg-white"}`}>
            <p className={`${darkMode ? "text-slate-400" : "text-gray-500"}`}>
              Restaurants
            </p>
            <h2 className="text-4xl font-bold mt-3">
              {restaurants.length}
            </h2>
          </div>

          {/* ITEMS */}
          <div className={`rounded-3xl p-8 shadow-sm ${darkMode ? "bg-slate-900/80 border border-white/10" : "bg-white"}`}>
            <p className={`${darkMode ? "text-slate-400" : "text-gray-500"}`}>
              Food Items
            </p>
            <h2 className="text-4xl font-bold mt-3">
              {items.length}
            </h2>
          </div>

        </div>

        {/* CHART */}
        <div className={`rounded-3xl shadow-sm p-8 mb-16 ${darkMode ? "bg-slate-900/80 border border-white/10" : "bg-white"}`}>
          <h2 className="text-3xl font-bold mb-8">Platform Analytics</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#f97316" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ORDERS */}
        <div className={`rounded-3xl shadow-sm p-8 mb-16 ${darkMode ? "bg-slate-900/80 border border-white/10" : "bg-white"}`}>
          <h2 className="text-3xl font-bold mb-8">Orders</h2>
          <div className="space-y-6">

            {
              orders.map((order) => (

                <div
                  key={order.id}
                  className={`rounded-3xl p-6 ${darkMode ? "border border-white/10 bg-slate-950/80" : "border bg-white"}`}
                >

                  <div className="flex items-center justify-between">

                    <div>

                      <h3 className="text-2xl font-bold">

                        Order #{order.id}

                      </h3>

                      <p className={`${darkMode ? "text-slate-400" : "text-gray-500"} mt-2`}>

                        {order.customer_email}

                      </p>

                    </div>

                    <div className="text-right">

                      <p className="text-orange-500 font-bold text-2xl">

                        ₹ {order.total_price}

                      </p>

                      <p className={`${darkMode ? "text-slate-400" : "text-gray-500"} mt-2`}>

                        {order.order_status}

                      </p>

                    </div>

                  </div>

                  {/* STATUS */}
                  <div className="flex gap-3 mt-6 flex-wrap">

                    <button
                      onClick={() =>
                        updateOrderStatus(
                          order.id,
                          "Preparing"
                        )
                      }
                      className="bg-yellow-500 text-white px-5 py-2 rounded-xl"
                    >

                      Preparing

                    </button>

                    <button
                      onClick={() =>
                        updateOrderStatus(
                          order.id,
                          "Out for Delivery"
                        )
                      }
                      className="bg-blue-500 text-white px-5 py-2 rounded-xl"
                    >

                      Out for Delivery

                    </button>

                    <button
                      onClick={() =>
                        updateOrderStatus(
                          order.id,
                          "Delivered"
                        )
                      }
                      className="bg-green-500 text-white px-5 py-2 rounded-xl"
                    >

                      Delivered

                    </button>

                  </div>

                </div>
              ))
            }

          </div>

        </div>

      </div>

      </div>

    </MainLayout>
  );
}

export default Admin;