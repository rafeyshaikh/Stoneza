import RegisterClientView from "./RegisterClientView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Create an Account | Stoneza",
  description: "Create your Stoneza account to access natural stone catalogs, request quotation estimates, and manage custom project orders.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterPage() {
  return <RegisterClientView />;
}
