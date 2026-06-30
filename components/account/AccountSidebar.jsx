import {
  User,
  ClipboardList,
  Coins,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

export default function AccountSidebar() {
  const { logout } = useAuth();

  return (
    <div className="bg-white rounded-2xl overflow-hidden h-fit">
      <div className="border-l-4 border-[#f26b3a] bg-[#f9f4f1] px-5 py-5 flex items-center gap-3">
        <User className="w-5 h-5 text-[#f26b3a]" />

        <span className="font-medium">
          Profile
        </span>
      </div>

      <SidebarItem
        icon={<ClipboardList size={18} />}
        text="Transaction Summary"
      />

      <SidebarItem
        icon={<Coins size={18} />}
        text="Points Ledger"
      />

      <SidebarItem
        icon={<ShoppingBag size={18} />}
        text="Orders"
      />

      <div className="p-4">
        <button className="w-full border border-gray-300 rounded-lg py-4 flex items-center justify-between px-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={logout}>
          Logout

          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}

function SidebarItem({ icon, text }) {
  return (
    <button className="w-full border-t border-gray-200 px-5 py-6 flex gap-3 hover:bg-gray-50">
      {icon}

      {text}
    </button>
  );
}