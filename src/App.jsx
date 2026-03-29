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

function useTypingLoop(text, speed = 80, pause = 1200) {
  const [displayed, setDisplayed] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    let deleting = false;
    let timeoutId;
    let intervalId;

    const startTyping = () => {
      intervalId = setInterval(() => {
        if (!deleting) {
          setDisplayed(text.slice(0, i + 1));
          i += 1;

          if (i === text.length) {
            clearInterval(intervalId);
            timeoutId = setTimeout(() => {
              deleting = true;
              startTyping();
            }, pause);
          }
        } else {
          setDisplayed(text.slice(0, i - 1));
          i -= 1;

          if (i === 0) {
            clearInterval(intervalId);
            deleting = false;
            timeoutId = setTimeout(() => {
              startTyping();
            }, 300);
          }
        }
      }, speed);
    };

    startTyping();

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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [paidCount, setPaidCount] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPending, setTotalPending] = useState(0);

  const [session, setSession] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [orders, setOrders] = useState([]);

  const [customerName, setCustomerName] = useState("");
  const [customerWhatsapp, setCustomerWhatsapp] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const productsRef = useRef(null);

  const { displayed, showCursor } = useTypingLoop(
    "Premium Account & Game Server Provider ✨",
    70,
    1400
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

  const fetchPaidCount = async () => {
    const { count, error } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "paid");

    if (error) {
      console.log("fetchPaidCount error:", error.message);
      return;
    }

    setPaidCount(count || 0);
  };

  const fetchStats = async () => {
    const { count: total, error: totalError } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true });

    const { count: pending, error: pendingError } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending");

    if (!totalError) setTotalOrders(total || 0);
    if (!pendingError) setTotalPending(pending || 0);
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
    fetchPaidCount();
    fetchStats();

    const interval = setInterval(() => {
      fetchPaidCount();
      fetchStats();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (session) {
      fetchOrders();
    }
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

    const text = `Halo, saya ingin order ${selectedProduct.name}
Nama: ${customerName}
WA: ${customerWhatsapp}
Note: ${customerNote || "-"}`;

    window.open(
      `https://wa.me/60166173129?text=${encodeURIComponent(text)}`,
      "_blank"
    );

    alert("Order masuk!");

    setSelectedProduct(null);
    setCustomerName("");
    setCustomerWhatsapp("");
    setCustomerNote("");

    await fetchStats();
    await fetchPaidCount();
    if (session) await fetchOrders();
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
    await fetchPaidCount();
    await fetchStats();
  };

  const markAsCancelled = async (id) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: "pending" })
      .eq("id", id);

    if (error) {
      alert("Gagal update status: " + error.message);
      return;
    }

    await fetchOrders();
    await fetchPaidCount();
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
    await fetchPaidCount();
    await fetchStats();
  };

  const ProductCard = ({ item }) => (
    <div
      className={`rounded-[28px] border p-4 shadow-sm transition ${
        darkMode
          ? "border-slate-700 bg-slate-800"
          : "border-slate-200 bg-white"
      }`}
    >
      <div
        className={`rounded-[24px] border p-4 ${
          darkMode
            ? "border-slate-700 bg-slate-900"
            : "border-slate-200 bg-slate-50"
        }`}
      >
        <div className="flex h-[120px] items-center justify-center overflow-hidden rounded-xl">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-contain"
          />
        </div>
      </div>

      <div className="pt-4">
        <h3
          className={`min-h-[56px] text-[18px] font-extrabold leading-tight ${
            darkMode ? "text-white" : "text-slate-900"
          }`}
        >
          {item.name}
        </h3>

        <p className="mt-3 text-[18px] font-extrabold text-sky-500">
          {item.price}
        </p>

        <button
          onClick={() => setSelectedProduct(item)}
          className="mt-4 w-full rounded-[18px] bg-sky-100 py-3 font-bold text-sky-600"
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
        <h2 className="mb-5 text-[18px] font-extrabold uppercase tracking-[0.22em] text-sky-600">
          {title}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {data.map((item, i) => (
            <ProductCard key={i} item={item} />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div
        className={`min-h-screen ${
          darkMode ? "bg-slate-950 text-white" : "bg-[#f4f6fb] text-slate-900"
        }`}
      >
        <div className="mx-auto max-w-md px-4 py-5">
          <div
            className={`flex items-center justify-between rounded-[28px] p-4 shadow ${
              darkMode ? "bg-slate-900" : "bg-white"
            }`}
          >
            <button
              onClick={() => setMenuOpen(true)}
              className="text-2xl"
              aria-label="Open Menu"
            >
              ☰
            </button>

            <h1 className="text-[18px] font-extrabold tracking-wide">
              MUINSHOP CIK
            </h1>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-500 text-white"
              aria-label="Toggle Theme"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>

          <div className="mt-6 overflow-hidden rounded-[34px] bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 p-6 text-white shadow-lg">
            <h2 className="text-[24px] font-extrabold">Muinshop Cik 🚀</h2>

            <p className="mt-2 min-h-[28px] text-sm text-white/95">
              {displayed}
              <span className={`${showCursor ? "opacity-100" : "opacity-0"}`}>
                |
              </span>
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/20 px-4 py-3 text-sm">
                <div className="text-white/80">✔ Berhasil</div>
                <div className="mt-1 text-xl font-extrabold">{paidCount}</div>
              </div>

              <div className="rounded-2xl bg-white/20 px-4 py-3 text-sm">
                <div className="text-white/80">📦 Order</div>
                <div className="mt-1 text-xl font-extrabold">{totalOrders}</div>
              </div>

              <div className="col-span-2 rounded-2xl bg-white/20 px-4 py-3 text-sm">
                <div className="text-white/80">⏳ Pending</div>
                <div className="mt-1 text-xl font-extrabold">{totalPending}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3 overflow-x-auto pb-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => handleCategoryClick(c)}
                className={`whitespace-nowrap rounded-full px-5 py-3 text-sm font-bold ${
                  activeCategory === c
                    ? "bg-sky-500 text-white"
                    : darkMode
                    ? "border border-slate-700 bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-900"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div ref={productsRef}>
            <Section
              title="Virtual Private Server"
              data={groupedProducts["Virtual Private Server"]}
            />

            <Section title="Pterodactyl" data={groupedProducts["Pterodactyl"]} />
          </div>
        </div>

        {menuOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMenuOpen(false)}
            />

            <div
              className={`relative h-full w-[280px] p-5 shadow-xl ${
                darkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"
              }`}
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-extrabold">Menu</h2>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleCategoryClick("Semua")}
                  className="w-full rounded-xl bg-sky-500 px-4 py-3 text-left font-bold text-white"
                >
                  Semua Produk
                </button>

                <button
                  onClick={() => handleCategoryClick("Virtual Private Server")}
                  className={`w-full rounded-xl px-4 py-3 text-left font-bold ${
                    darkMode
                      ? "bg-slate-800 text-white"
                      : "bg-slate-100 text-slate-900"
                  }`}
                >
                  Virtual Private Server
                </button>

                <button
                  onClick={() => handleCategoryClick("Pterodactyl")}
                  className={`w-full rounded-xl px-4 py-3 text-left font-bold ${
                    darkMode
                      ? "bg-slate-800 text-white"
                      : "bg-slate-100 text-slate-900"
                  }`}
                >
                  Pterodactyl
                </button>

                {!session ? (
                  <button
                    onClick={() => {
                      setShowAdmin(true);
                      setMenuOpen(false);
                    }}
                    className="w-full rounded-xl bg-amber-500 px-4 py-3 text-left font-bold text-white"
                  >
                    Login Admin
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setShowAdmin(true);
                        setMenuOpen(false);
                      }}
                      className="w-full rounded-xl bg-amber-500 px-4 py-3 text-left font-bold text-white"
                    >
                      Panel Admin
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full rounded-xl bg-rose-500 px-4 py-3 text-left font-bold text-white"
                    >
                      Logout Admin
                    </button>
                  </>
                )}

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    window.open("https://wa.me/60166173129", "_blank");
                  }}
                  className="w-full rounded-xl bg-green-500 px-4 py-3 text-left font-bold text-white"
                >
                  Chat WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div
              className={`w-full max-w-sm rounded-[28px] p-5 ${
                darkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"
              }`}
            >
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="mx-auto h-28 object-contain"
              />

              <h3 className="mt-4 text-xl font-extrabold">
                {selectedProduct.name}
              </h3>

              <p className="mt-2 font-bold text-sky-500">
                {selectedProduct.price}
              </p>

              <p className="mt-3 text-sm opacity-80">
                {selectedProduct.description}
              </p>

              <input
                placeholder="Nama"
                className="mt-4 w-full rounded-xl border px-4 py-3 text-slate-900"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />

              <input
                placeholder="WhatsApp"
                className="mt-3 w-full rounded-xl border px-4 py-3 text-slate-900"
                value={customerWhatsapp}
                onChange={(e) => setCustomerWhatsapp(e.target.value)}
              />

              <textarea
                placeholder="Catatan"
                className="mt-3 w-full rounded-xl border px-4 py-3 text-slate-900"
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

        {showAdmin && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
            <div
              className={`max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[28px] p-5 ${
                darkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"
              }`}
            >
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
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-slate-900"
                  />

                  <input
                    type="password"
                    placeholder="Password admin"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="mt-3 w-full rounded-xl border px-4 py-3 text-slate-900"
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
                    <div className="rounded-2xl bg-slate-100 p-4 text-slate-800">
                      Belum ada order.
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div
                        key={order.id}
                        className={`rounded-2xl border p-4 ${
                          darkMode
                            ? "border-slate-700 bg-slate-800"
                            : "border-slate-200 bg-slate-50"
                        }`}
                      >
                        <div className="font-extrabold">{order.product_name}</div>
                        <div className="mt-1 text-sm">Harga: {order.price}</div>
                        <div className="text-sm">Nama: {order.customer_name}</div>
                        <div className="text-sm">
                          WhatsApp: {order.customer_whatsapp}
                        </div>
                        <div className="text-sm">
                          Catatan: {order.note || "-"}
                        </div>
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
                            onClick={() => markAsCancelled(order.id)}
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
    </div>
  );
    }
