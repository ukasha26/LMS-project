import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Users, Award, ArrowRight, CheckCircle2, PlayCircle } from "lucide-react";
import heroImg from "@/assets/lms-hero.jpg";
import CourseCard from "@/components/CourseCard";
import { db } from "@/data/store";

export default function Landing() {
  const featured = db.listCourses().filter(c => c.status === "published").slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-display font-bold leading-none">VU LMS</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">Virtual University</div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#courses" className="hover:text-primary transition-colors">Courses</a>
            <a href="#roles" className="hover:text-primary transition-colors">For Roles</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost"><Link to="/login">Sign in</Link></Button>
            <Button asChild><Link to="/register">Get Started</Link></Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
        <div className="container py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1 rounded-full text-xs">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              Spring Semester 2026 — Enrollments Open
            </div>
            <h1 className="font-display text-4xl lg:text-6xl font-bold text-balance leading-[1.05]">
              Learn anything,<br />
              <span className="text-accent">anytime, anywhere.</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-xl">
              VU LMS is a complete virtual learning platform — browse hundreds of courses, study lessons, attempt quizzes and track your progress. Built for students, instructors and administrators.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow">
                <Link to="/register">Start Learning <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <Link to="/login"><PlayCircle className="mr-2 h-4 w-4" /> Sign in to Portal</Link>
              </Button>
            </div>
            <div className="flex gap-8 pt-4 text-sm">
              <div><div className="text-2xl font-bold font-display">2,400+</div><div className="text-primary-foreground/70">Active Students</div></div>
              <div><div className="text-2xl font-bold font-display">150+</div><div className="text-primary-foreground/70">Courses</div></div>
              <div><div className="text-2xl font-bold font-display">98%</div><div className="text-primary-foreground/70">Pass Rate</div></div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-accent/20 blur-3xl rounded-full" />
            <img src={heroImg} alt="Students learning at the Virtual University library" width={1600} height={900} className="relative rounded-2xl shadow-elevated" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-wider text-primary font-semibold mb-2">Why VU LMS</div>
          <h2 className="font-display text-3xl lg:text-4xl">Everything your campus needs, online</h2>
          <p className="text-muted-foreground mt-3">From course delivery to assessments and reporting — a single connected experience.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: BookOpen, t: "Rich Course Catalog", d: "Programming, mathematics, business, languages and more — organized by category and level." },
            { icon: Award, t: "Auto-Graded Quizzes", d: "MCQ assessments with instant scoring and per-attempt history for transparent evaluation." },
            { icon: Users, t: "Role-Based Access", d: "Separate, secure portals for Admins, Instructors and Students. Powered by middleware." },
          ].map(f => (
            <div key={f.t} className="p-6 rounded-xl bg-card border shadow-elegant hover:shadow-elevated transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                <f.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg mb-2">{f.t}</h3>
              <p className="text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section id="courses" className="bg-muted/40 py-20">
        <div className="container">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-primary font-semibold mb-2">Featured Courses</div>
              <h2 className="font-display text-3xl lg:text-4xl">Popular this semester</h2>
            </div>
            <Button asChild variant="outline"><Link to="/login">View All Courses <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map(c => <CourseCard key={c.id} course={c} />)}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="container py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-wider text-primary font-semibold mb-2">Built for Everyone</div>
          <h2 className="font-display text-3xl lg:text-4xl">One platform, three experiences</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { role: "Students", color: "bg-success", items: ["Browse & enroll in courses", "Study lessons sequentially", "Attempt quizzes & view scores", "Track progress per course"] },
            { role: "Instructors", color: "bg-primary", items: ["Create & edit courses", "Manage lessons in order", "Build MCQ quizzes", "Monitor student performance"] },
            { role: "Admins", color: "bg-accent", items: ["Manage users & roles", "Oversee all courses", "System-wide reports", "Platform configuration"] },
          ].map(r => (
            <div key={r.role} className="rounded-xl border bg-card p-6 shadow-elegant">
              <div className={`inline-block ${r.color} text-white text-xs font-semibold px-3 py-1 rounded-full mb-4`}>{r.role}</div>
              <ul className="space-y-2">
                {r.items.map(i => (
                  <li key={i} className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" /><span>{i}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-20">
        <div className="rounded-3xl bg-gradient-hero text-primary-foreground p-10 lg:p-16 text-center shadow-elevated">
          <h2 className="font-display text-3xl lg:text-4xl mb-4">Ready to begin your learning journey?</h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-6">Create your free account and access world-class courses in minutes.</p>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90"><Link to="/register">Create Account <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span>© 2026 VU LMS — Virtual University Learning Management System</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Terms</a>
            <a href="#" className="hover:text-primary">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
