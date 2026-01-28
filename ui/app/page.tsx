"use client";

import { useState, useEffect } from 'react';
import Header from '@/app/components/Header';
import LoginModal from '@/app/components/LoginModal';


export default function HomePage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsAuth(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuth(false);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      
      <Header 
        isAuth={isAuth} 
        onOpenLogin={() => setIsLoginOpen(true)} 
        onLogout={handleLogout} 
      />

      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-20">
        <h1 className="text-7xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Music for everyone.
        </h1>
        <button className="bg-gray-900 text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl">
          Начать слушать
        </button>
      </main>

      {isLoginOpen && (
        <LoginModal 
          onClose={() => setIsLoginOpen(false)} 
          onSuccess={() => setIsAuth(true)} 
        />
      )}
    </div>
  );
}