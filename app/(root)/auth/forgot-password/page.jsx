import ForgotPasswordClientView from "./ForgotPasswordClientView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Forgot Password | Stoneza",
  description: "Reset your Stoneza account password.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClientView />;
}
