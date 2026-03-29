import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "./supabase";

const products = [
  {
    category: "Virtual Private Server",
    name: "VPS R16 4 CORE",
    price: "Rp 8.000",
    image: "https://i.ibb.co/0yQ2z3B/vps.png",
    description: "VPS hemat untuk kebutuhan ringan dan testing.",
  },
  {
    category: "Virtual Private Server",
    name: "VPS R16 8 CORE",
    price: "Rp 8.000",
    image: "https://i.ibb.co/0yQ2z3B/vps.png",
    description: "VPS lebih kencang untuk kebutuhan menengah.",
  },
  {
    category: "Pterodactyl",
    name: "Pterodactyl Unlimited",
    price: "Rp 10.000",
    image: "https://i.ibb.co/7QpKsCX/ptero.png",
    description: "Paket panel unlimited untuk kebutuhan game server.",
  },
  {
    category: "Pterodactyl",
    name: "Pterodactyl 9GB",
    price: "Rp 5.000",
    image: "https://i.ibb.co/7QpKsCX/ptero.png",
    description: "Panel Pterodactyl dengan resource 9 GB.",
  },
];

const categories = ["Semua", "Virtual Private Server", "Pterodactyl"];

function useTypingLoop(text, speed = 70, pause = 1200) {
  const [displayed, setDisplayed] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    let deleting = false;
    let intervalId;
    let timeoutId;

    const start = () => {
      intervalId = setInterval(() => {
        if (!deleting) {
          setDisplayed(text.slice(0, i + 1));
          i += 1;

          if (i === text.length) {
            clearInterval(intervalId);
            timeoutId = setTimeout(() => {
              deleting = true;
              start();
            }, pause);
          }
        } else {
          setDisplayed(text.slice(0, i - 1));
          i -= 1;

          if (i === 0) {
            clearInterval(intervalId);
            deleting = false;
            timeoutId = setTimeout(() => {
              start();
            }, 300);
          }
        }
      }, speed);
    };

    start();

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [text, speed, pause]);

  useEffect(() => {
    const cursor = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursor);
  }, []);

  return { displayed, showCursor };
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const [paidCount, setPaidCount] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPending, setTotalPending] = useState(0);

  const [customerName, setCustomerName] = useState("");
  const [customerWhatsapp, setCustomerWhatsapp] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [session, setSession] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [orders, setOrders] = useState([]);

  const topRef = useRef(null);
  const productsRef = useRef(null);

  const { displayed, showCursor } = useTypingLoop(
    "Premium Account & Game Server Provider ✨"
  );

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSession(data.session ?? null);
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
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.log("fetchOrders error:", error.message);
      return;
    }

    setOrders(data || []);
  };

  useEffect(() => {
    fetchStats();

    const interval = setInterval(() => {
      fetchStats();
      if (session) fetchOrders();
    }, 3000);

    return () => clearInterval(interval);
  }, [session]);

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
        productsRef.current?.getBoundingClientRect().top + window.scrollY - 12;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }, 150);
  };

  const handleCreateOrder = async () => {
    if (!selectedProduct) return;

    if (!customerName.trim() || !customerWhatsapp.trim()) {
      alert("Isi nama dan WhatsApp dulu.");
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from("orders").insert([
      {
        product_name: selectedProduct.name,
        price: selectedProduct.price,
        customer_name: customerName,
        customer_whatsapp: customerWhatsapp,
        note: customerNote,
        status: "pending",
      },
    ]);

    setSubmitting(false);

    if (error) {
      alert("Gagal simpan order: " + error.message);
      return;
    }

    const message = `Halo, saya ingin order ${selectedProduct.name}
Nama: ${customerName}
WhatsApp: ${customerWhatsapp}
Catatan: ${customerNote || "-"}`;

    window.open(
      `https://wa.me/60166173129?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    setCustomerName("");
    setCustomerWhatsapp("");
    setCustomerNote("");
    setSelectedProduct(null);

    alert("Order berhasil dihantar.");
    fetchStats();
    if (session) fetchOrders();
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });

    if (error) {
      alert("Login admin gagal: " + error.message);
      return;
    }

    await fetchOrders();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowAdmin(false);
  };

  const markAsPaid = async (id) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: "paid" })
      .eq("id", id);

    if (error) {
      alert("Gagal update status: " + error.message);
      return;
    }

    await fetchOrders();
    await fetchStats();
  };

  const markAsPending = async (id) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: "pending" })
      .eq("id", id);

    if (error) {
      alert("Gagal update status: " + error.message);
      return;
    }

    await fetchOrders();
    await fetchStats();
  };

  const deleteOrder = async (id) => {
    const confirmed = window.confirm("Hapus order ini?");
    if (!confirmed) return;

    const { error } = await supabase.from("orders").delete().eq("id", id);

    if (error) {
      alert("Gagal hapus order: " + error.message);
      return;
    }

    await fetchOrders();
    await fetchStats();
  };

  const ProductCard = ({ item }) => (
    <div
      className={`rounded-[28px] border p-4 shadow-sm ${
        darkMode
          ? "border-slate-700 bg-slate-900"
          : "border-slate-200 bg-white"
      }`}
    >
      <div
        className={`rounded-[22px] border p-4 ${
          darkMode
            ? "border-slate-700 bg-slate-800"
            : "border-slate-200 bg-slate-50"
        }`}
      >
        <div className="relative flex h-[115px] items-center justify-center overflow-hidden rounded-xl bg-white">
          <span className="absolute left-3 top-3 rounded-full bg-rose-400 px-4 py-1 text-xs font-bold text-white">
            SOLD OUT
          </span>
          <img
            src={item.image}
            alt={item.name}
            className="h-full object-contain"
          />
        </div>
      </div>

      <div className="pt-5">
        <h3
          className={`min-h-[56px] text-[18px] font-extrabold leading-tight ${
            darkMode ? "text-white" : "text-slate-800"
          }`}
        >
          {item.name}
        </h3>

        <p className="mt-4 text-[18px] font-extrabold text-sky-600">
          {item.price}
        </p>

        <button
          onClick={() => setSelectedProduct(item)}
          className="mt-5 w-full rounded-[18px] border border-sky-200 bg-sky-50 py-3 text-lg font-bold uppercase tracking-wide text-sky-600"
        >
          Detail
        </button>
      </div>
    </div>
  );

  const Section = ({ title, data }) => {
    if (!data.length) return null;

    return (
      <section className="mt-10">
        <h2 className="mb-5 text-[18px] font-extrabold uppercase tracking-[0.25em] text-sky-600">
          {title}
        </h2>

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
      className={`min-h-screen ${
        darkMode ? "bg-slate-950 text-white" : "bg-[#f4f6fb] text-slate-900"
      }`}
    >
      <div ref={topRef} className="mx-auto max-w-md px-4 py-5">
        {/* Navbar */}
        <div
          className={`rounded-[32px] border px-5 py-4 shadow-sm ${
            darkMode
              ? "border-slate-800 bg-slate-900"
              : "border-white/80 bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <button
              onClick={() => setMenuOpen(true)}
              className="rounded-full p-2 text-slate-700 dark:text-white"
            >
              <svg
                className="h-7 w-7"
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

            <h1
              className={`text-[18px] font-extrabold uppercase tracking-[0.14em] ${
                darkMode ? "text-white" : "text-slate-800"
              }`}
            >
              MUIN SHOP CIK
            </h1>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-white shadow-md"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        {/* Hero */}
        <div className="mt-7 overflow-hidden rounded-[34px] bg-gradient-to-br from-sky-500 via-blue-500 to-violet-500 p-6 text-white shadow-lg">
          <div className="flex min-h-[190px] flex-col justify-between">
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight">
                Muin Shop Cik
              </h2>
              <p className="mt-2 min-h-[28px] max-w-[290px] text-lg text-white/90">
                {displayed}
                <span className={`${showCursor ? "opacity-100" : "opacity-0"}`}>
                  |
                </span>
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/18 px-4 py-3 backdrop-blur-sm">
                <div className="text-xs text-white/80">Transaksi Berhasil</div>
                <div className="mt-1 text-xl font-extrabold">{paidCount}</div>
              </div>

              <div className="rounded-2xl bg-white/18 px-4 py-3 backdrop-blur-sm">
                <div className="text-xs text-white/80">Total Order</div>
                <div className="mt-1 text-xl font-extrabold">{totalOrders}</div>
              </div>

              <div className="col-span-2 rounded-2xl bg-white/18 px-4 py-3 backdrop-blur-sm">
                <div className="text-xs text-white/80">Pending</div>
                <div className="mt-1 text-xl font-extrabold">{totalPending}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-3 overflow-x-auto pb-2">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => handleCategoryClick(item)}
              className={`whitespace-nowrap rounded-full border px-6 py-4 text-lg font-bold ${
                activeCategory === item
                  ? "border-sky-500 bg-sky-500 text-white shadow-md"
                  : darkMode
                  ? "border-slate-700 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Content */}
        <div ref={productsRef}>
          <Section
            title="Virtual Private Server"
            data={groupedProducts["Virtual Private Server"]}
          />
          <Section title="Pterodactyl" data={groupedProducts["Pterodactyl"]} />
        </div>

        {/* Floating */}
        <button
          onClick={() => window.open("https://wa.me/60166173129", "_blank")}
          className="fixed bottom-6 right-6 z-30 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-3xl text-white shadow-lg"
        >
          🎧
        </button>
      </div>

      {/* Sidebar */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"
            onClick={() => setMenuOpen(false)}
          />

          <div className="relative h-full w-[82%] max-w-[380px] rounded-r-[34px] bg-white p-6 shadow-2xl">
            <div className="mb-8 flex items-center gap-4">
              <img
                src="https://i.ibb.co/G0JwJ4H/anime-avatar.jpg"
                alt="avatar"
                className="h-14 w-14 rounded-2xl object-cover"
              />
              <div>
                <h3 className="text-2xl font-extrabold text-slate-800">
                  Muin Shop Cik
                </h3>
                <p className="text-slate-400">Premium Digital Service</p>
              </div>
            </div>

            <div className="space-y-5">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  topRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex w-full items-center gap-4 rounded-[24px] bg-slate-100 px-6 py-5 text-left text-2xl font-extrabold text-slate-800"
              >
                <span>🏠</span>
                <span>Dashboard API</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  alert("Bahagian panduan belum disambungkan lagi.");
                }}
                className="flex w-full items-center justify-between rounded-[24px] border-2 border-dashed border-sky-400 px-6 py-5 text-left text-2xl font-extrabold text-slate-800"
              >
                <div className="flex items-center gap-4">
                  <span>📘</span>
                  <span>Panduan</span>
                </div>
                <span className="rounded-full bg-sky-400 px-4 py-1 text-sm font-bold text-white">
                  WAJIB BACA
                </span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  productsRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex w-full items-center gap-4 rounded-[24px] px-6 py-5 text-left text-2xl font-extrabold text-slate-800"
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
                  className="w-full rounded-[24px] bg-amber-500 px-6 py-5 text-left text-2xl font-extrabold text-white"
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
                    className="w-full rounded-[24px] bg-amber-500 px-6 py-5 text-left text-2xl font-extrabold text-white"
                  >
                    Panel Admin
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full rounded-[24px] bg-rose-500 px-6 py-5 text-left text-2xl font-extrabold text-white"
                  >
                    Logout Admin
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Order */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-[28px] bg-white p-5 text-slate-900">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="mx-auto h-28 object-contain"
            />

            <h3 className="mt-4 text-xl font-extrabold">
              {selectedProduct.name}
            </h3>

            <p className="mt-2 font-bold text-sky-500">{selectedProduct.price}</p>

            <p className="mt-3 text-sm text-slate-500">
              {selectedProduct.description}
            </p>

            <input
              placeholder="Nama"
              className="mt-4 w-full rounded-xl border px-4 py-3"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />

            <input
              placeholder="WhatsApp"
              className="mt-3 w-full rounded-xl border px-4 py-3"
              value={customerWhatsapp}
              onChange={(e) => setCustomerWhatsapp(e.target.value)}
            />

            <textarea
              placeholder="Catatan"
              className="mt-3 w-full rounded-xl border px-4 py-3"
              rows={3}
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
            />

            <button
              onClick={handleCreateOrder}
              disabled={submitting}
              className="mt-5 w-full rounded-xl bg-sky-500 py-3 font-bold text-white disabled:opacity-60"
            >
              {submitting ? "Mengirim..." : "Order via WhatsApp"}
            </button>

            <button
              onClick={() => setSelectedProduct(null)}
              className="mt-3 w-full rounded-xl bg-slate-200 py-3 font-bold text-slate-800"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Admin Panel */}
      {showAdmin && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 px-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[28px] bg-white p-5 text-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-extrabold">
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
                  className="mt-2 w-full rounded-xl border px-4 py-3"
                />

                <input
                  type="password"
                  placeholder="Password admin"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="mt-3 w-full rounded-xl border px-4 py-3"
                />

                <button
                  type="submit"
                  className="mt-4 w-full rounded-xl bg-sky-500 py-3 font-bold text-white"
                >
                  Login
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="rounded-2xl bg-slate-100 p-4">
                    Belum ada order.
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
                      <div className="mt-2 text-sm font-bold">
                        Status: {order.status}
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
    </div>
  );
          }
