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
  ThemeContext,
} from "../context/ThemeContext";

import {
  fetchOrders,
} from "../services/api/orderService";

import {
  Badge,
  Button,
  Card,
  EmptyState,
  PageHeader,
  Skeleton,
  StatsCard,
} from "../components/ui";

import {
  supabase,
} from "../services/supabase";

import {
  getStatusColorFromOrder,
  getStatusName,
  ORDER_STATUS_LABELS,
} from "../utils/orderStatus";

function Orders() {

  const { user } =
    useContext(AuthContext);

  const { darkMode } =
    useContext(ThemeContext);

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

          console.log(
            "Fetching customer orders",
            {
              userEmail:
                user.email,
            }
          );

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

    if (!user) {
      return;
    }

    const orderChannel =
      supabase

        .channel(
          `customer-orders-${user.id}`
        )

        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "placed_order",
          },
          (payload) => {

            const changedEmail =
              payload.new?.customer_email ||
              payload.old?.customer_email;

            if (
              changedEmail ===
              user.email
            ) {

              console.log(
                "Realtime customer order update",
                {
                  payload,
                  userEmail:
                    user.email,
                  newStatusId:
                    payload.new?.status_id,
                  newStatusName:
                    payload.new?.status_catalog?.status_name,
                }
              );

              loadOrders();
            }
          }
        )

        .subscribe();

    return () => {
      supabase.removeChannel(
        orderChannel
      );
    };

  }, [user]);

  return (

    <MainLayout>

      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}>

        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          <div className="mb-8">
            <PageHeader
              eyebrow="Customer Order Tracking"
              title="Your Orders"
              description="Track your food from restaurant to doorstep with a live, polished delivery timeline."
            />
          </div>

          {!user ? (

            <div className="mt-8">
              <EmptyState
                title="Sign in to view your orders"
                description="Log in to follow live order status, delivery updates, and your order summary."
                action={<Button variant="primary">Continue to login</Button>}
              />
            </div>

          ) : loading ? (

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <Skeleton variant="card" className="h-80" />
              <div className="space-y-4">
                <Skeleton variant="card" className="h-40" />
                <Skeleton variant="card" className="h-40" />
              </div>
            </div>

          ) : orders.length === 0 ? (

            <div className="mt-8">
              <EmptyState
                title="No orders yet"
                description="Your recent orders will appear here with live tracking and delivery updates."
              />
            </div>

          ) : (

            orders.map((order) => {

              const orderStatus =
                getStatusName(order);

              const orderDate =
                new Date(
                  order.order_time
                ).toLocaleString();

              const timelineSteps = [
                {
                  id: 1,
                  label:
                    ORDER_STATUS_LABELS[1],
                },
                {
                  id: 2,
                  label:
                    ORDER_STATUS_LABELS[2],
                },
                {
                  id: 6,
                  label:
                    ORDER_STATUS_LABELS[6],
                },
                {
                  id: 3,
                  label:
                    ORDER_STATUS_LABELS[3],
                },
                {
                  id: 7,
                  label:
                    ORDER_STATUS_LABELS[7],
                },
                {
                  id: 8,
                  label:
                    ORDER_STATUS_LABELS[8],
                },
                {
                  id: 4,
                  label:
                    ORDER_STATUS_LABELS[4],
                },
              ];

              const currentStatusId =
                Number(
                  order?.status_id ??
                    order?.status_catalog?.id ??
                    1
                );

              const currentStepIndex =
                timelineSteps.findIndex(
                  (step) =>
                    step.id ===
                    currentStatusId
                );

              const activeStepIndex =
                currentStepIndex >= 0
                  ? currentStepIndex
                  : timelineSteps.length - 1;

              const statusColor =
                getStatusColorFromOrder(
                  order
                );

              return (
                <Card key={order.id} className="mb-8 h-full min-w-0 overflow-hidden" padding="none">
                  <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
                    <section className="min-w-0 p-6 md:p-8">
                      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200/80 pb-5 dark:border-slate-800">
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-orange-500">Order #{order.id}</p>
                          <h2 className="mt-2 max-w-full text-2xl font-black break-words md:text-3xl">{order?.restaurant?.restaurant_name || "Restaurant"}</h2>
                          <p className={`mt-1 text-sm break-words ${darkMode ? "text-slate-300" : "text-slate-500"}`}>{orderDate}</p>
                        </div>
                        <Badge tone="primary" className="max-w-full whitespace-normal text-center" style={{ backgroundColor: statusColor, color: "white" }}>{orderStatus}</Badge>
                      </div>

                      <div className="mt-6 grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
                        <StatsCard className="h-full" label="Items" value={order?.items?.length || 1} icon="🍽️" />
                        <StatsCard className="h-full" label="Delivery Fee" value={`₹ ${order.delivery_fee ?? 0}`} icon="🚚" />
                        <StatsCard className="h-full" label="Total" value={`₹ ${order.total_price ?? 0}`} icon="💳" />
                        <StatsCard className="h-full" label="Status" value={orderStatus} icon="⚡" />
                      </div>

                      <div className="mt-6 rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 via-white to-violet-500/10 p-5 shadow-sm dark:border-orange-400/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-orange-500">Delivery Tracker</p>
                            <h3 className="mt-1 text-xl font-black">Live order progress</h3>
                          </div>
                          <Badge tone="accent">{orderStatus}</Badge>
                        </div>

                        <div className="space-y-4">
                          {timelineSteps.map((step, index) => {
                            const isCompleted = index < activeStepIndex;
                            const isCurrent = index === activeStepIndex;
                            return (
                              <div key={step.id} className="flex items-start gap-4">
                                <div className="flex flex-col items-center">
                                  <div className={`mt-1 h-4 w-4 rounded-full border-2 ${isCompleted ? "border-emerald-500 bg-emerald-500" : isCurrent ? "border-orange-500 bg-orange-500" : "border-slate-300 bg-slate-200 dark:border-slate-600 dark:bg-slate-800"}`} />
                                  {index < timelineSteps.length - 1 && <div className={`mt-1 w-px flex-1 min-h-[28px] ${isCompleted ? "bg-emerald-400" : "bg-slate-200 dark:bg-slate-700"}`} />}
                                </div>
                                <div className={`w-full min-w-0 rounded-2xl border p-4 shadow-sm transition ${isCompleted ? (darkMode ? "border-emerald-500/30 bg-emerald-500/10" : "border-emerald-500/20 bg-emerald-50") : isCurrent ? (darkMode ? "border-orange-400/40 bg-orange-500/10" : "border-orange-400/40 bg-orange-50") : (darkMode ? "border-slate-700 bg-slate-800/70" : "border-slate-200 bg-white")}`}>
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                      <p className={`text-sm font-black break-words ${isCompleted ? "text-emerald-700 dark:text-emerald-300" : isCurrent ? "text-orange-700 dark:text-orange-200" : darkMode ? "text-slate-200" : "text-slate-500"}`}>{step.label}</p>
                                      <p className={`mt-1 text-xs break-words ${isCurrent ? "text-orange-700 dark:text-orange-100" : "text-slate-500 dark:text-slate-400"}`}>{isCompleted ? "Completed" : isCurrent ? "In progress" : "Upcoming"}</p>
                                    </div>
                                    <Badge tone={isCompleted ? "success" : isCurrent ? "primary" : "neutral"} className="shrink-0 whitespace-normal text-center">{isCompleted ? "Done" : isCurrent ? "Live" : "Next"}</Badge>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </section>

                    <aside className="min-w-0 border-t border-slate-200/80 bg-slate-50/80 p-6 md:p-8 dark:border-slate-800 dark:bg-slate-950/60">
                      <div className="space-y-6">
                        <Card padding="md" className="h-full min-w-0 rounded-3xl">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-orange-500">Restaurant</p>
                          <h3 className="mt-2 text-xl font-black break-words">{order?.restaurant?.restaurant_name || "Restaurant"}</h3>
                          <p className={`mt-2 text-sm break-words ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Freshly prepared and ready for your next delivery milestone.</p>
                        </Card>

                        <Card padding="md" className="h-full min-w-0 rounded-3xl">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-violet-500">Delivery Partner</p>
                          <h3 className="mt-2 text-xl font-black break-words">{order?.delivery_partner_name || "Partner on the way"}</h3>
                          <p className={`mt-2 text-sm break-words ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Your order is being handled by a live delivery partner and will update automatically.</p>
                        </Card>

                        <Card padding="md" className="h-full min-w-0 rounded-3xl">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-500">Order Summary</p>
                          <div className="mt-4 space-y-3 text-sm">
                            <div className="flex items-start justify-between gap-3"><span className={`min-w-0 break-words ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Food Price</span><strong className="shrink-0">₹ {order.price}</strong></div>
                            <div className="flex items-start justify-between gap-3"><span className={`min-w-0 break-words ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Delivery Fee</span><strong className="shrink-0">₹ {order.delivery_fee}</strong></div>
                            <div className="flex items-start justify-between gap-3"><span className={`min-w-0 break-words ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Platform Fee</span><strong className="shrink-0">₹ {order.platform_fee}</strong></div>
                            <div className="flex items-start justify-between gap-3"><span className={`min-w-0 break-words ${darkMode ? "text-slate-300" : "text-slate-600"}`}>GST</span><strong className="shrink-0">₹ {order.gst_amount}</strong></div>
                            <div className="flex items-start justify-between gap-3"><span className={`min-w-0 break-words ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Packing</span><strong className="shrink-0">₹ {order.packing_charge}</strong></div>
                            <div className="flex items-start justify-between gap-3 border-t border-slate-200 pt-3 text-base font-black dark:border-slate-800"><span className="min-w-0 break-words">Discount</span><strong className="shrink-0">₹ {order.discount}</strong></div>
                            <div className="flex items-start justify-between gap-3 text-xl font-black"><span className="min-w-0 break-words">Total</span><strong className="shrink-0">₹ {order.total_price}</strong></div>
                          </div>
                        </Card>

                        <Card padding="md" className="h-full min-w-0 rounded-3xl">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-orange-500">Delivery Address</p>
                          <p className={`mt-3 text-sm break-words ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{order.delivery_address}</p>
                        </Card>
                      </div>
                    </aside>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

    </MainLayout>
  );
}

export default Orders;