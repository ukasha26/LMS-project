import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";

const demoAccounts = [
  { role: "Admin", email: "admin@vu.edu.pk", password: "admin123" },
  { role: "Instructor", email: "sara@vu.edu.pk", password: "instructor123" },
  { role: "Student", email: "student@vu.edu.pk", password: "student123" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation() as { state?: { from?: string } };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await login(email, password);
      setBusy(false);
      if (!r.ok) { toast.error(r.error || "Login failed"); return; }
      toast.success("Welcome back!");
      navigate(loc.state?.from || "/dashboard");
    } catch (err) {
      setBusy(false);
      toast.error((err as Error).message);
    }
  };

  const fillDemo = (acc: typeof demoAccounts[number]) => {
    setEmail(acc.email);
    setPassword(acc.password);
  };

  return (
    <div className="min-h-screen flex bg-muted/40">
      {/* Left brand panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-hero text-primary-foreground p-12 flex-col justify-between relative overflow-hidden">
        <Link to="/" className="flex items-center gap-2 relative z-10">
          <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-accent-foreground" />
          </div>
          <div>
            <div className="font-display font-bold text-lg leading-none">VU LMS</div>
            <div className="text-xs text-primary-foreground/70 mt-1">Virtual University</div>
          </div>
        </Link>
        <div className="relative z-10 max-w-md">
          <h1 className="font-display text-4xl font-bold mb-4 text-balance">Your campus, in the cloud.</h1>
          <p className="text-primary-foreground/80">Access courses, lessons, quizzes and grades — all in one beautiful dashboard.</p>
        </div>
        <div className="text-xs text-primary-foreground/60 relative z-10">© 2026 Virtual University. All rights reserved.</div>
        <div className="absolute -bottom-32 -right-32 h-96 w-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute -top-20 -left-20 h-80 w-80 bg-primary-glow/30 rounded-full blur-3xl" />
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="lg:hidden flex items-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="font-display font-bold">VU LMS</div>
          </div>
          <Card className="shadow-elevated border-border/60">
            <CardHeader>
              <CardTitle className="text-2xl font-display">Sign in to your portal</CardTitle>
              <CardDescription>Use your VU credentials to access courses, quizzes and progress.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@vu.edu.pk" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a className="text-xs text-primary hover:underline" href="#">Forgot?</a>
                  </div>
                  <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>{busy ? "Signing in…" : "Sign In"}</Button>
              </form>
              <div className="mt-6">
                <div className="text-xs text-muted-foreground mb-2">Quick demo accounts:</div>
                <div className="grid grid-cols-3 gap-2">
                  {demoAccounts.map(acc => (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => fillDemo(acc)}
                      className="text-xs p-2 rounded border bg-muted/40 hover:bg-muted hover:border-primary transition-colors"
                    >
                      <div className="font-semibold">{acc.role}</div>
                      <div className="text-muted-foreground truncate">{acc.email}</div>
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-sm text-center mt-6 text-muted-foreground">
                New here? <Link to="/register" className="text-primary font-medium hover:underline">Create an account</Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
