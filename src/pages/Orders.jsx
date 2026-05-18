import { useContext, useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { AuthContext } from "../context/AuthContext";
import { fetchOrders } from "../services/api/orderService";

function Orders() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await fetchOrders(user.id || user.email);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  return (

    <MainLayout>

      <div
        style={{
          background:
            "#f5f5f5",

          minHeight:
            "100vh",

          padding:
            "30px",
        }}
      >

        <h1
          style={{
            marginBottom:
              "30px",
          }}
        >

          Your Orders

        </h1>

        {!user ? (
          <div style={{ fontSize: "18px" }}>
            Please login to view your orders
          </div>
        ) : loading ? (
          <div style={{ fontSize: "18px" }}>
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div style={{ fontSize: "18px" }}>
            No orders found
          </div>
        ) : (
          orders.map((order) => {
            const orderDate = new Date(order.created_at).toLocaleDateString();
            const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;

            return (
              <div

                key={order.id}

                style={{
                  background:
                    "white",

                  padding:
                    "25px",

                  borderRadius:
                    "20px",

                  marginBottom:
                    "20px",

                  boxShadow:
                    "0 2px 10px rgba(0,0,0,0.08)",
                }}
              >

                <h2>

                  Order #{order.id}

                </h2>

                <p>

                  {orderDate}

                </p>

                <p style={{ marginTop: "10px", fontSize: "16px" }}>
                  {Array.isArray(items) && items.length > 0 && (
                    <>
                      {items.map((item, idx) => (
                        <div key={idx}>{item.name} x {item.quantity}</div>
                      ))}
                    </>
                  )}
                </p>

                <p style={{ marginTop: "10px", fontWeight: "bold" }}>

                  ₹ {order.total}

                </p>

                <span
                  style={{
                    background:
                      order.status === "placed" ? "#ff6b00" : order.status === "Delivered" ? "#16a34a" : "#f59e0b",

                    color:
                      "white",

                    padding:
                      "8px 15px",

                    borderRadius:
                      "10px",

                    display:
                      "inline-block",

                    marginTop:
                      "10px",
                  }}
                >

                  {order.status}

                </span>

              </div>
            );
          })
        )}

      </div>

    </MainLayout>
  );
}

export default Orders;