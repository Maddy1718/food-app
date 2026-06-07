import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import DeliveryLayout from "../layouts/DeliveryLayout";

export default function AvailableOrders() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <DeliveryLayout>
      <section className="space-y-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] font-bold text-orange-500">Fresh picks</p>
          <h1 className="mt-2 text-3xl font-black md:text-4xl">Available Orders</h1>
          <p className={`mt-2 text-sm md:text-base ${isDark ? "text-slate-300" : "text-slate-600"}`}>Review the latest unassigned orders and accept them from this view.</p>
        </div>

        <article className={`rounded-3xl border p-6 shadow-2xl ${isDark ? "border-slate-800 bg-slate-900/90" : "border-slate-200 bg-white/95"}`}>
          <p className="text-sm text-orange-500 font-semibold">This screen is ready for the live order list while keeping the same Supabase logic.</p>
        </article>
      </section>
    </DeliveryLayout>
  );
}