import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import CustomersTable from "@/components/admin/customers/CustomersTable";

import User from "@/models/User.model";
import Order from "@/models/Order.model";
import { connectDB } from "@/lib/databaseConnection";

export default async function CustomersPage() {
  await connectDB();

  const users = await User.find({ role: { $in: ["user", "customer"] }, deletedAt: null }).sort({ createdAt: -1 }).lean();

  const customers = await Promise.all(
    users.map(async (user) => {
      const orders = await Order.find({ user: user._id }).lean();
      const totalSpend = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

      return {
        ...user,
        orderCount: orders.length,
        totalSpend,
      };
    }),
  );

  return (
    <>
      <Breadcrumbs />
      <PageHeader title="Customers" description="View profiles, addresses, purchase history, and spending metrics." />
      <CustomersTable customers={JSON.parse(JSON.stringify(customers))} />
    </>
  );
}
