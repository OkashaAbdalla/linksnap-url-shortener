import { useState, useEffect } from "react";

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-cyan-500";
  const icon = type === "success" ? "check_circle" : type === "error" ? "error" : "info";

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl ${bgColor} text-white shadow-lg animate-slide-up`}>
      <span className="material-symbols-outlined text-[20px]">{icon}</span>
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-80">
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
}

export default Toast;
