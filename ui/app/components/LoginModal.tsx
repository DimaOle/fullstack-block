"use client";
import { useState } from 'react';

export default function LoginModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/auth/login-local`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json()
      console.log(data)
      if (response.ok) {
        localStorage.setItem('token', data.access_token.split(' ')[1]);
        onSuccess();
        onClose();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 flex flex-col relative animate-in zoom-in-95 duration-300">
        <h2 className="text-3xl font-extrabold text-center mb-2">Welcome back</h2>
        <p className="text-gray-500 text-center mb-8">Войдите в свой аккаунт</p>
        
        <div className="space-y-4 mb-6">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full p-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full p-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500" />
        </div>

        <button onClick={handleLogin} className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold text-lg mb-6">Log in</button>

        <div className="flex gap-4 mb-6">
          <button onClick={() => window.location.href = `http://localhost:3000/api/auth/google?mode=login`} className="flex-1 border-2 p-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" /> Google
          </button>
          <button onClick={() => window.location.href = `http://localhost:3000/api/auth/git?mode=login`} className="flex-1 border-2 p-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm">
            <img src="https://www.svgrepo.com/show/512317/github-142.svg" className="w-5 h-5" alt="GitHub" /> GitHub
          </button>
        </div>

        <button onClick={onClose} className="text-gray-400 text-sm font-semibold">Cancel and go back</button>
      </div>
    </div>
  );
}