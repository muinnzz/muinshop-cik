import { useMemo, useState } from "react";

export default function App() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const products = [
    {
      category: "Virtual Private Server",
      name: "VPS R16 4CORE",
      price: "Rp 8.000",
      image: "https://i.ibb.co/0yQ2z3B/vps.png",
      description: "VPS hemat untuk kebutuhan ringan dan testing."
    },
    {
      category: "Virtual Private Server",
      name: "VPS R16 8CORE",
      price: "Rp 8.000",
      image: "https://i.ibb.co/0yQ2z3B/vps.png",
      description: "VPS lebih kencang untuk kebutuhan menengah."
    },
    {
      category: "Pterodactyl",
      name: "Pterodactyl Unlimited",
      price: "Rp 10.000",
      image: "https://i.ibb.co/7QpKsCX/ptero.png",
      description: "Paket panel unlimited untuk kebutuhan game server."
    },
    {
      category: "Pterodactyl",
      name: "Pterodactyl 9 GB",
      price: "Rp 12.000",
      image: "https://i.ibb.co/7QpKsCX/ptero.png",
      description: "Panel Pterodactyl dengan resource 9 GB."
    },
  ];

  const categories = ["Semua", "Virtual Private Server", "Pterodactyl"];

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

  const Card = ({ item }) => (
    <div
      className={`rounded-[28px] border p-4 shadow-sm ${
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
        <div className="h-[120px] flex items-center justify-center">
          <img
            src={item.image}
            alt={item.name}
            className="h-full object-contain"
          />
        </div>
      </div>

      <div className="pt-4">
        <h3 className={`font-extrabold text-lg ${darkMode ? "text-white" : "text-slate-900"}`}>
          {item.name}
        </h3>
        <p className="mt-2 font-extrabold text-sky-500">{item.price}</p>

        <button
          onClick={() => setSelectedProduct(item)}
          className="mt-3 w-full rounded-xl bg-sky-100 py-2 font-bold text-sky-600"
        >
          Detail
        </button>
      </div>
    </div>
  );

  const Section = ({ title, data }) => {
    if (!data.length) return null;

    return (
      <>
        <h2 className="mt-8 mb-3 text-sm font-extrabold uppercase tracking-widest text-sky-600">
          {title}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {data.map((item, i) => (
            <Card key={i} item={item} />
          ))}
        </div>
      </>
    );
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className={`min-h-screen ${darkMode ? "bg-slate-950 text-white" : "bg-[#f5f7fb] text-slate-900"}`}>
        <div className="mx-auto max-w-md px-4 py-5">
          <div
            className={`flex items-center justify-between rounded-3xl p-4 shadow ${
              darkMode ? "bg-slate-900" : "bg-white"
            }`}
          >
            <button className="text-xl">☰</button>
            <h1 className="text-sm font-extrabold">MUINSHOP CIK</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-white"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>

          <div className="mt-6 rounded-3xl bg-gradient-to-br from-sky-500 to-purple-500 p-6 text-white shadow-lg">
            <h2 className="text-2xl font-extrabold">Muinshop Cik</h2>
            <p className="text-sm">Premium Account & Game Server Provider ✨</p>

            <div className="mt-4 flex justify-between">
              <div className="rounded-full bg-white/20 px-4 py-2 text-xs">
                ✔ 0 Transaksi Berhasil
              </div>
              <span className="text-5xl opacity-20">⚡</span>
            </div>
          </div>

          <div className="mt-6 flex gap-2 overflow-x-auto">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`rounded-full px-4 py-2 text-sm font-bold ${
                  activeCategory === c
                    ? "bg-sky-500 text-white"
                    : darkMode
                    ? "border border-slate-700 bg-slate-900 text-white"
                    : "border bg-white text-slate-900"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <Section
            title="Virtual Private Server"
            data={groupedProducts["Virtual Private Server"]}
          />
          <Section title="Pterodactyl" data={groupedProducts["Pterodactyl"]} />
        </div>

        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div
              className={`w-full max-w-sm rounded-3xl p-5 ${
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

              <button
                onClick={() =>
                  window.open(
                    `https://wa.me/6281234567890?text=Halo%20saya%20ingin%20order%20${encodeURIComponent(
                      selectedProduct.name
                    )}`,
                    "_blank"
                  )
                }
                className="mt-5 w-full rounded-xl bg-sky-500 py-3 font-bold text-white"
              >
                Order via WhatsApp
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
      </div>
    </div>
  );
}
