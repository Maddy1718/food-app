import { useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";

import { ThemeContext } from "../context/ThemeContext";
import DeliveryLayout from "../layouts/DeliveryLayout";

export default function DeliveryHistory() {

  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchHistory();

  }, []);

  async function fetchHistory() {

    try {

      const partnerId =
        localStorage.getItem(
          "deliveryPartnerId"
        );

      const {
        data,
        error,
      } = await supabase
        .from("delivery_assignment")
        .select(`
          *,
          placed_order (
            *,
            restaurant (
              restaurant_name,
              image_url
            )
          )
        `)
        .eq(
          "delivery_partner_id",
          partnerId
        );

      if (error)
        throw error;

      const deliveredOrders =
        (data || []).filter(
          item =>
            item.placed_order &&
            item.placed_order.status_id === 4
        );

      setOrders(
        deliveredOrders
      );

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  }

  const cardClass = isDark
    ? "rounded-3xl border border-slate-800 bg-slate-900/95 p-5 shadow-2xl shadow-slate-950/30"
    : "rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-xl shadow-slate-200/60";

  return (
    <DeliveryLayout>
      <section className="space-y-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] font-bold text-orange-500">Past Orders</p>
          <h1 className="mt-2 text-3xl font-black md:text-4xl">📜 Delivery History</h1>
          <p className={`mt-2 text-sm md:text-base ${isDark ? "text-slate-300" : "text-slate-600"}`}>A quick look at every completed delivery you have handled so far.</p>
        </div>

        {loading ? (
          <p className={isDark ? "text-slate-100" : "text-slate-700"}>Loading...</p>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {orders.map((item) => {
              const order = item.placed_order;
              return (
                <article key={item.id} className={cardClass}>
                  <img src={order.restaurant?.image_url} alt="Restaurant" className="h-52 w-full rounded-2xl object-cover" />
                  <div className="pt-4">
                    <h2 className="text-xl font-black">{order.restaurant?.restaurant_name}</h2>
                    <p className={`mt-2 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}><strong>Order ID:</strong> {order.id}</p>
                    <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}><strong>Customer:</strong> {order.customer_email}</p>
                    <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}><strong>Amount:</strong> ₹{order.total_price}</p>
                    <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}><strong>Address:</strong> {order.delivery_address}</p>
                    <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}><strong>Delivered At:</strong> {order.actual_delivery_time ? new Date(order.actual_delivery_time).toLocaleString() : "N/A"}</p>
                    <div className="mt-4 rounded-2xl bg-emerald-500 px-4 py-3 text-center text-sm font-bold text-white shadow-lg shadow-emerald-500/20">✅ Delivered</div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </DeliveryLayout>
  );
}
