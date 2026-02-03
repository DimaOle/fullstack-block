"use client";

import { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "./components/Header";
import LoginModal from "./components/LoginModal";
import SignUpModal from "./components/SignUpModal";
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
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  // Проверяем токен при загрузке страницы
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token)
    if (token) setIsAuth(true);
  }, []);

  // Логика выхода
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      // Убедись, что путь /api/auth/logOut совпадает с твоим контроллером в NestJS
      const response = await fetch("http://localhost:3000/api/auth/logOut", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${token}`, 
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        localStorage.removeItem("token");
        setIsAuth(false);
        window.location.href = "/"; 
      } else {
        const errorData = await response.json();
        alert(`Ошибка выхода: ${errorData.message || 'Что-то пошло не так'}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Не удалось связаться с сервером.");
    }
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header 
          isAuth={isAuth} 
          onOpenLogin={() => setIsLoginOpen(true)} 
          onOpenSignUp={() => setIsSignUpOpen(true)} // Теперь передается правильно
          onLogout={handleLogout} 
        />
        
        {isLoginOpen && (
          <LoginModal 
            onClose={() => setIsLoginOpen(false)} 
            onSuccess={() => setIsAuth(true)} 
          />
        )}

        {isSignUpOpen && (
          <SignUpModal 
            onClose={() => setIsSignUpOpen(false)} 
            onSuccess={() => setIsAuth(true)} 
          />
        )}

        {children}
      </body>
    </html>
  );
}