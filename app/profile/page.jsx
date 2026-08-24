import ProfileClientView from "./ProfileClientView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Account & Profile | Stoneza",
  description: "Manage your Stoneza account details, password, delivery addresses, and view stone specification enquiries.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilePage() {
  return <ProfileClientView />;
}