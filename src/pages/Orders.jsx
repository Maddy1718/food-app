import {
  useContext,
  useEffect,
  useState,
} from "react";

import MainLayout from "../layouts/MainLayout";

import {
  AuthContext,
} from "../context/AuthContext";

import {
  fetchOrders,
} from "../services/api/orderService";

function Orders() {

  const { user } =
    useContext(AuthContext);

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // LOAD ORDERS
  useEffect(() => {

    const loadOrders =
      async () => {

        if (!user) {

          setLoading(false);

          return;
        }

        try {

          setLoading(true);

          const data =
            await fetchOrders(
              user
            );

          setOrders(
            data || []
          );

        } catch (err) {

          console.error(
            "Orders error:",
            err
          );

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

          <div
            style={{
              fontSize:
                "18px",
            }}
          >

            Please login to view your orders

          </div>

        ) : loading ? (

          <div
            style={{
              fontSize:
                "18px",
            }}
          >

            Loading orders...

          </div>

        ) : orders.length === 0 ? (

          <div
            style={{
              fontSize:
                "18px",
            }}
          >

            No orders found

          </div>

        ) : (

          orders.map(
            (order) => {

              const orderDate =
                new Date(
                  order.order_time
                ).toLocaleString();

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

                  {/* TOP */}
                  <div
                    style={{
                      display:
                        "flex",

                      justifyContent:
                        "space-between",

                      alignItems:
                        "center",

                      marginBottom:
                        "20px",
                    }}
                  >

                    <div>

                      <h2>

                        Order #
                        {order.id}

                      </h2>

                      <p>
                        {orderDate}
                      </p>
                    </div>

                    <span
                      style={{
                        background:
                          order.order_status ===
                          "Delivered"
                            ? "#16a34a"
                            : order.order_status ===
                              "Pending"
                            ? "#f59e0b"
                            : "#ff6b00",

                        color:
                          "white",

                        padding:
                          "8px 15px",

                        borderRadius:
                          "10px",

                        fontWeight:
                          "bold",
                      }}
                    >

                      {
                        order.order_status
                      }

                    </span>
                  </div>

                  {/* RESTAURANT */}
                  <div
                    style={{
                      marginBottom:
                        "20px",
                    }}
                  >

                    <h3>

                      {
                        order
                          ?.restaurant
                          ?.restaurant_name
                      }

                    </h3>
                  </div>

                  {/* PRICE DETAILS */}
                  <div
                    style={{
                      display:
                        "grid",

                      gap:
                        "10px",
                    }}
                  >

                    <div>
                      Food Price:
                      ₹ {order.price}
                    </div>

                    <div>
                      Delivery Fee:
                      ₹ {order.delivery_fee}
                    </div>

                    <div>
                      Platform Fee:
                      ₹ {order.platform_fee}
                    </div>

                    <div>
                      GST:
                      ₹ {order.gst_amount}
                    </div>

                    <div>
                      Packing Charge:
                      ₹ {order.packing_charge}
                    </div>

                    <div>
                      Discount:
                      ₹ {order.discount}
                    </div>

                    <div
                      style={{
                        fontWeight:
                          "bold",

                        fontSize:
                          "20px",

                        marginTop:
                          "10px",
                      }}
                    >

                      Total:
                      ₹{" "}
                      {
                        order.total_price
                      }

                    </div>
                  </div>

                  {/* ADDRESS */}
                  <div
                    style={{
                      marginTop:
                        "20px",
                    }}
                  >

                    <strong>
                      Delivery Address:
                    </strong>

                    <p>
                      {
                        order.delivery_address
                      }
                    </p>
                  </div>

                </div>
              );
            }
          )
        )}
      </div>

    </MainLayout>
  );
}

export default Orders;