"use client";

// Добавим интерфейс для ясности
interface HeaderProps {
  isAuth: boolean;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export default function Header({ isAuth, onOpenLogin, onLogout }: HeaderProps) {
  return (
    <header className="w-full bg-white border-b p-4 flex justify-between items-center px-8 sticky top-0 z-40">
      <div className="text-xl font-bold tracking-tight text-blue-600 cursor-pointer">
        BEATFLOW
      </div>
      
      <div className="flex items-center gap-4">
        {isAuth ? (
          <>
            <button className="text-sm font-semibold px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">
              Profile
            </button>
            {/* Кнопка Logout теперь вызывает функцию с fetch запросом */}
            <button 
              onClick={onLogout} 
              className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={onOpenLogin} 
              className="text-sm font-semibold px-4 py-2 hover:text-blue-600 transition-colors"
            >
              Log in
            </button>
            <button className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-700 shadow-md">
              Sign up
            </button>
          </>
        )}
      </div>
    </header>
  );
}