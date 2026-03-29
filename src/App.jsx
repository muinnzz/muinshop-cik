import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "./supabase";

const products = [
  {
    category: "Virtual Private Server",
    name: "VPS R16 4 CORE",
    price: "Rp 8.000",
    image: "https://cdn-icons-png.flaticon.com/512/4248/4248443.png",
    description: "VPS hemat untuk kebutuhan ringan dan testing.",
    badge: "Best Seller",
  },
  {
    category: "Virtual Private Server",
    name: "VPS R16 8 CORE",
    price: "Rp 8.000",
    image: "https://cdn-icons-png.flaticon.com/512/4248/4248443.png",
    description: "VPS lebih kencang untuk kebutuhan menengah.",
    badge: "Populer",
  },
  {
    category: "Pterodactyl",
    name: "Pterodactyl Unlimited",
    price: "Rp 10.000",
    image: "https://cdn-icons-png.flaticon.com/512/1055/1055687.png",
    description: "Paket panel unlimited untuk kebutuhan game server.",
    badge: "Premium",
  },
  {
    category: "Pterodactyl",
    name: "Pterodactyl 9GB",
    price: "Rp 5.000",
    image: "https://cdn-icons-png.flaticon.com/512/1055/1055687.png",
    description: "Panel Pterodactyl dengan resource 9 GB.",
    badge: "Murah",
  },
];

const categories = ["Semua", "Virtual Private Server", "Pterodactyl"];
const PAKASIR_SLUG = import.meta.env.VITE_PAKASIR_SLUG || "muin2";

const parsePriceToNumber = (price) => {
  return Number(String(price).replace(/[^\d]/g, ""));
};

const statusStyles = {
  paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  failed: "border-rose-200 bg-rose-50 text-rose-700",
};

function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onClose, 2600);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const tone =
    toast.type === "error"
      ? "bg-rose-500"
      : toast.type === "success"
      ? "bg-emerald-500"
      : "bg-slate-800";

  return (
    <div className="fixed left-1/2 top-4 z-[120] w-[92%] max-w-sm -translate-x-1/2 animate-[fadeIn_.25s_ease]">
      <div
        className={`rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-2xl ${tone}`}
      >
        {toast.message}
      </div>
    </div>
  );
}

function SkeletonStat() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/15 bg-white/15 px-4 py-3 backdrop-blur-md">
      <div className="h-3 w-24 rounded bg-white/30" />
      <div className="mt-2 h-6 w-12 rounded bg-white/30" />
    </div>
  );
}

function SkeletonProduct() {
  return (
    <div className="animate-pulse overflow-hidden rounded-[28px] border border-white/70 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-3">
        <div className="h-[100px] rounded-[14px] bg-slate-200" />
      </div>
      <div className="mt-4 h-4 w-24 rounded bg-slate-200" />
      <div className="mt-3 h-5 w-28 rounded bg-slate-200" />
      <div className="mt-4 h-11 rounded-2xl bg-slate-200" />
    </div>
  );
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [guideLoading, setGuideLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [paidCount, setPaidCount] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);

  const [customerName, setCustomerName] = useState("");
  const [customerWhatsapp, setCustomerWhatsapp] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [session, setSession] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const topRef = useRef(null);
  const productsRef = useRef(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session ?? null);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchStats = async () => {
    setStatsLoading(true);

    const { count: total } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true });

    const { count: paid } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "paid");

    const { count: pending } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending");

    setTotalOrders(total || 0);
    setPaidCount(paid || 0);
    setTotalPending(pending || 0);
    setStatsLoading(false);
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.log("fetchOrders error:", error.message);
      setOrdersLoading(false);
      return;
    }

    setOrders(data || []);
    setOrdersLoading(false);
  };

  // TANPA POLLING
  useEffect(() => {
    fetchStats();
    if (session) {
      fetchOrders();
    }
  }, [session]);

  const refreshData = async ({ withOrders = false } = {}) => {
    await fetchStats();
    if (withOrders && session) {
      await fetchOrders();
    }
  };

  const filteredProducts = useMemo(() => {
    if (activeCategory === "Semua") return products;
    return products.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const groupedProducts = {
    "Virtual Private Server": filteredProducts.filter(
      (item) => item.category === "Virtual Private Server"
    ),
    Pterodactyl: filteredProducts.filter(
      (item) => item.category === "Pterodactyl"
    ),
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setMenuOpen(false);

    setTimeout(() => {
      const y =
        productsRef.current?.getBoundingClientRect().top + window.scrollY - 96;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }, 120);
  };

  const openGuideWithLoading = () => {
    setGuideLoading(true);
    setMenuOpen(false);

    setTimeout(() => {
      setGuideLoading(false);
      setShowGuide(true);
    }, 1500);
  };

  const handleCreateOrder = async () => {
    if (!selectedProduct) return;

    if (!customerName.trim() || !customerWhatsapp.trim()) {
      showToast("Isi nama dan WhatsApp dulu.", "error");
      return;
    }

    setSubmitting(true);

    const amount = parsePriceToNumber(selectedProduct.price);
    const orderId = `ORDER-${Date.now()}`;

    const { error } = await supabase.from("orders").insert([
      {
        order_id: orderId,
        product_name: selectedProduct.name,
        price: amount,
        customer_name: customerName,
        customer_whatsapp: customerWhatsapp,
        note: customerNote,
        status: "pending",
      },
    ]);

    setSubmitting(false);

    if (error) {
      showToast("Gagal simpan order: " + error.message, "error");
      return;
    }

    await refreshData({ withOrders: true });
    showToast("Mengarahkan ke pembayaran...", "success");

    const paymentUrl =
      `https://app.pakasir.com/pay/${PAKASIR_SLUG}/${amount}` +
      `?order_id=${encodeURIComponent(orderId)}` +
      `&qris_only=1` +
      `&redirect=${encodeURIComponent(window.location.origin)}`;

    window.location.href = paymentUrl;
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });

    if (error) {
      showToast("Login admin gagal: " + error.message, "error");
      return;
    }

    await fetchOrders();
    await fetchStats();
    showToast("Login admin berhasil.", "success");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowAdmin(false);
    setOrders([]);
    showToast("Logout admin berhasil.", "success");
  };

  const markAsPaid = async (id) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: "paid" })
      .eq("id", id);

    if (error) {
      showToast("Gagal update status: " + error.message, "error");
      return;
    }

    await refreshData({ withOrders: true });
    showToast("Order ditandai berhasil.", "success");
  };

  const markAsPending = async (id) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: "pending" })
      .eq("id", id);

    if (error) {
      showToast("Gagal update status: " + error.message, "error");
      return;
    }

    await refreshData({ withOrders: true });
    showToast("Order ditandai pending.", "success");
  };

  const deleteOrder = async (id) => {
    const confirmed = window.confirm("Hapus order ini?");
    if (!confirmed) return;

    const { error } = await supabase.from("orders").delete().eq("id", id);

    if (error) {
      showToast("Gagal hapus order: " + error.message, "error");
      return;
    }

    await refreshData({ withOrders: true });
    showToast("Order berhasil dihapus.", "success");
  };

  const ProductCard = ({ item }) => (
    <div
      className={`group overflow-hidden rounded-[28px] border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.10)] active:scale-[0.985] ${
        darkMode
          ? "border-slate-800 bg-slate-900 shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
          : "border-white/70 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
      }`}
    >
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-full bg-sky-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-sky-600">
            {item.badge}
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            {item.category === "Virtual Private Server" ? "VPS" : "PTERO"}
          </span>
        </div>

        <div
          className={`rounded-[20px] border p-3 ${
            darkMode
              ? "border-slate-700 bg-slate-800"
              : "border-slate-200 bg-slate-50"
          }`}
        >
          <div className="flex h-[100px] items-center justify-center overflow-hidden rounded-[14px] bg-white">
            <img
              src={item.image}
              alt={item.name}
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/140x100?text=No+Image";
              }}
              className="h-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        <div className="pt-4">
          <h3
            className={`min-h-[42px] text-[15px] font-extrabold leading-tight ${
              darkMode ? "text-white" : "text-slate-800"
            }`}
          >
            {item.name}
          </h3>

          <p className="mt-1 text-xs text-slate-400">{item.description}</p>

          <div className="mt-4">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Harga mulai
            </div>
            <p className="mt-1 text-[18px] font-extrabold text-sky-600">
              {item.price}
            </p>
          </div>

          <button
            onClick={() => setSelectedProduct(item)}
            className="mt-4 w-full rounded-2xl bg-sky-500 py-3 text-[13px] font-extrabold uppercase tracking-wide text-white transition-all duration-200 hover:bg-sky-600 active:scale-[0.98]"
          >
            Beli Sekarang
          </button>
        </div>
      </div>
    </div>
  );

  const Section = ({ title, data }) => {
    if (!data.length) return null;

    return (
      <section className="mt-10">
        <div className="mb-5 flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-sky-500" />
          <h2 className="text-[13px] font-extrabold uppercase tracking-[0.2em] text-sky-600">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {data.map((item, index) => (
            <ProductCard key={index} item={item} />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-slate-950 text-white" : "bg-[#eef3fb] text-slate-900"
      }`}
    >
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div
        className={`sticky top-0 z-40 backdrop-blur-md ${
          darkMode ? "bg-slate-950/80" : "bg-[#eef3fb]/80"
        }`}
      >
        <div ref={topRef} className="mx-auto max-w-sm px-3 pt-4">
          <div
            className={`rounded-[28px] border px-4 py-3 ${
              darkMode
                ? "border-slate-800 bg-slate-900 shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
                : "border-white/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
            }`}
          >
            <div className="flex items-center justify-between">
              <button
                onClick={() => setMenuOpen(true)}
                className="rounded-full p-2 text-slate-700 transition-all duration-200 active:scale-95 dark:text-white"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 7h16M4 12h16M4 17h16"
                  />
                </svg>
              </button>

              <div className="text-center">
                <h1
                  className={`text-[15px] font-extrabold uppercase tracking-[0.14em] ${
                    darkMode ? "text-white" : "text-slate-800"
                  }`}
                >
                  MUINSHOP CIK
                </h1>
                <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                  Premium Digital Store
                </p>
              </div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-500 text-white shadow-md transition-all duration-300 active:scale-95"
              >
                {darkMode ? "☀️" : "🌙"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-sm px-3 pb-6">
        <div className="mt-5 overflow-hidden rounded-[32px] bg-gradient-to-br from-sky-500 via-blue-500 to-violet-500 p-5 text-white shadow-[0_18px_40px_rgba(59,130,246,0.28)]">
          <div className="relative">
            <div className="absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute right-8 top-10 h-16 w-16 rounded-full bg-white/10 blur-xl" />

            <div className="relative">
              <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/90">
                Trusted Service
              </div>

              <h2 className="mt-3 text-[30px] font-extrabold leading-tight tracking-tight">
                Muinshop Cik
              </h2>
              <p className="mt-2 max-w-[250px] text-[15px] leading-7 text-white/90">
                Premium account, panel, dan server provider yang simpel, cepat,
                dan siap dipakai.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {statsLoading ? (
                  <>
                    <SkeletonStat />
                    <SkeletonStat />
                    <div className="col-span-2">
                      <SkeletonStat />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rounded-2xl border border-white/15 bg-white/15 px-4 py-3 backdrop-blur-md">
                      <div className="text-[11px] text-white/80">
                        Transaksi Berhasil
                      </div>
                      <div className="mt-1 text-lg font-extrabold">
                        {paidCount}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/15 bg-white/15 px-4 py-3 backdrop-blur-md">
                      <div className="text-[11px] text-white/80">
                        Total Order
                      </div>
                      <div className="mt-1 text-lg font-extrabold">
                        {totalOrders}
                      </div>
                    </div>

                    <div className="col-span-2 rounded-2xl border border-white/15 bg-white/15 px-4 py-3 backdrop-blur-md">
                      <div className="text-[11px] text-white/80">Pending</div>
                      <div className="mt-1 text-lg font-extrabold">
                        {totalPending}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7 flex gap-3 overflow-x-auto pb-2">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => handleCategoryClick(item)}
              className={`whitespace-nowrap rounded-full border px-5 py-2.5 text-[13px] font-bold transition-all duration-300 active:scale-[0.97] ${
                activeCategory === item
                  ? "border-sky-500 bg-sky-500 text-white shadow-md"
                  : darkMode
                  ? "border-slate-700 bg-slate-900 text-white"
                  : "border-white/70 bg-white text-slate-700 shadow-sm"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div ref={productsRef}>
          {statsLoading ? (
            <section className="mt-10">
              <div className="mb-5 flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-sky-500" />
                <h2 className="text-[13px] font-extrabold uppercase tracking-[0.2em] text-sky-600">
                  Virtual Private Server
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <SkeletonProduct />
                <SkeletonProduct />
              </div>
            </section>
          ) : (
            <>
              <Section
                title="Virtual Private Server"
                data={groupedProducts["Virtual Private Server"]}
              />
              <Section
                title="Pterodactyl"
                data={groupedProducts["Pterodactyl"]}
              />
            </>
          )}
        </div>

        <button
          onClick={() => window.open("https://wa.me/60166173129", "_blank")}
          className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-2xl text-white shadow-[0_10px_25px_rgba(34,197,94,0.35)] transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.52 3.48A11.86 11.86 0 0 0 12.07 0C5.5 0 .16 5.34.16 11.91c0 2.1.55 4.15 1.59 5.96L0 24l6.3-1.65a11.9 11.9 0 0 0 5.77 1.47h.01c6.57 0 11.91-5.34 11.91-11.91 0-3.18-1.24-6.16-3.47-8.43ZM12.08 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.74.98 1-3.65-.24-.38a9.86 9.86 0 0 1-1.52-5.25c0-5.46 4.44-9.9 9.91-9.9 2.64 0 5.12 1.03 6.99 2.91a9.83 9.83 0 0 1 2.9 6.99c0 5.46-4.44 9.9-9.89 9.9Zm5.43-7.42c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.39-1.46-.88-.79-1.48-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.08-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.48.71.31 1.27.49 1.7.63.71.22 1.36.19 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.69.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z" />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            onClick={() => setMenuOpen(false)}
          />

          <div className="relative h-full w-[82%] max-w-[360px] animate-[slideInLeft_.22s_ease] rounded-r-[30px] bg-white p-5 shadow-2xl">
            <div className="mb-7 flex items-center gap-4">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="avatar"
                className="h-12 w-12 rounded-2xl object-cover"
              />
              <div>
                <h3 className="text-xl font-extrabold text-slate-800">
                  Muinshop Cik
                </h3>
                <p className="text-sm text-slate-400">Premium Digital Service</p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  topRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex w-full items-center gap-4 rounded-[22px] bg-slate-100 px-5 py-4 text-left text-base font-bold text-slate-800 transition-all duration-200 active:scale-[0.98]"
              >
                <span>🏠</span>
                <span>Dashboard API</span>
              </button>

              <button
                onClick={openGuideWithLoading}
                className="flex w-full items-center justify-between rounded-[22px] border-2 border-dashed border-sky-400 px-5 py-4 text-left text-base font-bold text-slate-800 transition-all duration-200 active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <span>📘</span>
                  <span>Panduan</span>
                </div>
                <span className="rounded-full bg-sky-400 px-3 py-1 text-[10px] font-bold text-white">
                  WAJIB BACA
                </span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  productsRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex w-full items-center gap-4 rounded-[22px] px-5 py-4 text-left text-base font-bold text-slate-800 transition-all duration-200 active:scale-[0.98]"
              >
                <span>👜</span>
                <span>Produk Terjual</span>
              </button>

              {!session ? (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setShowAdmin(true);
                  }}
                  className="w-full rounded-[22px] bg-amber-500 px-5 py-4 text-left text-base font-bold text-white transition-all duration-200 active:scale-[0.98]"
                >
                  Login Admin
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setShowAdmin(true);
                    }}
                    className="w-full rounded-[22px] bg-amber-500 px-5 py-4 text-left text-base font-bold text-white transition-all duration-200 active:scale-[0.98]"
                  >
                    Panel Admin
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full rounded-[22px] bg-rose-500 px-5 py-4 text-left text-base font-bold text-white transition-all duration-200 active:scale-[0.98]"
                  >
                    Logout Admin
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-sm animate-[modalIn_.22s_ease] rounded-[24px] bg-white p-5 text-slate-900 shadow-2xl">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-[20px] bg-slate-50">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/160x120?text=No+Image";
                }}
                className="h-20 object-contain"
              />
            </div>

            <div className="text-center">
              <span className="rounded-full bg-sky-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-sky-600">
                {selectedProduct.badge}
              </span>
            </div>

            <h3 className="mt-4 text-center text-lg font-extrabold">
              {selectedProduct.name}
            </h3>

            <p className="mt-2 text-center text-[22px] font-extrabold text-sky-600">
              {selectedProduct.price}
            </p>

            <p className="mt-3 text-center text-sm leading-6 text-slate-500">
              {selectedProduct.description}
            </p>

            <input
              placeholder="Nama"
              className="mt-5 w-full rounded-2xl border px-4 py-3 outline-none transition focus:border-sky-400"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />

            <input
              placeholder="WhatsApp"
              className="mt-3 w-full rounded-2xl border px-4 py-3 outline-none transition focus:border-sky-400"
              value={customerWhatsapp}
              onChange={(e) => setCustomerWhatsapp(e.target.value)}
            />

            <textarea
              placeholder="Catatan"
              className="mt-3 w-full rounded-2xl border px-4 py-3 outline-none transition focus:border-sky-400"
              rows={3}
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
            />

            <button
              onClick={handleCreateOrder}
              disabled={submitting}
              className="mt-5 w-full rounded-2xl bg-sky-500 py-3.5 text-sm font-extrabold uppercase tracking-wide text-white transition-all duration-200 hover:bg-sky-600 disabled:opacity-60 active:scale-[0.98]"
            >
              {submitting ? "Memproses..." : "Lanjutkan Pembayaran"}
            </button>

            <button
              onClick={() => setSelectedProduct(null)}
              className="mt-3 w-full rounded-2xl bg-slate-200 py-3 font-bold text-slate-800 transition-all duration-200 hover:bg-slate-300 active:scale-[0.98]"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {showAdmin && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 px-4">
          <div className="max-h-[90vh] w-full max-w-lg animate-[modalIn_.22s_ease] overflow-y-auto rounded-[24px] bg-white p-5 text-slate-900 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-extrabold">
                {session ? "Panel Admin" : "Login Admin"}
              </h2>
              <button onClick={() => setShowAdmin(false)} className="text-xl">
                ✕
              </button>
            </div>

            {!session ? (
              <form onSubmit={handleAdminLogin}>
                <input
                  type="email"
                  placeholder="Email admin"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="mt-2 w-full rounded-2xl border px-4 py-3"
                />

                <input
                  type="password"
                  placeholder="Password admin"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="mt-3 w-full rounded-2xl border px-4 py-3"
                />

                <button
                  type="submit"
                  className="mt-4 w-full rounded-2xl bg-sky-500 py-3 font-bold text-white"
                >
                  Login
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                {ordersLoading ? (
                  <>
                    <div className="animate-pulse rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="h-4 w-40 rounded bg-slate-200" />
                      <div className="mt-2 h-3 w-28 rounded bg-slate-200" />
                      <div className="mt-2 h-3 w-32 rounded bg-slate-200" />
                    </div>
                    <div className="animate-pulse rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="h-4 w-40 rounded bg-slate-200" />
                      <div className="mt-2 h-3 w-28 rounded bg-slate-200" />
                      <div className="mt-2 h-3 w-32 rounded bg-slate-200" />
                    </div>
                  </>
                ) : orders.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                    <div className="text-4xl">📦</div>
                    <div className="mt-3 text-base font-bold text-slate-700">
                      Belum ada order
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      Order yang masuk akan tampil di sini.
                    </p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="font-extrabold">{order.product_name}</div>
                      <div className="mt-1 text-sm">Harga: {order.price}</div>
                      <div className="text-sm">Nama: {order.customer_name}</div>
                      <div className="text-sm">
                        WhatsApp: {order.customer_whatsapp}
                      </div>
                      <div className="text-sm">Catatan: {order.note || "-"}</div>
                      <div className="text-sm">
                        Order ID: {order.order_id || "-"}
                      </div>

                      <div className="mt-3">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase ${
                            statusStyles[order.status] ||
                            "border-slate-200 bg-slate-100 text-slate-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          onClick={() => markAsPaid(order.id)}
                          className="rounded-xl bg-green-500 px-4 py-2 text-sm font-bold text-white"
                        >
                          Tandai Berhasil
                        </button>

                        <button
                          onClick={() => markAsPending(order.id)}
                          className="rounded-xl bg-yellow-500 px-4 py-2 text-sm font-bold text-white"
                        >
                          Pending
                        </button>

                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-bold text-white"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {guideLoading && (
        <div className="fixed inset-0 z-[79] flex items-center justify-center bg-[#eef3fb]">
          <div className="text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-sky-500 [animation-delay:0ms]"></span>
              <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-sky-500 [animation-delay:200ms]"></span>
              <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-sky-500 [animation-delay:400ms]"></span>
            </div>
            <h2 className="text-[18px] font-extrabold tracking-[0.2em] text-slate-800">
              Muinshop Cik
            </h2>
          </div>
        </div>
      )}

      {showGuide && (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-[#eaf4ff] px-4 py-6">
          <div className="mx-auto max-w-md animate-[fadeIn_.22s_ease]">
            <button
              onClick={() => setShowGuide(false)}
              className="mb-4 rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow"
            >
              ← Kembali
            </button>

            <div className="mb-6 text-center">
              <h1 className="text-4xl font-extrabold text-sky-600">
                Muinshop Cik
              </h1>
              <div className="mt-2 text-slate-400">-------------</div>
            </div>

            <div className="overflow-hidden rounded-[24px] bg-white shadow-sm">
              <div className="border-b bg-slate-50 px-6 py-5">
                <h2 className="text-xl font-extrabold text-slate-800">
                  🛒 PANDUAN CHECKOUT
                </h2>
              </div>

              <div className="space-y-6 px-6 py-6 text-slate-600">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500 font-bold text-white">
                    1
                  </div>
                  <p className="text-base leading-7">
                    Isi <span className="font-bold text-slate-700">Email & WhatsApp</span> aktif untuk pengiriman data produk.
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500 font-bold text-white">
                    2
                  </div>
                  <p className="text-base leading-7">
                    Klik tombol pembayaran dan <span className="font-bold text-slate-700">Scan QRIS</span> yang muncul.
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500 font-bold text-white">
                    3
                  </div>
                  <p className="text-base leading-7">
                    Tunggu sistem <span className="font-bold text-slate-700">Pakasir</span> memproses pembayaran anda.
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500 font-bold text-white">
                    4
                  </div>
                  <p className="text-base leading-7">
                    Setelah transaksi selesai, anda akan diarahkan kembali ke website.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[24px] border border-orange-200 bg-orange-50 px-6 py-5 shadow-sm">
              <h3 className="text-xl font-extrabold text-orange-600">
                ⚠️ PENTING: JANGAN REFRESH!
              </h3>
              <p className="mt-3 text-base leading-7 text-orange-700">
                Dilarang menutup atau memuat ulang halaman saat proses transaksi.
                Jika ada kendala, hubungi CS segera.
              </p>
            </div>

            <button
              onClick={() => setShowGuide(false)}
              className="mt-6 w-full rounded-[22px] bg-sky-600 px-6 py-4 text-lg font-extrabold text-white shadow"
            >
              SAYA MENGERTI, LANJUTKAN ✅
            </button>

            <div className="mt-8 pb-8 text-center text-xl font-extrabold text-slate-400">
              MUINSHOP CIK
            </div>
          </div>
        </div>
      )}
    </div>
  );
      }
