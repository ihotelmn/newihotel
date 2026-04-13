"use client";

import { useEffect, useState } from "react";
import { fetchHotels } from "@ihotel/api";
import { colors, radius } from "@ihotel/config";
import type { Hotel } from "@ihotel/types";

export function HotelList() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotels()
      .then((all) => setHotels(all.filter((h) => h.is_featured).slice(0, 6)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12" style={{ color: colors.textSecondary }}>
        Уншиж байна...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hotels.map((hotel) => (
        <div
          key={hotel.id}
          className="bg-white border overflow-hidden hover:shadow-md transition"
          style={{
            borderColor: colors.border,
            borderRadius: radius.lg,
          }}
        >
          <img
            src={hotel.image_url}
            alt={hotel.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h4
              className="text-lg font-medium truncate"
              style={{ color: colors.textPrimary }}
            >
              {hotel.name}
            </h4>
            <p
              className="text-sm mt-1"
              style={{ color: colors.textSecondary }}
            >
              {hotel.city} &middot; ★ {hotel.avg_rating || "—"} &middot;
              ₮{hotel.price_min.toLocaleString()}~
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
