"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function AuthHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      // Маленькая задержка, чтобы браузер успел записать данные
      setTimeout(() => {
        router.push('/');
      }, 100);
    }
  }, [searchParams, router]);

  return (
    <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
      <h1 className="text-2xl font-bold mb-2">Авторизация...</h1>
      <p className="text-gray-500">Загружаем ваш профиль</p>
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Suspense fallback={<div>Загрузка...</div>}>
        <AuthHandler />
      </Suspense>
    </div>
  );
}