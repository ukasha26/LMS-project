import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Role } from "@/data/seed";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("student");
  const [form, setForm] = useState({ name: "", email: "", password: "", studentId: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const r = await register({ ...form, role });
      if (!r.ok) { toast.error(r.error || "Registration failed"); return; }
      toast.success("Account created — welcome to VU LMS!");
      navigate("/dashboard");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-6">
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="text-center">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">VU LMS</span>
          </Link>
          <CardTitle className="font-display text-2xl">Create your account</CardTitle>
          <CardDescription>Join the Virtual University learning community</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={role} onValueChange={v => setRole(v as Role)} className="mb-4">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
            </TabsList>
          </Tabs>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@vu.edu.pk" />
            </div>
            {role === "student" && (
              <div className="space-y-2">
                <Label htmlFor="sid">Student ID</Label>
                <Input id="sid" required value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })} placeholder="BSCS-22-XXX" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required minLength={6} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters" />
            </div>
            <Button type="submit" className="w-full">Create Account</Button>
          </form>
          <p className="text-sm text-center mt-6 text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
