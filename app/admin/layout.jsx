import AdminLayout from "@/components/admin/layout/AdminLayout";

export const metadata = {
  title: "Stoneza Admin",
  description: "Stoneza admin dashboard",
};

export default function AdminRootLayout({ children }) {
  return <AdminLayout>{children}</AdminLayout>;
}
