import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  GraduationCap, LayoutDashboard, BookOpen, Users, FileQuestion, LogOut,
  Library, ClipboardList, Settings, Bell, Search, BarChart3, UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navByRole = {
  admin: [
    { to: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { to: "/admin/users", icon: UserCog, label: "Users" },
    { to: "/admin/courses", icon: BookOpen, label: "All Courses" },
    { to: "/admin/reports", icon: BarChart3, label: "Reports" },
  ],
  instructor: [
    { to: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { to: "/instructor/courses", icon: BookOpen, label: "My Courses" },
    { to: "/instructor/quizzes", icon: FileQuestion, label: "Quizzes" },
    { to: "/instructor/students", icon: Users, label: "Students" },
  ],
  student: [
    { to: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { to: "/courses", icon: Library, label: "Browse Courses" },
    { to: "/my-courses", icon: BookOpen, label: "My Courses" },
    { to: "/my-results", icon: ClipboardList, label: "Quiz Results" },
  ],
} as const;

const roleBadge = {
  admin: "bg-accent text-accent-foreground",
  instructor: "bg-primary-glow/20 text-primary",
  student: "bg-success/15 text-success",
};

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;
  const nav = navByRole[user.role];

  return (
    <div className="min-h-screen flex bg-muted/40">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground sticky top-0 h-screen">
        <Link to="/dashboard" className="flex items-center gap-2 px-6 py-5 border-b border-sidebar-border">
          <div className="h-9 w-9 rounded-lg bg-gradient-accent flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <div className="font-display font-bold leading-none text-white">VU LMS</div>
            <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/70 mt-0.5">Virtual University</div>
          </div>
        </Link>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] uppercase tracking-wider text-sidebar-foreground/50">Main</div>
          {nav.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/dashboard"}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-white shadow-sm"
                  : "hover:bg-sidebar-accent/60 text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
          <div className="px-3 pt-4 pb-2 text-[10px] uppercase tracking-wider text-sidebar-foreground/50">Account</div>
          <NavLink to="/profile" className={({ isActive }) => cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm",
            isActive ? "bg-sidebar-accent text-white" : "hover:bg-sidebar-accent/60"
          )}>
            <Settings className="h-4 w-4" /> Profile
          </NavLink>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="rounded-lg bg-sidebar-accent/40 p-3">
            <div className="text-xs text-sidebar-foreground/80">Logged in as</div>
            <div className="text-sm font-semibold text-white truncate">{user.name}</div>
            <Badge className={cn("mt-2 capitalize", roleBadge[user.role])} variant="secondary">{user.role}</Badge>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-card border-b flex items-center gap-4 px-4 lg:px-8 sticky top-0 z-30">
          <Link to="/dashboard" className="flex lg:hidden items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-gradient-primary flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">VU LMS</span>
          </Link>
          <div className="hidden md:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search courses, lessons, quizzes…" className="pl-9 bg-muted/60 border-transparent focus-visible:bg-background" />
            </div>
          </div>
          <div className="flex-1 md:hidden" />
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:bg-muted rounded-full pr-3 pl-1 py-1 transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.split(" ").map(s => s[0]).join("").slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium leading-none">{user.name}</div>
                  <div className="text-xs text-muted-foreground capitalize mt-0.5">{user.role}</div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <Settings className="h-4 w-4 mr-2" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { logout(); navigate("/login"); }}>
                <LogOut className="h-4 w-4 mr-2" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card border-t flex justify-around py-2">
          {nav.slice(0, 4).map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === "/dashboard"}
              className={({ isActive }) => cn(
                "flex flex-col items-center gap-1 px-2 py-1 text-xs",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
