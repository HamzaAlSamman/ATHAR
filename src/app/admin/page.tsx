import AdminDashboard from "./AdminDashboard";

export const metadata = {
  title: "لوحة تحكم أثر",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
