"use client"; // Добавляем, чтобы работали хуки и события кнопок

import { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "./components/Header"; // Импортируй свой Header
import LoginModal from "./components/LoginModal"; // И модалку
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Проверяем токен при загрузке
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAuth(true);
  }, []);

  // Тот самый Logout с запросом на бэк
const handleLogout = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch("http://localhost:3000/api/auth/logOut", {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Authorization": `Bearer ${token}`, 
        "Content-Type": "application/json"
  }
    });

    if (response.ok) {
      // Если бэк ответил 200-299 OK
      localStorage.removeItem("token");
      setIsAuth(false);
      // Можно просто сбросить стейт или перезагрузить
      window.location.href = "/"; 
    } else {
      // Если бэк вернул ошибку (например, 401 или 500)
      const errorData = await response.json();
      console.log
      alert(`Ошибка выхода: ${errorData.message || 'Что-то пошло не так'}`);
    }
  } catch (error) {
    // Если сервер вообще недоступен (Network Error)
    console.error("Network error:", error);
    alert("Не удалось связаться с сервером. Попробуйте позже.");
  }
};

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header 
          isAuth={isAuth} 
          onOpenLogin={() => setIsLoginOpen(true)} 
          onLogout={handleLogout} 
        />
        
        {isLoginOpen && (
          <LoginModal 
            onClose={() => setIsLoginOpen(false)} 
            onSuccess={() => setIsAuth(true)} 
          />
        )}

        {children}
      </body>
    </html>
  );
}