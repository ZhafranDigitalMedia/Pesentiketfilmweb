"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProfileController } from "../controllers/ProfileController";
import { UserProfile } from "../models/UserProfile";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ProfileController.loadProfile()
      .then(setUser)
      .catch(() => router.replace("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading || !user) {
    return <p style={{ color: "white", padding: "50px" }}>Loading profile...</p>;
  }

  return (
    <div className="min-h-screen bg-[#6A77E0] px-4 py-6">
      <div className="bg-white rounded-3xl p-8 max-w-4xl mx-auto shadow-xl">

        <h2 className="text-3xl font-bold mb-6 text-black">Profile</h2>

        <div className="bg-gradient-to-br from-indigo-500 to-purple-500
                      rounded-3xl p-6 sm:p-8 text-white text-center
                      max-w-md mx-auto mb-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full
                        bg-white/30 flex items-center justify-center
                        text-3xl sm:text-4xl mx-auto mb-4">
            👤
          </div>

          <h3 className="text-lg sm:text-xl font-semibold">
            {user.getName()}
          </h3>
          <p className="text-sm sm:text-base mt-1">✉️ {user.getEmail()}</p>
          <p className="text-sm sm:text-base">📞 {user.getPhone()}</p>
          <p className="text-sm sm:text-base mt-2">
            Role: <span className="font-semibold capitalize">{user.getRole()}</span>
          </p>
        </div>

        {user.getRole() !== "admin" && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <StatCard icon="🎟️" value={user.getTotalTicket()} label="Tiket Dibeli" />
            <StatCard icon="❤️" value={user.getTotalFavorite()} label="Film Favorit" />
          </div>
        )}

        <button
          onClick={async () => {
            await ProfileController.logout();
            router.replace("/login");
          }}
          className="w-full py-3 rounded-xl bg-red-500 text-white font-semibold"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: string;
  value: number;
  label: string;
}) {
  return (
    <div className="bg-gray-50 rounded-2xl p-4 text-center shadow-sm">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xl font-bold text-gray-800">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}
