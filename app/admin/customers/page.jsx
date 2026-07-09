import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import CustomersTable from "@/components/admin/customers/CustomersTable";

import User from "@/models/User.model";
import { connectDB } from "@/lib/databaseConnection";

export default async function CustomersPage() {
  await connectDB();

  const users = await User.find({ role: { $in: ["user", "customer"] } }).sort({ createdAt: -1 }).lean();
 

  return (
    <>
      <Breadcrumbs />
      <PageHeader title="Customers" description="View profiles, addresses, purchase history, and spending metrics." />
      <CustomersTable customers={JSON.parse(JSON.stringify(users))} />
    </>
  );
}
