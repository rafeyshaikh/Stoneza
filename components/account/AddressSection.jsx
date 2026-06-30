import { MapPin, Pencil } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AddressSection() {
  const { user } = useAuth();

  return (
    <>
      <h2 className="font-bold text-md mb-4">
        ADDRESS DETAILS
      </h2>

      <div className="bg-gray-100 rounded-xl p-5 relative mb-4">
        <button className="absolute top-4 right-4">
          <Pencil size={16} />
        </button>

        <div className="flex gap-4">
          <div className="bg-white p-3 rounded-lg h-fit">
            <MapPin size={18} />
          </div>

          <div>
            <div className="flex gap-3 items-center mb-2">
              <h3 className="font-bold">
                {user?.name}
              </h3>

              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                DEFAULT
              </span>
            </div>

            <p>{user?.address?.street || "Not provided"}</p>

            <p className="text-gray-500">
              {user?.address?.city || "Not provided"}, {user?.address?.state || "Not provided"} - {user?.address?.postalCode || "Not provided"}
            </p>

            <p className="text-gray-500">
              {user?.address?.country || "Not provided"}
            </p>
          </div>
        </div>
      </div>

      <button className="border border-[#f26b3a] text-[#f26b3a] px-5 py-3 rounded-lg text-sm">
        + ADD NEW ADDRESS
      </button>
    </>
  );
}