import LoginClientView from "./LoginClientView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sign In | Stoneza",
  description: "Sign in to your Stoneza account to manage your profile, view orders, and request stone specifications.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <LoginClientView />;
}
