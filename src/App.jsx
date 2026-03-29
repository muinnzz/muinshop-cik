import { useEffect, useState } from "react";
import { supabase } from "./supabase";

// 🔥 typing animation hook
const useTyping = (text, speed = 80) => {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;

    const interval = setInterval(() => {
      setDisplayed((prev) => {
        if (prev.length === text.length) {
          i = 0;
          return "";
        }
        return prev + text[i++];
      });
    }, speed);

    return () => clearInterval(interval);
  }, [text]);

  return displayed;
};

export default function App() {
  const [paidCount, setPaidCount] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPending, setTotalPending] = useState(0);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerWhatsapp, setCustomerWhatsapp] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 🔥 typing text
  const vpsText = useTyping("VIRTUAL PRIVATE SERVER");
  const pteroText = useTyping("PTERODACTYL");

  // 🔥 ambil jumlah paid
  const fetchPaidCount = async () => {
    const { count } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "paid");

    setPaidCount(count || 0);
  };

  // 🔥 ambil statistik
  const fetchStats = async () => {
    const { count: total } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    const { count: pending } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    setTotalOrders(total || 0);
    setTotalPending(pending || 0);
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

  // 🔥 create order
  const handleCreateOrder = async () => {
    if (!selectedProduct) return;

    if (!customerName || !customerWhatsapp) {
      alert("Isi nama & WhatsApp dulu.");
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
      alert("Error: " + error.message);
      return;
    }

    const text = `Order ${selectedProduct.name}
Nama: ${customerName}
WA: ${customerWhatsapp}
Note: ${customerNote || "-"}`;

    window.open(
      `https://wa.me/60166173129?text=${encodeURIComponent(text)}`
    );

    alert("Order masuk!");

    setSelectedProduct(null);
    setCustomerName("");
    setCustomerWhatsapp("");
    setCustomerNote("");
  };

  const products = [
    { name: "VPS R16 4 CORE", price: "Rp 8.000" },
    { name: "VPS R16 8 CORE", price: "Rp 8.000" },
    { name: "Pterodactyl Unlimited", price: "Rp 10.000" },
    { name: "Pterodactyl 9GB", price: "Rp 5.000" },
  ];

  return (
    <div className="p-4">
      {/* HEADER */}
      <div className="bg-blue-500 text-white p-4 rounded-xl">
        <h1 className="text-xl font-bold">Muinshop Cik 🚀</h1>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <div>✔ {paidCount} Berhasil</div>
          <div>📦 {totalOrders} Order</div>
          <div className="col-span-2">⏳ {totalPending} Pending</div>
        </div>
      </div>

      {/* VPS */}
      <h2 className="mt-6 font-bold text-blue-500">{vpsText}</h2>

      {/* PRODUCT */}
      <div className="grid grid-cols-2 gap-3 mt-3">
        {products.map((p, i) => (
          <div
            key={i}
            className="border p-3 rounded-lg"
            onClick={() => setSelectedProduct(p)}
          >
            <h3 className="font-bold">{p.name}</h3>
            <p className="text-blue-500">{p.price}</p>
          </div>
        ))}
      </div>

      {/* PTERODACTYL */}
      <h2 className="mt-6 font-bold text-blue-500">{pteroText}</h2>

      {/* MODAL ORDER */}
      {selectedProduct && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t">
          <h3 className="font-bold">{selectedProduct.name}</h3>

          <input
            placeholder="Nama"
            className="border p-2 w-full mt-2"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <input
            placeholder="WhatsApp"
            className="border p-2 w-full mt-2"
            value={customerWhatsapp}
            onChange={(e) => setCustomerWhatsapp(e.target.value)}
          />

          <textarea
            placeholder="Catatan"
            className="border p-2 w-full mt-2"
            value={customerNote}
            onChange={(e) => setCustomerNote(e.target.value)}
          />

          <button
            onClick={handleCreateOrder}
            className="bg-blue-500 text-white w-full p-2 mt-3 rounded"
          >
            {submitting ? "Mengirim..." : "Order"}
          </button>

          <button
            onClick={() => setSelectedProduct(null)}
            className="w-full p-2 mt-2 border rounded"
          >
            Tutup
          </button>
        </div>
      )}
    </div>
  );
}
