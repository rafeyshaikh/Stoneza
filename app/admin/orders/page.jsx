import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import OrdersTable from "@/components/admin/orders/OrdersTable";

import Order from "@/models/Order.model";
import { connectDB } from "@/lib/databaseConnection";

export default async function AdminOrdersPage() {
  await connectDB();
  const orders = await Order.find({}).sort({ createdAt: -1 }).limit(100).lean();

  return (
    <>
      <Breadcrumbs />
      <PageHeader title="Orders" description="Track Razorpay orders, payments, statuses, and delivery progression." />
      <OrdersTable orders={JSON.parse(JSON.stringify(orders))} />
    </>
  );
}
