import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/data/store";
import StatCard from "@/components/StatCard";
import { BookOpen, Users, FileQuestion, TrendingUp, Plus, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [v] = useState(0);
  const data = useMemo(() => {
    if (!user) return null;
    const courses = db.coursesByInstructor(user.id);
    const courseIds = courses.map(c => c.id);
    const lessons = courses.flatMap(c => db.lessonsByCourse(c.id));
    const quizzes = courses.flatMap(c => db.quizzesByCourse(c.id));
    const enrollments = courses.flatMap(c => db.enrollmentsByCourse(c.id));
    const studentIds = Array.from(new Set(enrollments.map(e => e.student_id)));
    return { courses, lessons, quizzes, enrollments, studentIds, courseIds };
  }, [user, v]);
  if (!user || !data) return null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-sm text-muted-foreground">Instructor Portal</div>
          <h1 className="font-display text-3xl">Welcome, {user.name.split(" ").slice(-1)[0]}</h1>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline"><Link to="/instructor/quizzes">Manage Quizzes</Link></Button>
          <Button asChild><Link to="/instructor/courses"><Plus className="h-4 w-4 mr-1" /> New Course</Link></Button>
        </div>
      </div>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="My Courses" value={data.courses.length} icon={BookOpen} variant="primary" />
        <StatCard label="Total Lessons" value={data.lessons.length} icon={TrendingUp} variant="accent" />
        <StatCard label="Quizzes" value={data.quizzes.length} icon={FileQuestion} variant="warning" />
        <StatCard label="Students Reached" value={data.studentIds.length} icon={Users} variant="success" />
      </section>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Your Courses</CardTitle>
            <CardDescription>Manage content and track engagement</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm"><Link to="/instructor/courses">Manage all <ArrowRight className="h-4 w-4 ml-1" /></Link></Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.courses.length === 0 && <div className="text-sm text-muted-foreground">You haven't created any course yet.</div>}
          {data.courses.map(c => {
            const enr = db.enrollmentsByCourse(c.id);
            const avg = enr.length ? Math.round(enr.reduce((s, e) => s + e.progress, 0) / enr.length) : 0;
            return (
              <div key={c.id} className="flex items-center gap-4 p-4 rounded-lg border">
                <img src={c.cover} alt="" className="h-14 w-14 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><Badge variant="outline">{c.code}</Badge>
                    <Link to={`/courses/${c.id}`} className="font-medium hover:text-primary truncate">{c.title}</Link>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{enr.length} students • avg progress {avg}%</div>
                  <Progress value={avg} className="h-1 mt-2" />
                </div>
                <Badge className={c.status === "published" ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}>
                  {c.status}
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Recent Student Performance</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {data.courses.flatMap(c => db.quizzesByCourse(c.id))
            .flatMap(q => db.attemptsByQuiz(q.id).map(a => ({ a, q })))
            .slice(-6).reverse().map(({ a, q }) => {
              const student = db.listUsers().find(u => u.id === a.student_id);
              const pct = Math.round(a.score / a.total * 100);
              return (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded border bg-muted/20">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{student?.name}</div>
                    <div className="text-xs text-muted-foreground">{q.title} • {a.attempted_at}</div>
                  </div>
                  <Badge className={pct >= 70 ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"}>{pct}%</Badge>
                </div>
              );
            })}
        </CardContent>
      </Card>
    </div>
  );
}
