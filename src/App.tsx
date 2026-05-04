import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/context/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import BrowseCourses from "./pages/student/BrowseCourses";
import MyCourses from "./pages/student/MyCourses";
import CourseDetail from "./pages/student/CourseDetail";
import LessonView from "./pages/student/LessonView";
import QuizAttempt from "./pages/student/QuizAttempt";
import MyResults from "./pages/student/MyResults";
import ManageCourses from "./pages/instructor/ManageCourses";
import ManageQuizzes from "./pages/instructor/ManageQuizzes";
import MyStudents from "./pages/instructor/MyStudents";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminReports from "./pages/admin/AdminReports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/courses" element={<BrowseCourses />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/my-courses" element={<ProtectedRoute roles={["student"]}><MyCourses /></ProtectedRoute>} />
              <Route path="/my-results" element={<ProtectedRoute roles={["student"]}><MyResults /></ProtectedRoute>} />
              <Route path="/courses/:courseId/lessons/:lessonId" element={<ProtectedRoute roles={["student", "instructor", "admin"]}><LessonView /></ProtectedRoute>} />
              <Route path="/quiz/:id" element={<ProtectedRoute roles={["student"]}><QuizAttempt /></ProtectedRoute>} />

              <Route path="/instructor/courses" element={<ProtectedRoute roles={["instructor"]}><ManageCourses /></ProtectedRoute>} />
              <Route path="/instructor/quizzes" element={<ProtectedRoute roles={["instructor"]}><ManageQuizzes /></ProtectedRoute>} />
              <Route path="/instructor/students" element={<ProtectedRoute roles={["instructor"]}><MyStudents /></ProtectedRoute>} />

              <Route path="/admin/users" element={<ProtectedRoute roles={["admin"]}><AdminUsers /></ProtectedRoute>} />
              <Route path="/admin/courses" element={<ProtectedRoute roles={["admin"]}><AdminCourses /></ProtectedRoute>} />
              <Route path="/admin/reports" element={<ProtectedRoute roles={["admin"]}><AdminReports /></ProtectedRoute>} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
