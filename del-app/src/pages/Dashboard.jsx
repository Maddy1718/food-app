import { useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";

import { ThemeContext } from "../context/ThemeContext";
import DeliveryLayout from "../layouts/DeliveryLayout";
import "./Dashboard.css";

export default function Dashboard() {

  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState({
      totalDeliveries: 0,
      completedToday: 0,
      earningsToday: 0,
    });

  const [statsLoading, setStatsLoading] =
    useState(true);

  const [statsError, setStatsError] =
    useState("");

  useEffect(() => {

    const orderChannel =
      supabase
        .channel("dashboard-placed-order-updates")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "placed_order",
          },
          (payload) => {
            if (payload.new?.status_id === 6) {
              fetchAvailableOrders();
            }
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "placed_order",
          },
          (payload) => {
            const oldStatus =
              payload.old?.status_id;
            const newStatus =
              payload.new?.status_id;

            if (
              newStatus === 6 ||
              oldStatus === 6
            ) {
              fetchAvailableOrders();
            }
          }
        )
        .subscribe();

    const assignmentChannel =
      supabase
        .channel("dashboard-assignment-updates")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "delivery_assignment",
          },
          () => {
            fetchAvailableOrders();
            fetchDashboardStats();
          }
        )
        .subscribe();

    Promise.all([
      fetchAvailableOrders(),
      fetchDashboardStats(),
    ]);

    return () => {
      supabase.removeChannel(orderChannel);
      supabase.removeChannel(assignmentChannel);
    };

  }, []);

  async function fetchAvailableOrders() {

    setLoading(true);

    try {

      const { data, error } =
        await supabase
          .from("placed_order")
          .select(`
            *,
            restaurant (
              restaurant_name,
              image_url
            )
          `)
          .eq("status_id", 6);

      if (error) {

        throw error;
      }

      setOrders(data || []);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
    }
  }

  async function fetchDashboardStats() {

    setStatsLoading(true);
    setStatsError("");

    try {

      const partnerId =
        localStorage.getItem(
          "deliveryPartnerId"
        );

      if (!partnerId) {

        setStats({
          totalDeliveries: 0,
          completedToday: 0,
          earningsToday: 0,
        });

        return;
      }

      const [assignmentsResult] =
        await Promise.all([
          supabase
            .from("delivery_assignment")
            .select(`
              order_id,
              placed_order (
                id,
                status_id,
                created_at,
                total_price
              )
            `)
            .eq(
              "delivery_partner_id",
              partnerId
            ),
        ]);

      if (assignmentsResult.error) {

        throw assignmentsResult.error;
      }

      const today = new Date();
      const startOfToday =
        new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );
      const endOfToday =
        new Date(
          startOfToday.getTime() +
            24 * 60 * 60 * 1000
        );

      const assignedOrders =
        assignmentsResult.data || [];

      const deliveredOrders =
        assignedOrders.filter(
          (item) =>
            item.placed_order?.status_id === 4
        );

      const completedToday =
        deliveredOrders.filter(
          (item) => {
            const deliveredAt =
              item.placed_order?.created_at;

            if (!deliveredAt) return false;

            const date = new Date(deliveredAt);

            return (
              date >= startOfToday &&
              date < endOfToday
            );
          }
        ).length;

      setStats({
        totalDeliveries:
          deliveredOrders.length,
        completedToday,
        earningsToday:
          completedToday * 40,
      });

    } catch (err) {

      console.error(err);
      setStatsError(
        "Unable to load dashboard statistics right now."
      );

    } finally {

      setStatsLoading(false);
    }
  }

  async function acceptOrder(orderId) {

    try {

      const partnerId =
        localStorage.getItem(
          "deliveryPartnerId"
        );

      if (!partnerId) {

        alert(
          "Delivery Partner not found"
        );

        return;
      }

      const confirmAccept =
        window.confirm(
          "Do you want to accept this order?"
        );

      if (!confirmAccept) {
        return;
      }

      const {
        error: assignmentError,
      } = await supabase
        .from("delivery_assignment")
        .insert([
          {
            order_id: orderId,
            delivery_partner_id:
              parseInt(partnerId),
          },
        ]);

      if (assignmentError) {

        if (
          assignmentError.message
            ?.toLowerCase()
            .includes("unique")
        ) {

          alert(
            "This order has already been accepted by another delivery partner."
          );

          fetchAvailableOrders();

          return;
        }

        throw assignmentError;
      }

      const {
        error: orderError,
      } = await supabase
        .from("placed_order")
        .update({
          status_id: 3,
        })
        .eq(
          "id",
          orderId
        );

      if (orderError)
        throw orderError;

      alert(
        "Order Accepted Successfully"
      );

      fetchAvailableOrders();

    } catch (err) {

      console.error(err);

      alert(
        err.message
      );
    }
  }

  const cardClass = isDark
    ? "rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl shadow-slate-950/30"
    : "rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-xl shadow-slate-200/60";

  return (
    <DeliveryLayout>
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] font-bold text-orange-500">Overview</p>
            <h1 className="mt-2 text-3xl font-black md:text-4xl">Dashboard</h1>
            <p className={`mt-2 text-sm md:text-base ${isDark ? "text-slate-300" : "text-slate-600"}`}>Track deliveries, earnings and available orders with a cleaner partner dashboard.</p>
          </div>
          <div className={`rounded-2xl border px-4 py-3 text-xs font-semibold ${isDark ? "border-orange-500/20 bg-orange-500/10 text-orange-200" : "border-orange-200 bg-orange-50 text-orange-700"}`}>Live updates enabled</div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Deliveries", value: statsLoading ? "..." : stats.totalDeliveries, hint: "Completed orders assigned to you" },
            { label: "Available Orders", value: orders.length, hint: "Ready for pickup near you" },
            { label: "Completed Today", value: statsLoading ? "..." : stats.completedToday, hint: "Orders delivered in the last 24h" },
            { label: "Earnings Today", value: statsLoading ? "..." : `₹${stats.earningsToday}`, hint: "Estimated earnings from completed deliveries" },
          ].map((item) => (
            <article key={item.label} className={cardClass}>
              <p className="text-[11px] uppercase tracking-[0.25em] text-orange-500 font-bold">{item.label}</p>
              <h2 className="mt-2 text-3xl font-black">{item.value}</h2>
              <p className={`mt-1 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>{item.hint}</p>
            </article>
          ))}
        </div>

        {statsError && <p className="text-rose-300">{statsError}</p>}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-black md:text-2xl">🔥 Available Orders Near You</h2>
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${isDark ? "border-violet-500/20 bg-violet-500/10 text-violet-100" : "border-violet-200 bg-violet-50 text-violet-700"}`}>Fresh orders update instantly</span>
        </div>

        {loading ? (
          <p className={isDark ? "text-slate-100" : "text-slate-700"}>Loading...</p>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {orders.map((order) => (
              <article key={order.id} className={cardClass}>
                <img src={order.restaurant?.image_url} alt="Restaurant" className="h-52 w-full rounded-2xl object-cover" />
                <div className="pt-4">
                  <h3 className="text-xl font-black">{order.restaurant?.restaurant_name}</h3>
                  <p className={`mt-2 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}><strong>Order ID:</strong> {order.id}</p>
                  <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}><strong>Customer:</strong> {order.customer_email}</p>
                  <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}><strong>Amount:</strong> ₹{order.total_price}</p>
                  <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}><strong>Address:</strong> {order.delivery_address}</p>
                  <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}><strong>Status:</strong> Ready For Pickup</p>
                  <button onClick={() => acceptOrder(order.id)} className="mt-4 w-full rounded-2xl bg-orange-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-400">Accept Order</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </DeliveryLayout>
  );
}

