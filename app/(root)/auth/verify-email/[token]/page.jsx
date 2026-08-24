import VerifyEmailClientView from "./VerifyEmailClientView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Verify Email | Stoneza",
  description: "Verify your Stoneza email account address.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function VerifyEmailPage({ params }) {
  const { token } = await params;
  return <VerifyEmailClientView token={token} />;
}