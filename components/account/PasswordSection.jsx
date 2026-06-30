import { Lock } from "lucide-react";

export default function PasswordSection() {
  return (
    <>
      <h2 className="font-bold text-md mb-4">
        PASSWORD SETTINGS
      </h2>

      <div className="bg-gray-100 rounded-xl p-5 flex justify-between items-center mb-8">
        <div className="flex gap-4">
          <div className="bg-white p-3 rounded-lg">
            <Lock size={18} />
          </div>

          <div>
            <p className="tracking-[4px] font-bold">
              ••••••••••••
            </p>

            <p className="text-sm text-gray-500">
              Password
            </p>
          </div>
        </div>

        <button className="border border-[#f26b3a] text-[#f26b3a] px-5 py-3 rounded-lg text-sm">
          UPDATE PASSWORD
        </button>
      </div>
    </>
  );
}