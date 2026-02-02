"use client";
import { useState } from 'react';

export default function LoginModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError("");
    try {
      const response = await fetch(`http://localhost:3000/api/auth/login-local`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (response.ok) {
        // Достаем токен (убираем Bearer если он есть)
        const token = data.access_token.includes(' ') 
          ? data.access_token.split(' ')[1] 
          : data.access_token;
          
        localStorage.setItem('token', token);
        onSuccess();
        onClose();
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (error) {
      setError("Unable to contact the server");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 flex flex-col relative animate-in zoom-in-95 duration-300">
        
        {/* КРЕСТИК как в SignUp */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
        >
          <span className="text-xl">✕</span>
        </button>

        <h2 className="text-3xl font-extrabold text-center mb-2">Welcome back</h2>
        <p className="text-gray-500 text-center mb-8">Log in to your account</p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email" 
            className="w-full p-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 transition-all" 
          />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
            className="w-full p-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 transition-all" 
          />
        </div>

        <button 
          onClick={handleLogin} 
          className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold text-lg mb-6 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          Log in
        </button>

        {/* РАЗДЕЛИТЕЛЬ как в SignUp */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-2 bg-white text-gray-400 font-semibold">Or continue with</span>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => window.location.href = `http://localhost:3000/api/auth/google?mode=login`} 
            className="flex-1 border-2 border-gray-100 p-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm hover:bg-gray-50 transition-all"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" /> Google
          </button>
          <button 
            onClick={() => window.location.href = `http://localhost:3000/api/auth/git?mode=login`} 
            className="flex-1 border-2 border-gray-100 p-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm hover:bg-gray-50 transition-all"
          >
            <img src="https://www.svgrepo.com/show/512317/github-142.svg" className="w-5 h-5" alt="GitHub" /> GitHub
          </button>
        </div>

      </div>
    </div>
  );
}