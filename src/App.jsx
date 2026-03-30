import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "./supabase";

const BRAND = "Muinshop Cik";
const API_BRAND = "Muinzz API";
const WHATSAPP_NUMBER = "60166173129";
const PAKASIR_SLUG = import.meta.env.VITE_PAKASIR_SLUG || "muin2";

const products = [
  {
    id: 1,
    category: "Virtual Private Server",
    name: "VPS R16 4 CORE",
    price: "Rp 8.000",
    image: "https://cdn-icons-png.flaticon.com/512/4248/4248443.png",
    description: "VPS hemat untuk kebutuhan ringan, testing, dan bot kecil.",
    badge: "Best Seller",
    featured: true,
    features: [
      "Cocok untuk testing dan bot ringan",
      "Aktivasi cepat setelah pembayaran",
      "Support admin responsif",
    ],
  },
  {
    id: 2,
    category: "Virtual Private Server",
    name: "VPS R16 8 CORE",
    price: "Rp 12.000",
    image: "https://cdn-icons-png.flaticon.com/512/4248/4248443.png",
    description:
      "VPS lebih kencang untuk kebutuhan menengah dan workload lebih stabil.",
    badge: "Populer",
    featured: false,
    features: [
      "Performa lebih stabil",
      "Cocok untuk kebutuhan menengah",
      "Proses cepat dan aman",
    ],
  },
  {
    id: 3,
    category: "Pterodactyl",
    name: "Pterodactyl Unlimited",
    price: "Rp 10.000",
    image: "https://cdn-icons-png.flaticon.com/512/1055/1055687.png",
    description:
      "Panel unlimited untuk kebutuhan game server yang lebih fleksibel.",
    badge: "Premium",
    featured: true,
    features: [
      "Resource besar untuk game server",
      "Pengiriman cepat setelah pembayaran",
      "Mudah digunakan",
    ],
  },
  {
    id: 4,
    category: "Pterodactyl",
    name: "Pterodactyl 9GB",
    price: "Rp 5.000",
    image: "https://cdn-icons-png.flaticon.com/512/1055/1055687.png",
    description:
      "Panel Pterodactyl 9 GB dengan harga hemat untuk kebutuhan dasar.",
    badge: "Termurah",
    featured: false,
    features: [
      "Harga hemat",
      "Cocok untuk kebutuhan dasar",
      "Setup cepat",
    ],
  },
];

const promoItems = [
  "Proses otomatis 24 jam",
  "Pembayaran QRIS cepat",
  "Support fast respon",
  "Produk ready kirim",
];

const trustItems = [
  {
    title: "Transaksi Aman",
    desc: "Pembayaran dibungkus flow yang lebih rapi dan mudah dipahami.",
    icon: "shield",
  },
  {
    title: "Proses Cepat",
    desc: "Order masuk diproses cepat tanpa bikin user nunggu lama.",
    icon: "bolt",
  },
  {
    title: "Support Aktif",
    desc: "Kalau ada kendala, admin tetap gampang dihubungi.",
    icon: "headset",
  },
];

const testimonials = [
  {
    name: "Rafi",
    role: "Pembeli terverifikasi",
    text: "Proses cepat dan langsung masuk. Cocok buat yang mau serba praktis.",
    rating: 5,
  },
  {
    name: "Aldi",
    role: "Pembeli terverifikasi",
    text: "Pembayaran gampang dan tampilannya enak dipakai. Admin juga responsif.",
    rating: 5,
  },
  {
    name: "Nando",
    role: "Pembeli terverifikasi",
    text: "Sudah beberapa kali order, aman dan prosesnya rapi. Recommended.",
    rating: 5,
  },
];

const apiFeatures = [
  {
    title: "Artificial Intelligence",
    desc: "Chatbot pintar berbasis AI untuk menjawab pertanyaan secara instan.",
    icon: "bot",
    detail:
      "Cocok untuk chatbot, auto-reply, content helper, dan automasi alur kerja sederhana sampai kompleks.",
  },
  {
    title: "Social Media Downloader",
    desc: "Unduh video dan foto dari berbagai platform dengan cepat.",
    icon: "download",
    detail:
      "Bisa diarahkan ke endpoint downloader TikTok, Instagram, YouTube, dan platform lain sesuai backend kamu.",
  },
  {
    title: "Stalker Tools",
    desc: "Lookup informasi publik dari akun atau target secara cepat.",
    icon: "spy",
    detail:
      "Cocok untuk metadata lookup, username checker, public profile finder, dan tools utilitas lain.",
  },
];

const categories = ["Semua", "Virtual Private Server", "Pterodactyl"];
const tracks = ["Muinzz API Music", "Night Drive", "Sky Beat", "Cloud Signal"];

const statusStyles = {
  paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  failed: "border-rose-200 bg-rose-50 text-rose-700",
};

const parsePriceToNumber = (price) => Number(String(price).replace(/[^\d]/g, ""));

const formatRupiah = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return `Rp ${Number(value).toLocaleString("id-ID")}`;
};

const formatWhatsapp = (value) => {
  const digits = String(value).replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  return digits;
};

function IconMenu() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function IconHome() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 19a2 2 0 0 0 2 2h12V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h6M8 11h8M8 15h5" />
    </svg>
  );
}

function IconBag() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 8h12l-1 12H7L6 8Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 8V6a3 3 0 1 1 6 0v2" />
    </svg>
  );
}

function IconLogin() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 17l5-5-5-5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H4" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17l5-5-5-5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H9" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m9.5 12 1.7 1.7L14.8 10" />
    </svg>
  );
}

function IconBolt() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}

function IconHeadset() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 13a8 8 0 1 1 16 0" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 13v4a2 2 0 0 0 2 2h2v-6H6a2 2 0 0 0-2 2Zm16 0v4a2 2 0 0 1-2 2h-2v-6h2a2 2 0 0 1 2 2Z" />
    </svg>
  );
}

function IconCheckCircle() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.07 0C5.5 0 .16 5.34.16 11.91c0 2.1.55 4.15 1.59 5.96L0 24l6.3-1.65a11.9 11.9 0 0 0 5.77 1.47h.01c6.57 0 11.91-5.34 11.91-11.91 0-3.18-1.24-6.16-3.47-8.43ZM12.08 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.74.98 1-3.65-.24-.38a9.86 9.86 0 0 1-1.52-5.25c0-5.46 4.44-9.9 9.91-9.9 2.64 0 5.12 1.03 6.99 2.91a9.83 9.83 0 0 1 2.9 6.99c0 5.46-4.44 9.9-9.89 9.9Zm5.43-7.42c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.39-1.46-.88-.79-1.48-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.08-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.48.71.31 1.27.49 1.7.63.71.22 1.36.19 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.69.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z" />
    </svg>
  );
}

function IconStar() {
  return (
    <svg className="h-[14px] w-[14px] fill-amber-400 text-amber-400" viewBox="0 0 24 24">
      <path d="m12 3.6 2.53 5.13 5.66.82-4.1 4 0.97 5.64L12 16.53 6.94 19.2l0.97-5.64-4.1-4 5.66-.82L12 3.6Z" />
    </svg>
  );
}

function IconApiPage() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h8M6 12h12M8 18h8" />
      <circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="20" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconLayers() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="m12 3 8 4-8 4-8-4 8-4Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m4 12 8 4 8-4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m4 17 8 4 8-4" />
    </svg>
  );
}

function IconBot() {
  return (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
      <rect x="5" y="8" width="14" height="11" rx="3" />
      <path strokeLinecap="round" d="M12 4v4M9 13h.01M15 13h.01M9 16h6" />
    </svg>
  );
}

function IconCloudDownload() {
  return (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 18a4 4 0 1 1 .8-7.92A5 5 0 0 1 17.5 9a3.5 3.5 0 1 1 .5 7H7Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v7m0 0 3-3m-3 3-3-3" />
    </svg>
  );
}

function IconSpy() {
  return (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c3 2.5 5 4.8 5 8a5 5 0 1 1-10 0c0-3.2 2-5.5 5-8Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 20h8M9 14h.01M15 14h.01" />
    </svg>
  );
}

function IconLocation() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}

function IconDrop() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3s5 5.2 5 9a5 5 0 1 1-10 0c0-3.8 5-9 5-9Z" />
    </svg>
  );
}

function IconWind() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h10a2 2 0 1 0-2-2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h14a2 2 0 1 1-2 2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16h8" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7-11-7Z" />
    </svg>
  );
}

function IconPause() {
  return (
    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
      <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
    </svg>
  );
}

function IconNext() {
  return (
    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
      <path d="M6 5v14l8-7-8-7Zm10 0h2v14h-2z" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6M12 7h.01" />
    </svg>
  );
}

function TooltipPill({ text }) {
  return (
    <span
      title={text}
      className="inline-flex cursor-help rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-500"
    >
      ?
    </span>
  );
}

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
    <div className="fixed left-1/2 top-4 z-[120] w-[92%] max-w-sm -translate-x-1/2">
      <div className={`rounded-2xl px-4 py-3 text-xs font-semibold text-white shadow-2xl ${tone}`}>
        {toast.message}
      </div>
    </div>
  );
}

function SkeletonStat() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/15 bg-white/15 px-3 py-2.5 backdrop-blur-md">
      <div className="h-2.5 w-20 rounded bg-white/30" />
      <div className="mt-2 h-5 w-10 rounded bg-white/30" />
    </div>
  );
}

function SkeletonProduct() {
  return (
    <div className="animate-pulse overflow-hidden rounded-[24px] border border-white/70 bg-white p-3 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <div className="rounded-[18px] border border-slate-200 bg-slate-50 p-2.5">
        <div className="h-[84px] rounded-[14px] bg-slate-200" />
      </div>
      <div className="mt-3 h-3 w-20 rounded bg-slate-200" />
      <div className="mt-2 h-4 w-24 rounded bg-slate-200" />
      <div className="mt-3 h-10 rounded-2xl bg-slate-200" />
    </div>
  );
}

function SectionTitle({ eyebrow, title, darkMode = false, right = null }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        {eyebrow ? (
          <div className="mb-2 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-sky-500" />
            <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-sky-600">
              {eyebrow}
            </p>
          </div>
        ) : null}
        <h2 className={`text-[16px] font-extrabold ${darkMode ? "text-white" : "text-slate-800"}`}>
          {title}
        </h2>
      </div>
      {right}
    </div>
  );
}

function FeatureCard({ icon, title, desc, iconColor, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-[26px] border border-slate-100 bg-[#f8fbff] p-4 text-left transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_26px_rgba(14,165,233,0.08)] active:scale-[0.99]"
    >
      <div className="flex gap-4">
        <div
          className={`flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[22px] bg-white shadow-sm ${iconColor}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <h3 className="text-[14px] font-extrabold text-slate-800">{title}</h3>
          <p className="mt-2 text-[12px] leading-6 text-slate-500">{desc}</p>
        </div>
      </div>
    </button>
  );
}

function BottomNav({ currentPage, onHome, onApi, onProducts, onAdmin }) {
  return (
    <div className="fixed bottom-3 left-1/2 z-40 w-[92%] max-w-sm -translate-x-1/2 rounded-[24px] border border-white/80 bg-white/95 p-2 shadow-[0_14px_30px_rgba(15,23,42,0.12)] backdrop-blur-md">
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={onHome}
          className={`flex flex-col items-center gap-1 rounded-[18px] py-2 text-[10px] font-bold transition ${
            currentPage === "shop" ? "bg-sky-500 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <IconHome />
          <span>Home</span>
        </button>

        <button
          onClick={onApi}
          className={`flex flex-col items-center gap-1 rounded-[18px] py-2 text-[10px] font-bold transition ${
            currentPage === "api" ? "bg-sky-500 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <IconApiPage />
          <span>API</span>
        </button>

        <button
          onClick={onProducts}
          className="flex flex-col items-center gap-1 rounded-[18px] py-2 text-[10px] font-bold text-slate-600 transition hover:bg-slate-100"
        >
          <IconBag />
          <span>Produk</span>
        </button>

        <button
          onClick={onAdmin}
          className="flex flex-col items-center gap-1 rounded-[18px] py-2 text-[10px] font-bold text-slate-600 transition hover:bg-slate-100"
        >
          <IconLogin />
          <span>Admin</span>
        </button>
      </div>
    </div>
  );
}

function ApiPage({
  onBack,
  onOpenMenu,
  onExploreApis,
  onOpenInfo,
  onOpenFeature,
  onMusicFocus,
  currentTime,
  isPlaying,
  onTogglePlay,
  onNextTrack,
  currentTrack,
  apiFeaturesRef,
  musicRef,
  progress,
}) {
  return (
    <div className="mx-auto max-w-sm animate-[fadeIn_.28s_ease] px-3 pb-28">
      <div className="mt-4 rounded-[28px] border border-cyan-100 bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between">
          <button
            onClick={onOpenMenu}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-white shadow-[0_10px_24px_rgba(14,165,233,0.24)] transition active:scale-95"
          >
            <IconMenu />
          </button>

          <div className="text-center">
            <h1 className="text-[15px] font-extrabold text-sky-500">{API_BRAND}</h1>
            <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-slate-400">
              Api Showcase
            </p>
          </div>

          <button
            onClick={onBack}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-white shadow-[0_10px_24px_rgba(14,165,233,0.24)] transition active:scale-95"
          >
            <IconHome />
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-[30px] bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600 p-5 text-white shadow-[0_18px_36px_rgba(14,165,233,0.22)]">
        <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/90">
          Developer Tools
        </div>

        <h2 className="mt-4 text-[28px] font-extrabold leading-tight">{API_BRAND}</h2>
        <p className="mt-2 text-[13px] leading-6 text-white/90">
          Showcase API yang lebih halus, lebih rapi, dan tombolnya sekarang benar-benar kerja.
        </p>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-[22px] border border-white/20 bg-white/15 px-3 py-4 text-center backdrop-blur-md">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/75">Clock</p>
            <p className="mt-2 text-[15px] font-extrabold">{currentTime}</p>
          </div>
          <div className="rounded-[22px] border border-white/20 bg-white/15 px-3 py-4 text-center backdrop-blur-md">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/75">Player</p>
            <p className="mt-2 text-[15px] font-extrabold">{isPlaying ? "ON" : "OFF"}</p>
          </div>
          <div className="rounded-[22px] border border-white/20 bg-white/15 px-3 py-4 text-center backdrop-blur-md">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/75">Status</p>
            <p className="mt-2 text-[15px] font-extrabold">LIVE</p>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={onExploreApis}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-[12px] font-extrabold text-sky-600 shadow-[0_12px_22px_rgba(255,255,255,0.18)] transition hover:scale-[1.01] active:scale-[0.98]"
          >
            <IconLayers />
            <span>Explore APIs</span>
          </button>

          <button
            onClick={onOpenInfo}
            className="flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-[12px] font-extrabold text-white transition active:scale-[0.98]"
          >
            <IconInfo />
            <span>Info</span>
          </button>
        </div>
      </div>

      <section className="mt-6 space-y-3">
        <button
          onClick={onOpenInfo}
          className="w-full rounded-[24px] border border-white/80 bg-white p-4 text-left shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 active:scale-[0.99]"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-[14px] font-extrabold text-slate-800">Get Started</h3>
              <p className="mt-1 text-[12px] leading-6 text-slate-500">
                Buka info singkat penggunaan API.
              </p>
            </div>
            <div className="rounded-full bg-sky-50 px-3 py-1 text-[10px] font-bold text-sky-600">Open</div>
          </div>
        </button>

        <button
          onClick={onExploreApis}
          className="w-full rounded-[24px] border border-white/80 bg-white p-4 text-left shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 active:scale-[0.99]"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-[14px] font-extrabold text-slate-800">Main Features</h3>
              <p className="mt-1 text-[12px] leading-6 text-slate-500">
                Loncat ke daftar fitur utama.
              </p>
            </div>
            <div className="rounded-full bg-sky-50 px-3 py-1 text-[10px] font-bold text-sky-600">Go</div>
          </div>
        </button>

        <button
          onClick={onMusicFocus}
          className="w-full rounded-[24px] border border-white/80 bg-white p-4 text-left shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 active:scale-[0.99]"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-[14px] font-extrabold text-slate-800">Music Widget</h3>
              <p className="mt-1 text-[12px] leading-6 text-slate-500">Kontrol widget music player.</p>
            </div>
            <div className="rounded-full bg-sky-50 px-3 py-1 text-[10px] font-bold text-sky-600">Play</div>
          </div>
        </button>
      </section>

      <section
        ref={apiFeaturesRef}
        className="mt-10 rounded-[30px] border border-cyan-100 bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)]"
      >
        <SectionTitle eyebrow="Api Features" title="Main Features" />

        <div className="space-y-4">
          {apiFeatures.map((item) => (
            <FeatureCard
              key={item.title}
              icon={
                item.icon === "bot" ? (
                  <IconBot />
                ) : item.icon === "download" ? (
                  <IconCloudDownload />
                ) : (
                  <IconSpy />
                )
              }
              title={item.title}
              desc={item.desc}
              iconColor={
                item.icon === "bot"
                  ? "text-violet-500"
                  : item.icon === "download"
                  ? "text-cyan-500"
                  : "text-rose-400"
              }
              onClick={() => onOpenFeature(item)}
            />
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-[30px] border border-cyan-100 bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
        <SectionTitle eyebrow="Weather" title="Weather Info" />

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div>
              <div className="text-[38px] font-extrabold leading-none text-sky-500">27°C</div>

              <div className="mt-3 space-y-1 text-[12px] text-slate-700">
                <div className="flex items-center gap-2">
                  <IconDrop />
                  <span>80%</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconWind />
                  <span>9 km/h</span>
                </div>
              </div>
            </div>

            <div className="pt-1">
              <div className="text-[15px] font-extrabold text-slate-800">Jakarta</div>
              <div className="text-[12px] text-slate-500">Partly cloudy</div>
            </div>
          </div>

          <div className="rounded-full bg-slate-100 p-3 text-slate-700">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 16a4 4 0 1 1 1.1-7.84A5 5 0 0 1 17 9a3.5 3.5 0 1 1 .5 7H6Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="m8 19 1-2m4 2 1-2m4 2 1-2" />
            </svg>
          </div>
        </div>
      </section>

      <section
        ref={musicRef}
        className="mt-10 rounded-[30px] border border-cyan-100 bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)]"
      >
        <SectionTitle eyebrow="Music Widget" title="Player Control" />

        <div className="rounded-[24px] bg-gradient-to-br from-sky-50 via-cyan-50 to-violet-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Now Playing</p>
              <div className="mt-1 truncate text-[15px] font-extrabold text-sky-600">{currentTrack}</div>
              <div className="mt-1 text-[12px] text-slate-500">{isPlaying ? "Sedang diputar" : "Sedang dijeda"}</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onTogglePlay}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-white shadow-[0_12px_22px_rgba(14,165,233,0.24)] transition active:scale-95"
              >
                {isPlaying ? <IconPause /> : <IconPlay />}
              </button>

              <button
                onClick={onNextTrack}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-400 text-white shadow-[0_12px_22px_rgba(167,139,250,0.22)] transition active:scale-95"
              >
                <IconNext />
              </button>
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-sky-500 transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </section>
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
  const [currentPage, setCurrentPage] = useState("shop");

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

  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState("");

  const [showApiInfo, setShowApiInfo] = useState(false);
  const [selectedApiFeature, setSelectedApiFeature] = useState(null);

  const [currentTime, setCurrentTime] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [musicProgress, setMusicProgress] = useState(18);

  const [orderLookupId, setOrderLookupId] = useState("");
  const [orderLookupLoading, setOrderLookupLoading] = useState(false);
  const [orderLookupResult, setOrderLookupResult] = useState(null);

  const topRef = useRef(null);
  const productsRef = useRef(null);
  const apiFeaturesRef = useRef(null);
  const musicRef = useRef(null);
  const lookupInputRef = useRef(null);
  const nameInputRef = useRef(null);

  const currentTrack = tracks[trackIndex];

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("order_id");
    const payment = params.get("payment");

    if (payment === "success" && orderId) {
      setSuccessOrderId(orderId);
      setShowSuccessPage(true);
    }
  }, []);

  useEffect(() => {
    const clock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    clock();
    const timer = setInterval(clock, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setMusicProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 4;
      });
    }, 700);

    return () => clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    if (showGuide) return;
    if (selectedProduct && nameInputRef.current) {
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
  }, [selectedProduct, showGuide]);

  const clearSuccessQuery = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("payment");
    url.searchParams.delete("order_id");
    window.history.replaceState({}, "", url.pathname);
  };

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

  useEffect(() => {
    fetchStats();
    if (session) fetchOrders();
  }, [session]);

  const refreshData = async ({ withOrders = false } = {}) => {
    await fetchStats();
    if (withOrders && session) await fetchOrders();
  };

  const filteredProducts = useMemo(() => {
    if (activeCategory === "Semua") return products;
    return products.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const groupedProducts = {
    "Virtual Private Server": filteredProducts.filter(
      (item) => item.category === "Virtual Private Server"
    ),
    Pterodactyl: filteredProducts.filter((item) => item.category === "Pterodactyl"),
  };

  const handleCategoryClick = (category) => {
    setCurrentPage("shop");
    setActiveCategory(category);
    setMenuOpen(false);

    setTimeout(() => {
      const y = productsRef.current?.getBoundingClientRect().top + window.scrollY - 88;
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
    }, 1000);
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

    const redirectUrl = `${window.location.origin}?payment=success&order_id=${encodeURIComponent(
      orderId
    )}`;

    const paymentUrl =
      `https://app.pakasir.com/pay/${PAKASIR_SLUG}/${amount}` +
      `?order_id=${encodeURIComponent(orderId)}` +
      `&qris_only=1` +
      `&redirect=${encodeURIComponent(redirectUrl)}`;

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

  const handleLookupOrder = async () => {
    if (!orderLookupId.trim()) {
      showToast("Masukkan order ID dulu.", "error");
      return;
    }

    setOrderLookupLoading(true);
    setOrderLookupResult(null);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", orderLookupId.trim())
      .maybeSingle();

    setOrderLookupLoading(false);

    if (error) {
      showToast("Gagal cek order: " + error.message, "error");
      return;
    }

    if (!data) {
      showToast("Order ID tidak ditemukan.", "error");
      return;
    }

    setOrderLookupResult(data);
    showToast("Order berhasil ditemukan.", "success");
  };

  const ProductCard = ({ item }) => (
    <div
      className={`group relative overflow-hidden rounded-[24px] border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(15,23,42,0.08)] active:scale-[0.985] ${
        darkMode
          ? "border-slate-800 bg-slate-900 shadow-[0_10px_24px_rgba(0,0,0,0.22)]"
          : "border-white/70 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
      }`}
    >
      {item.featured && (
        <div className="absolute right-3 top-3 z-10 rounded-full bg-yellow-400 px-2.5 py-1 text-[10px] font-black text-black shadow">
          HOT
        </div>
      )}

      <div className="p-3">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-sky-600">
            {item.badge}
          </span>
          <span className="text-[10px] font-semibold text-slate-400">
            {item.category === "Virtual Private Server" ? "VPS" : "PTERO"}
          </span>
        </div>

        <div
          className={`rounded-[18px] border p-2.5 ${
            darkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-slate-50"
          }`}
        >
          <div className="flex h-[82px] items-center justify-center overflow-hidden rounded-[14px] bg-white">
            <img
              src={item.image}
              alt={item.name}
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/140x100?text=No+Image";
              }}
              className="h-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        <div className="pt-3">
          <h3
            className={`min-h-[34px] text-[13px] font-extrabold leading-tight ${
              darkMode ? "text-white" : "text-slate-800"
            }`}
          >
            {item.name}
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-slate-400">{item.description}</p>

          <div className="mt-3">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Harga mulai
            </div>
            <p className="mt-1 text-[16px] font-extrabold text-sky-600">{item.price}</p>
          </div>

          <button
            title="Buka detail produk"
            onClick={() => setSelectedProduct(item)}
            className="mt-3.5 w-full rounded-2xl bg-sky-500 py-2.5 text-[12px] font-extrabold uppercase tracking-wide text-white transition-all duration-200 hover:bg-sky-600 active:scale-[0.98]"
          >
            Beli Sekarang ⚡
          </button>
        </div>
      </div>
    </div>
  );

  const Section = ({ title, data }) => {
    if (!data.length) return null;

    return (
      <section className="mt-8">
        <SectionTitle
          eyebrow="Kategori"
          title={title}
          darkMode={darkMode}
          right={<TooltipPill text={`Menampilkan produk ${title}`} />}
        />

        <div className="grid grid-cols-2 gap-3.5">
          {data.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        darkMode ? "bg-slate-950 text-white" : "bg-[#eef3fb] text-slate-900"
      }`}
    >
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div
        className={`sticky top-0 z-40 backdrop-blur-md ${
          darkMode ? "bg-slate-950/80" : "bg-[#eef3fb]/80"
        }`}
      >
        <div ref={topRef} className="mx-auto max-w-sm px-3 pt-3">
          <div
            className={`rounded-[24px] border px-4 py-3 ${
              darkMode
                ? "border-slate-800 bg-slate-900 shadow-[0_10px_24px_rgba(0,0,0,0.22)]"
                : "border-white/80 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.05)]"
            }`}
          >
            <div className="flex items-center justify-between">
              <button
                onClick={() => setMenuOpen(true)}
                className="rounded-full p-2 text-slate-700 transition-all duration-200 active:scale-95 dark:text-white"
              >
                <IconMenu />
              </button>

              <div className="text-center">
                <h1
                  className={`text-[14px] font-extrabold uppercase tracking-[0.14em] ${
                    darkMode ? "text-white" : "text-slate-800"
                  }`}
                >
                  {currentPage === "api" ? API_BRAND : BRAND}
                </h1>
                <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-slate-400">
                  {currentPage === "api" ? "Api Showcase" : "Premium Digital Store"}
                </p>
              </div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-white shadow-md transition-all duration-300 active:scale-95"
              >
                {darkMode ? "☀️" : "🌙"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="animate-[fadeIn_.35s_ease]">
        {currentPage === "api" ? (
          <ApiPage
            onBack={() => {
              setCurrentPage("shop");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onOpenMenu={() => setMenuOpen(true)}
            onExploreApis={() => {
              apiFeaturesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              showToast("Loncat ke fitur API.", "success");
            }}
            onOpenInfo={() => setShowApiInfo(true)}
            onOpenFeature={(item) => setSelectedApiFeature(item)}
            onMusicFocus={() => {
              musicRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              showToast("Scroll ke music widget.", "success");
            }}
            currentTime={currentTime}
            isPlaying={isPlaying}
            onTogglePlay={() => {
              setIsPlaying((prev) => !prev);
              showToast(isPlaying ? "Music dijeda." : "Music diputar.", "success");
            }}
            onNextTrack={() => {
              setTrackIndex((prev) => (prev + 1) % tracks.length);
              setMusicProgress(8);
              showToast("Track diganti.", "success");
            }}
            currentTrack={currentTrack}
            apiFeaturesRef={apiFeaturesRef}
            musicRef={musicRef}
            progress={musicProgress}
          />
        ) : (
          <div className="mx-auto max-w-sm px-3 pb-28">
            <div className="mt-4 overflow-hidden rounded-[28px] bg-gradient-to-br from-sky-500 via-blue-500 to-violet-500 p-4 text-white shadow-[0_16px_34px_rgba(59,130,246,0.25)]">
              <div className="relative">
                <div className="absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute right-8 top-10 h-16 w-16 rounded-full bg-white/10 blur-xl" />

                <div className="relative">
                  <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white/90">
                    Trusted Service
                  </div>

                  <h2 className="mt-3 text-[24px] font-extrabold leading-tight tracking-tight">
                    {BRAND}
                  </h2>
                  <p className="mt-2 max-w-[235px] text-[13px] leading-6 text-white/90">
                    Premium account, panel, dan server provider yang simpel, cepat,
                    dan enak dipakai.
                  </p>

                  <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                    {promoItems.map((item) => (
                      <div
                        key={item}
                        className="whitespace-nowrap rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white/95 backdrop-blur-md"
                      >
                        {item}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2.5">
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
                        <div className="rounded-2xl border border-white/15 bg-white/15 px-3 py-2.5 backdrop-blur-md">
                          <div className="text-[10px] text-white/80">Transaksi Berhasil</div>
                          <div className="mt-1 text-base font-extrabold">{paidCount}</div>
                        </div>

                        <div className="rounded-2xl border border-white/15 bg-white/15 px-3 py-2.5 backdrop-blur-md">
                          <div className="text-[10px] text-white/80">Total Order</div>
                          <div className="mt-1 text-base font-extrabold">{totalOrders}</div>
                        </div>

                        <div className="col-span-2 rounded-2xl border border-white/15 bg-white/15 px-3 py-2.5 backdrop-blur-md">
                          <div className="text-[10px] text-white/80">Pending</div>
                          <div className="mt-1 text-base font-extrabold">{totalPending}</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2.5">
              {trustItems.map((item) => {
                const icon =
                  item.icon === "shield" ? (
                    <IconShield />
                  ) : item.icon === "bolt" ? (
                    <IconBolt />
                  ) : (
                    <IconHeadset />
                  );

                return (
                  <div
                    key={item.title}
                    className={`rounded-[20px] border p-3 transition-all duration-300 hover:-translate-y-1 ${
                      darkMode
                        ? "border-slate-800 bg-slate-900"
                        : "border-white/80 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.04)]"
                    }`}
                  >
                    <div className="mb-2 text-sky-500">{icon}</div>
                    <h3
                      className={`text-[12px] font-extrabold ${
                        darkMode ? "text-white" : "text-slate-800"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-[10px] leading-5 text-slate-400">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            <section className="mt-8 rounded-[24px] border border-white/80 bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
              <SectionTitle
                eyebrow="Order Tracking"
                title="Cek Status Order"
                right={<TooltipPill text="Masukkan order ID untuk cek status transaksi." />}
              />

              <div className="flex gap-2">
                <input
                  ref={lookupInputRef}
                  value={orderLookupId}
                  onChange={(e) => setOrderLookupId(e.target.value)}
                  placeholder="Contoh: ORDER-123456789"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-[13px] outline-none transition focus:border-sky-400"
                />
                <button
                  onClick={handleLookupOrder}
                  disabled={orderLookupLoading}
                  className="rounded-2xl bg-sky-500 px-4 py-3 text-[12px] font-extrabold text-white transition hover:bg-sky-600 disabled:opacity-60"
                >
                  {orderLookupLoading ? "Cek..." : "Cek"}
                </button>
              </div>

              {orderLookupResult ? (
                <div className="mt-4 rounded-[20px] border border-slate-200 bg-slate-50 p-4 text-[12px] text-slate-600">
                  <div className="font-extrabold text-slate-800">{orderLookupResult.product_name}</div>
                  <div className="mt-1">Nama: {orderLookupResult.customer_name}</div>
                  <div>Harga: {formatRupiah(orderLookupResult.price)}</div>
                  <div>WhatsApp: {orderLookupResult.customer_whatsapp}</div>
                  <div className="mt-3">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase ${
                        statusStyles[orderLookupResult.status] ||
                        "border-slate-200 bg-slate-100 text-slate-700"
                      }`}
                    >
                      {orderLookupResult.status}
                    </span>
                  </div>
                </div>
              ) : null}
            </section>

            <div className="mt-6 flex gap-2.5 overflow-x-auto pb-2">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => handleCategoryClick(item)}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-[12px] font-bold transition-all duration-300 active:scale-[0.97] ${
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
                <section className="mt-8">
                  <SectionTitle eyebrow="Kategori" title="Virtual Private Server" darkMode={darkMode} />
                  <div className="grid grid-cols-2 gap-3.5">
                    <SkeletonProduct />
                    <SkeletonProduct />
                  </div>
                </section>
              ) : (
                <>
                  <Section title="Virtual Private Server" data={groupedProducts["Virtual Private Server"]} />
                  <Section title="Pterodactyl" data={groupedProducts["Pterodactyl"]} />
                </>
              )}
            </div>

            <section className="mt-8">
              <SectionTitle eyebrow="Review" title="Testimoni Pengguna" darkMode={darkMode} />

              <div className="space-y-3">
                {testimonials.map((item) => (
                  <div
                    key={item.name}
                    className={`rounded-[22px] border p-4 ${
                      darkMode
                        ? "border-slate-800 bg-slate-900"
                        : "border-white/80 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.04)]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-xs font-extrabold text-sky-600">
                        {item.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3
                          className={`text-[12px] font-extrabold ${
                            darkMode ? "text-white" : "text-slate-800"
                          }`}
                        >
                          {item.name}
                        </h3>
                        <p className="text-[10px] text-slate-400">{item.role}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-1">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <IconStar key={i} />
                      ))}
                    </div>

                    <p className="mt-3 text-[12px] leading-6 text-slate-500">{item.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <footer
              className={`mt-8 rounded-[24px] border px-4 py-5 ${
                darkMode
                  ? "border-slate-800 bg-slate-900"
                  : "border-white/80 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.04)]"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3
                    className={`text-[13px] font-extrabold ${
                      darkMode ? "text-white" : "text-slate-800"
                    }`}
                  >
                    {BRAND}
                  </h3>
                  <p className="mt-1 text-[11px] leading-5 text-slate-400">
                    Store digital dengan proses cepat, aman, dan tampilan yang sekarang
                    sudah lebih waras.
                  </p>
                </div>

                <button
                  onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, "_blank")}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-green-500 text-white shadow-[0_10px_25px_rgba(34,197,94,0.30)]"
                >
                  <IconWhatsApp />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-[10px] text-slate-400">
                <div>
                  <div className="font-bold uppercase tracking-[0.18em] text-slate-500">Layanan</div>
                  <div className="mt-1">Setiap hari</div>
                </div>
                <div>
                  <div className="font-bold uppercase tracking-[0.18em] text-slate-500">Support</div>
                  <div className="mt-1">Fast respon admin</div>
                </div>
              </div>

              <div className="mt-4 border-t border-slate-200 pt-3 text-center text-[10px] text-slate-400">
                © 2026 {BRAND}. All rights reserved.
              </div>
            </footer>
          </div>
        )}
      </div>

      <button
        onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, "_blank")}
        className="fixed bottom-24 right-5 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-[0_10px_22px_rgba(34,197,94,0.35)] transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <IconWhatsApp />
      </button>

      <BottomNav
        currentPage={currentPage}
        onHome={() => {
          setCurrentPage("shop");
          setTimeout(() => {
            topRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 80);
        }}
        onApi={() => {
          setCurrentPage("api");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onProducts={() => {
          setCurrentPage("shop");
          setTimeout(() => {
            productsRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 80);
        }}
        onAdmin={() => setShowAdmin(true)}
      />

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            onClick={() => setMenuOpen(false)}
          />

          <div className="relative h-full w-[82%] max-w-[340px] animate-[slideInLeft_.22s_ease] rounded-r-[28px] bg-white p-5 shadow-2xl">
            <div className="mb-7 rounded-[22px] bg-gradient-to-br from-sky-500 via-blue-500 to-violet-500 p-4 text-white">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md">
                  <span className="text-lg font-extrabold">M</span>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold">{BRAND}</h3>
                  <p className="text-xs text-white/80">Premium Digital Service</p>
                </div>
              </div>
            </div>

            <div className="space-y-3.5">
              <button
                onClick={() => {
                  setCurrentPage("shop");
                  setMenuOpen(false);
                  setTimeout(() => {
                    topRef.current?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                className="flex w-full items-center gap-3 rounded-[20px] bg-slate-100 px-4 py-3.5 text-left text-[13px] font-bold text-slate-800 transition-all duration-200 hover:bg-slate-200 active:scale-[0.98]"
              >
                <IconHome />
                <span>Beranda Shop</span>
              </button>

              <button
                onClick={() => {
                  setCurrentPage("api");
                  setMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex w-full items-center gap-3 rounded-[20px] bg-sky-500 px-4 py-3.5 text-left text-[13px] font-bold text-white transition-all duration-200 active:scale-[0.98]"
              >
                <IconApiPage />
                <span>Laman API</span>
              </button>

              <button
                onClick={openGuideWithLoading}
                className="flex w-full items-center justify-between rounded-[20px] border-2 border-dashed border-sky-400 px-4 py-3.5 text-left text-[13px] font-bold text-slate-800 transition-all duration-200 hover:bg-sky-50 active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <IconBook />
                  <span>Panduan</span>
                </div>
                <span className="rounded-full bg-sky-400 px-2.5 py-1 text-[9px] font-bold text-white">
                  WAJIB
                </span>
              </button>

              <button
                onClick={() => {
                  setCurrentPage("shop");
                  setMenuOpen(false);
                  setTimeout(() => {
                    productsRef.current?.scrollIntoView({ behavior: "smooth" });
                  }, 120);
                }}
                className="flex w-full items-center gap-3 rounded-[20px] px-4 py-3.5 text-left text-[13px] font-bold text-slate-800 transition-all duration-200 hover:bg-slate-50 active:scale-[0.98]"
              >
                <IconBag />
                <span>Produk Terjual</span>
              </button>

              {!session ? (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setShowAdmin(true);
                  }}
                  className="flex w-full items-center gap-3 rounded-[20px] bg-amber-500 px-4 py-3.5 text-left text-[13px] font-bold text-white transition-all duration-200 active:scale-[0.98]"
                >
                  <IconLogin />
                  <span>Login Admin</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setShowAdmin(true);
                    }}
                    className="flex w-full items-center gap-3 rounded-[20px] bg-amber-500 px-4 py-3.5 text-left text-[13px] font-bold text-white transition-all duration-200 active:scale-[0.98]"
                  >
                    <IconLogin />
                    <span>Panel Admin</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-[20px] bg-rose-500 px-4 py-3.5 text-left text-[13px] font-bold text-white transition-all duration-200 active:scale-[0.98]"
                  >
                    <IconLogout />
                    <span>Logout Admin</span>
                  </button>
                </>
              )}
            </div>

            <div className="mt-7 rounded-[20px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {BRAND}
              </p>
              <p className="mt-2 text-[11px] leading-5 text-slate-500">
                Fitur lama tetap ada, fitur baru juga masuk. Jadi kali ini gak ada drama
                website ngilang cuma gara-gara file diganti brutal.
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-sm animate-[fadeIn_.22s_ease] rounded-[24px] bg-white p-5 text-slate-900 shadow-2xl">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[18px] bg-slate-50">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/160x120?text=No+Image";
                }}
                className="h-16 object-contain"
              />
            </div>

            <div className="text-center">
              <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-sky-600">
                {selectedProduct.badge}
              </span>
            </div>

            <h3 className="mt-4 text-center text-[16px] font-extrabold">{selectedProduct.name}</h3>

            <p className="mt-2 text-center text-[20px] font-extrabold text-sky-600">
              {selectedProduct.price}
            </p>

            <p className="mt-3 text-center text-[12px] leading-6 text-slate-500">
              {selectedProduct.description}
            </p>

            <div className="mt-4 rounded-[18px] border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 text-[12px] font-extrabold text-slate-700">Keunggulan Produk</div>
              <div className="space-y-2">
                {selectedProduct.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2 text-[12px] text-slate-600">
                    <div className="mt-0.5 text-sky-500">
                      <IconCheckCircle />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <input
              ref={nameInputRef}
              placeholder="Nama"
              className="mt-4 w-full rounded-2xl border px-4 py-3 text-[13px] outline-none transition focus:border-sky-400"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />

            <input
              placeholder="WhatsApp"
              className="mt-3 w-full rounded-2xl border px-4 py-3 text-[13px] outline-none transition focus:border-sky-400"
              value={customerWhatsapp}
              onChange={(e) => setCustomerWhatsapp(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateOrder();
              }}
            />

            <textarea
              placeholder="Catatan"
              className="mt-3 w-full rounded-2xl border px-4 py-3 text-[13px] outline-none transition focus:border-sky-400"
              rows={3}
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
            />

            <button
              onClick={handleCreateOrder}
              disabled={submitting}
              className="mt-4 w-full rounded-2xl bg-sky-500 py-3 text-[12px] font-extrabold uppercase tracking-wide text-white transition-all duration-200 hover:bg-sky-600 disabled:opacity-60 active:scale-[0.98]"
            >
              {submitting ? "Memproses..." : "Lanjutkan Pembayaran"}
            </button>

            <button
              onClick={() => setSelectedProduct(null)}
              className="mt-3 w-full rounded-2xl bg-slate-200 py-3 text-[12px] font-bold text-slate-800 transition-all duration-200 hover:bg-slate-300 active:scale-[0.98]"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {showAdmin && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 px-4">
          <div className="max-h-[90vh] w-full max-w-lg animate-[fadeIn_.22s_ease] overflow-y-auto rounded-[24px] bg-white p-5 text-slate-900 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[16px] font-extrabold">{session ? "Panel Admin" : "Login Admin"}</h2>
              <button onClick={() => setShowAdmin(false)} className="text-lg">
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
                  className="mt-2 w-full rounded-2xl border px-4 py-3 text-[13px]"
                />

                <input
                  type="password"
                  placeholder="Password admin"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="mt-3 w-full rounded-2xl border px-4 py-3 text-[13px]"
                />

                <button
                  type="submit"
                  className="mt-4 w-full rounded-2xl bg-sky-500 py-3 text-[12px] font-bold text-white"
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
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-sky-500">
                      <IconBag />
                    </div>
                    <div className="mt-3 text-[14px] font-bold text-slate-700">Belum ada order</div>
                    <p className="mt-1 text-[12px] text-slate-500">Order yang masuk akan tampil di sini.</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="font-extrabold">{order.product_name}</div>
                      <div className="mt-1 text-[12px]">Harga: {formatRupiah(order.price)}</div>
                      <div className="text-[12px]">Nama: {order.customer_name}</div>
                      <div className="text-[12px]">WhatsApp: {order.customer_whatsapp}</div>
                      <div className="text-[12px]">Catatan: {order.note || "-"}</div>
                      <div className="text-[12px]">Order ID: {order.order_id || "-"}</div>

                      <div className="mt-3">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase ${
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
                          className="rounded-xl bg-green-500 px-4 py-2 text-[11px] font-bold text-white"
                        >
                          Tandai Berhasil
                        </button>

                        <button
                          onClick={() => markAsPending(order.id)}
                          className="rounded-xl bg-yellow-500 px-4 py-2 text-[11px] font-bold text-white"
                        >
                          Pending
                        </button>

                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="rounded-xl bg-rose-500 px-4 py-2 text-[11px] font-bold text-white"
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
              <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-sky-500 [animation-delay:0ms]" />
              <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-sky-500 [animation-delay:200ms]" />
              <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-sky-500 [animation-delay:400ms]" />
            </div>
            <h2 className="text-[16px] font-extrabold tracking-[0.2em] text-slate-800">{BRAND}</h2>
          </div>
        </div>
      )}

      {showGuide && (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-[#eaf4ff] px-4 py-6">
          <div className="mx-auto max-w-md animate-[fadeIn_.22s_ease]">
            <button
              onClick={() => setShowGuide(false)}
              className="mb-4 rounded-xl bg-white px-4 py-2 text-[12px] font-bold text-slate-700 shadow"
            >
              ← Kembali
            </button>

            <div className="mb-6 text-center">
              <h1 className="text-3xl font-extrabold text-sky-600">{BRAND}</h1>
              <div className="mt-2 text-slate-400">-------------</div>
            </div>

            <div className="overflow-hidden rounded-[24px] bg-white shadow-sm">
              <div className="border-b bg-slate-50 px-6 py-5">
                <h2 className="text-[18px] font-extrabold text-slate-800">🛒 PANDUAN CHECKOUT</h2>
              </div>

              <div className="space-y-6 px-6 py-6 text-slate-600">
                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-500 text-[12px] font-bold text-white">
                    1
                  </div>
                  <p className="text-[13px] leading-7">
                    Isi <span className="font-bold text-slate-700">Nama & WhatsApp</span> aktif
                    untuk pengiriman data produk.
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-500 text-[12px] font-bold text-white">
                    2
                  </div>
                  <p className="text-[13px] leading-7">
                    Klik tombol pembayaran dan <span className="font-bold text-slate-700">scan QRIS</span> yang muncul.
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-500 text-[12px] font-bold text-white">
                    3
                  </div>
                  <p className="text-[13px] leading-7">
                    Tunggu sistem <span className="font-bold text-slate-700">Pakasir</span> memproses pembayaran anda.
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-500 text-[12px] font-bold text-white">
                    4
                  </div>
                  <p className="text-[13px] leading-7">
                    Setelah transaksi selesai, anda akan diarahkan kembali ke website.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[24px] border border-orange-200 bg-orange-50 px-6 py-5 shadow-sm">
              <h3 className="text-[18px] font-extrabold text-orange-600">⚠️ PENTING: JANGAN REFRESH!</h3>
              <p className="mt-3 text-[13px] leading-7 text-orange-700">
                Dilarang menutup atau memuat ulang halaman saat proses transaksi.
                Jika ada kendala, hubungi CS segera.
              </p>
            </div>

            <button
              onClick={() => setShowGuide(false)}
              className="mt-6 w-full rounded-[22px] bg-sky-600 px-6 py-4 text-[14px] font-extrabold text-white shadow"
            >
              SAYA MENGERTI, LANJUTKAN ✅
            </button>
          </div>
        </div>
      )}

      {showSuccessPage && (
        <div className="fixed inset-0 z-[130] overflow-y-auto bg-[#eef3fb] px-4 py-8">
          <div className="mx-auto max-w-md animate-[fadeIn_.25s_ease]">
            <div className="rounded-[28px] bg-white p-6 text-center shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
              <div className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <svg className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="mt-5 text-[22px] font-extrabold text-slate-800">Pembayaran Berhasil</h2>
              <p className="mt-2 text-[12px] leading-6 text-slate-500">
                Transaksi kamu sudah diproses. Simpan order ID ini untuk cek status atau hubungi admin.
              </p>

              <div className="mt-5 rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Order ID
                </div>
                <div className="mt-2 text-[14px] font-extrabold text-slate-800">
                  {successOrderId || "-"}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setShowSuccessPage(false);
                    clearSuccessQuery();
                  }}
                  className="rounded-2xl bg-sky-500 px-4 py-3 text-[11px] font-extrabold uppercase tracking-wide text-white"
                >
                  Ke Beranda
                </button>

                <button
                  onClick={() =>
                    window.open(
                      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                        `Halo admin, saya sudah bayar. Order ID: ${successOrderId}`
                      )}`,
                      "_blank"
                    )
                  }
                  className="rounded-2xl bg-emerald-500 px-4 py-3 text-[11px] font-extrabold uppercase tracking-wide text-white"
                >
                  Hubungi Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showApiInfo && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-[24px] bg-white p-5 text-slate-900 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-extrabold">Info API</h3>
              <button onClick={() => setShowApiInfo(false)} className="text-lg">
                ✕
              </button>
            </div>
            <p className="mt-3 text-[12px] leading-6 text-slate-600">
              Halaman API ini sekarang gak cuma pajangan. Tombol explore, info,
              card fitur, dan music widget semuanya udah punya aksi yang jalan.
              Jadi tidak lagi sekadar dekorasi, syukurlah.
            </p>
            <button
              onClick={() => setShowApiInfo(false)}
              className="mt-4 w-full rounded-2xl bg-sky-500 py-3 text-[12px] font-extrabold text-white"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {selectedApiFeature && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-[24px] bg-white p-5 text-slate-900 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-extrabold">{selectedApiFeature.title}</h3>
              <button onClick={() => setSelectedApiFeature(null)} className="text-lg">
                ✕
              </button>
            </div>
            <p className="mt-3 text-[12px] leading-6 text-slate-600">{selectedApiFeature.desc}</p>
            <div className="mt-4 rounded-[18px] border border-slate-200 bg-slate-50 p-4 text-[12px] leading-6 text-slate-600">
              {selectedApiFeature.detail}
            </div>
            <button
              onClick={() => setSelectedApiFeature(null)}
              className="mt-4 w-full rounded-2xl bg-sky-500 py-3 text-[12px] font-extrabold text-white"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
  }
