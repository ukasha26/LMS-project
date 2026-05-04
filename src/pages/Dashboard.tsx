import { useAuth } from "@/context/AuthContext";
import StudentDashboard from "./student/StudentDashboard";
import InstructorDashboard from "./instructor/InstructorDashboard";
import AdminDashboard from "./admin/AdminDashboard";

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role === "admin") return <AdminDashboard />;
  if (user.role === "instructor") return <InstructorDashboard />;
  return <StudentDashboard />;
}
