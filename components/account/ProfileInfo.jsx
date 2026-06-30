import {
  User,
  Phone,
  Mail,
  Crown,
  Pencil,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProfileInfo({ user }) {
  return (
    <div>
      <div className="flex justify-between mb-8">
        <h2 className="font-bold text-md">
          PROFILE INFORMATION
        </h2>

        <button className="border p-2 rounded-lg text-[#f26b3a] cursor-pointer hover:bg-[#f26b3a] hover:text-white transition-colors">
          <Pencil size={16} />
        </button>
      </div>

      <div className="flex gap-5 mb-8 ">
        <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
          <User size={40} />
        </div>

        <div className="bg-gray-100 rounded-xl p-5 flex-1">
          <h3 className="text-2xl font-semibold mb-2">
            {user.name}
          </h3>

          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              <Phone size={16} />

                {user.phone? user.phone : "Not Provided"}
            </div>

            <div className="flex gap-2">
              <Mail size={16} />

              {user.email}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}