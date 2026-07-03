import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import OrderTimeline from "@/components/admin/orders/OrderTimeline";

export default function OrderDetailsPage() {
  return (
    <>
      <Breadcrumbs />
      <PageHeader title="Order Details" description="View customer data, order items, and timeline progression." />
      <OrderTimeline status="Processing" />
    </>
  );
}
