"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Состояния для форм
  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });
  const [passError, setPassError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/user/myProfile", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setUserData(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 1. ОБНОВЛЕНИЕ ДАННЫХ ПРОФИЛЯ
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    const token = localStorage.getItem("token");

    // Собираем данные из формы (можно использовать FormData)
    const form = e.currentTarget as HTMLFormElement;
    const updateData = {
      firstName: (form.elements.namedItem("firstName") as HTMLInputElement).value,
      lastName: (form.elements.namedItem("lastName") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
    };

    try {
      const res = await fetch("http://localhost:3000/api/user/myProfile", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(updateData),
      });

      if (res.ok) {
        setSuccessMsg("Profile updated successfully!");
        fetchProfile(); // Обновляем данные в стейте
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // 2. СМЕНА ПАРОЛЯ
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError("");
    setSuccessMsg("");

    if (passwords.new !== passwords.confirm) {
      setPassError("New passwords do not match!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/user/changePass", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          password: passwords.old,
          newPassword: passwords.new,
          repeatPassword: passwords.confirm,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMsg("Password changed successfully!");
        setPasswords({ old: "", new: "", confirm: "" }); // Сброс формы
      } else {
        setPassError(data.message || "Failed to change password");
      }
    } catch (err) {
      setPassError("Server error. Try again later.");
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse">Loading profile...</div>;

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors mb-8 font-semibold group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Feed
        </button>

        {successMsg && (
          <div className="bg-green-50 text-green-600 p-4 rounded-2xl mb-6 text-center font-bold animate-in fade-in zoom-in-95">
            {successMsg}
          </div>
        )}

        <div className="flex gap-8 border-b border-gray-200 mb-8">
          {["profile", "songs"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-lg font-bold capitalize transition-all ${
                activeTab === tab ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-400"
              }`}
            >
              My {tab}
            </button>
          ))}
        </div>

        {activeTab === "profile" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">👤 Personal Information</h2>
              <form onSubmit={handleUpdateProfile}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">First Name</label>
                    <input name="firstName" type="text" defaultValue={userData?.firstName} className="w-full p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Last Name</label>
                    <input name="lastName" type="text" defaultValue={userData?.lastName} className="w-full p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Email Address</label>
                    <input name="email" type="email" defaultValue={userData?.email} className="w-full p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Your Roles</label>
                    <div className="flex gap-2">
                      {userData?.role.map((role: string) => (
                        <span key={role} className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">{role}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <button type="submit" className="mt-8 w-full md:w-auto bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                  Update Profile
                </button>
              </form>
            </section>

            <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-red-500">🔐 Security</h2>
              <p className="text-gray-400 text-sm mb-6">Change your password to keep your account secure</p>
              
              <form onSubmit={handlePasswordChange} className="space-y-4">
                {passError && <div className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-xl text-center">{passError}</div>}
                
                <input 
                  type="password" 
                  value={passwords.old}
                  placeholder="Current Password" 
                  className="w-full p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-red-400 outline-none transition-all"
                  onChange={(e) => setPasswords({...passwords, old: e.target.value})}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="password" 
                    value={passwords.new}
                    placeholder="New Password" 
                    className="w-full p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 outline-none transition-all"
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                  />
                  <input 
                    type="password" 
                    value={passwords.confirm}
                    placeholder="Confirm New Password" 
                    className="w-full p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 outline-none transition-all"
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                  />
                </div>
                <button type="submit" className="w-full md:w-auto border-2 border-red-500 text-red-500 px-10 py-4 rounded-2xl font-bold hover:bg-red-50 transition-all">
                  Change Password
                </button>
              </form>
            </section>
          </div>
        )}

        {activeTab === "songs" && (
           <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 animate-in slide-in-from-bottom-4 duration-500">
             <p className="text-gray-400 text-lg">Tracks you uploaded will appear here.</p>
           </div>
        )}
      </div>
    </main>
  );
}