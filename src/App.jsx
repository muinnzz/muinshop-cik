export default function App() {
  const categories = ["Semua", "Virtual Private Server", "Pterodactyl"];

  const vps = [
    {
      name: "VPS R16 4CORE",
      price: "Rp 8.000",
      image: "https://i.ibb.co/0yQ2z3B/vps.png"
    },
    {
      name: "VPS R16 8CORE",
      price: "Rp 8.000",
      image: "https://i.ibb.co/0yQ2z3B/vps.png"
    },
  ];

  const ptero = [
    {
      name: "Pterodactyl Unlimited",
      price: "Rp 10.000",
      image: "https://i.ibb.co/7QpKsCX/ptero.png"
    },
    {
      name: "Pterodactyl 9 GB",
      price: "Rp 12.000",
      image: "https://i.ibb.co/7QpKsCX/ptero.png"
    },
  ];

  const Card = ({ item }) => (
    <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
      
      <div className="rounded-[24px] bg-slate-50 p-4 border">
        <div className="h-[120px] flex items-center justify-center">
          <img
            src={item.image}
            alt={item.name}
            className="h-full object-contain"
          />
        </div>
      </div>

      <div className="pt-4">
        <h3 className="font-extrabold text-lg">{item.name}</h3>
        <p className="text-sky-600 font-extrabold mt-2">{item.price}</p>

        <button className="mt-3 w-full rounded-xl bg-sky-100 text-sky-600 font-bold py-2">
          Detail
        </button>
      </div>
    </div>
  );

  const Section = ({ title, data }) => (
    <>
      <h2 className="mt-8 mb-3 text-sm tracking-widest font-extrabold text-sky-600 uppercase">
        {title}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {data.map((item, i) => (
          <Card key={i} item={item} />
        ))}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <div className="max-w-md mx-auto px-4 py-5">

        {/* HEADER */}
        <div className="bg-white rounded-3xl p-4 flex justify-between items-center shadow">
          <div>☰</div>
          <h1 className="font-extrabold text-sm">MUINSHOP CIK</h1>
          <div className="bg-sky-500 text-white w-10 h-10 flex items-center justify-center rounded-full">
            🌙
          </div>
        </div>

        {/* HERO */}
        <div className="mt-6 bg-gradient-to-br from-sky-500 to-purple-500 text-white p-6 rounded-3xl shadow-lg">
          <h2 className="text-2xl font-extrabold">Muinshop Cik</h2>
          <p className="text-sm">Premium Account & Game Server Provider ✨</p>

          <div className="mt-4 flex justify-between">
            <div className="bg-white/20 px-4 py-2 rounded-full text-xs">
              ✔ 0 Transaksi Berhasil
            </div>
            <span className="text-5xl opacity-20">⚡</span>
          </div>
        </div>

        {/* CATEGORY */}
        <div className="mt-6 flex gap-2 overflow-x-auto">
          {categories.map((c, i) => (
            <button
              key={i}
              className={`px-4 py-2 rounded-full text-sm font-bold ${
                i === 0
                  ? "bg-sky-500 text-white"
                  : "bg-white border"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <Section title="Virtual Private Server" data={vps} />
        <Section title="Pterodactyl" data={ptero} />

      </div>
    </div>
  );
}
