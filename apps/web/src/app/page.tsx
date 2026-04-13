import { colors } from "@ihotel/config";
import { HotelList } from "./components/HotelList";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-black/[0.06] bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1
            className="text-2xl font-medium"
            style={{ color: colors.primary }}
          >
            iHotel
          </h1>
          <nav className="flex gap-6 text-sm" style={{ color: colors.textSecondary }}>
            <a href="#" className="hover:opacity-70">Буудлууд</a>
            <a href="#" className="hover:opacity-70">Тухай</a>
            <a href="#" className="hover:opacity-70">Холбоо барих</a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section
          className="py-20 text-center"
          style={{ backgroundColor: colors.bg }}
        >
          <div className="max-w-2xl mx-auto px-6">
            <h2
              className="text-4xl font-medium mb-4"
              style={{ color: colors.textPrimary }}
            >
              Монголын зочид буудлын{" "}
              <span style={{ color: colors.primary }}>удирдлагын систем</span>
            </h2>
            <p
              className="text-lg mb-8"
              style={{ color: colors.textSecondary }}
            >
              Захиалга, зочид, маркетинг — бүгдийг нэг дороос удирд
            </p>
            <div className="flex gap-3 justify-center">
              <button
                className="px-6 py-3 rounded-xl text-white font-medium hover:opacity-90 transition"
                style={{ backgroundColor: colors.primary }}
              >
                Эхлэх
              </button>
              <button
                className="px-6 py-3 rounded-xl font-medium border-2 hover:opacity-70 transition"
                style={{
                  color: colors.primary,
                  borderColor: colors.primary,
                }}
              >
                Дэлгэрэнгүй
              </button>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-16">
          <h3
            className="text-2xl font-medium mb-8"
            style={{ color: colors.textPrimary }}
          >
            Онцлох буудлууд
          </h3>
          <HotelList />
        </section>
      </main>

      <footer
        className="border-t border-black/[0.06] py-8 text-center text-sm"
        style={{ color: colors.textSecondary }}
      >
        &copy; 2026 iHotel. Бүх эрх хуулиар хамгаалагдсан.
      </footer>
    </div>
  );
}
