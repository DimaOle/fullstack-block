"use client";

// На этой странице нам больше не нужен Header и LoginModal, 
// так как они теперь «живут» в layout.tsx

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-20">
      <h1 className="text-7xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
        Music for everyone.
      </h1>
      <button className="bg-gray-900 text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl hover:scale-105 transition-transform">
        Начать слушать
      </button>
    </div>
  );
}