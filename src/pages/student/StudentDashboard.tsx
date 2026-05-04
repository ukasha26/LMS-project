import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/data/store";
import StatCard from "@/components/StatCard";
import CourseCard from "@/components/CourseCard";
import { BookOpen, ClipboardList, Trophy, Flame, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [version, setVersion] = useState(0);
  const refresh = () => setVersion(v => v + 1);

  const data = useMemo(() => {
    if (!user) return null;
    const enrollments = db.enrollmentsByStudent(user.id);
    const courses = enrollments.map(e => ({ enrollment: e, course: db.getCourse(e.course_id)! })).filter(x => x.course);
    const attempts = db.attemptsByStudent(user.id);
    const avgScore = attempts.length
      ? Math.round((attempts.reduce((s, a) => s + (a.score / a.total) * 100, 0) / attempts.length))
      : 0;
    const avgProgress = courses.length
      ? Math.round(courses.reduce((s, c) => s + c.enrollment.progress, 0) / courses.length)
      : 0;
    return { enrollments, courses, attempts, avgScore, avgProgress };
  }, [user, version]);

  if (!user || !data) return null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome */}
      <section className="rounded-2xl bg-gradient-hero text-primary-foreground p-6 lg:p-8 shadow-elevated relative overflow-hidden">
        <div className="absolute -top-10 -right-10 h-40 w-40 bg-accent/20 rounded-full blur-3xl" />
        <div className="relative">
          <div className="text-sm text-primary-foreground/80">Welcome back, {user.name.split(" ")[0]} 👋</div>
          <h1 className="font-display text-2xl lg:text-3xl mt-1">Let's keep your streak going.</h1>
          <p className="text-primary-foreground/80 max-w-xl mt-2">You have {data.courses.length} active courses and {data.attempts.length} quiz attempts so far.</p>
          <div className="flex gap-2 mt-4">
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90"><Link to="/courses">Browse Courses</Link></Button>
            <Button asChild variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20"><Link to="/my-courses">My Courses</Link></Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Enrolled Courses" value={data.courses.length} icon={BookOpen} variant="primary" />
        <StatCard label="Quizzes Attempted" value={data.attempts.length} icon={ClipboardList} variant="accent" />
        <StatCard label="Average Score" value={`${data.avgScore}%`} icon={Trophy} variant="success" />
        <StatCard label="Avg Progress" value={`${data.avgProgress}%`} icon={Flame} variant="warning" />
      </section>

      {/* Continue learning */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="font-display text-xl">Continue learning</h2>
            <p className="text-sm text-muted-foreground">Pick up right where you left off</p>
          </div>
          <Button asChild variant="ghost" size="sm"><Link to="/my-courses">All my courses <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
        </div>
        {data.courses.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground">
            You haven't enrolled in any course yet. <Link to="/courses" className="text-primary font-medium">Browse the catalog →</Link>
          </CardContent></Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.courses.slice(0, 3).map(({ course, enrollment }) => (
              <CourseCard key={course.id} course={course} enrolled progress={enrollment.progress} studentId={user.id} onChange={refresh} />
            ))}
          </div>
        )}
      </section>

      {/* Recent attempts */}
      <section className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent quiz attempts</CardTitle>
            <CardDescription>Your most recent assessments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.attempts.length === 0 && <div className="text-sm text-muted-foreground">No attempts yet.</div>}
            {data.attempts.slice(-5).reverse().map(a => {
              const quiz = db.getQuiz(a.quiz_id);
              const pct = Math.round((a.score / a.total) * 100);
              return (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <div>
                    <div className="font-medium text-sm">{quiz?.title || "Quiz"}</div>
                    <div className="text-xs text-muted-foreground">{a.attempted_at}</div>
                  </div>
                  <Badge className={pct >= 70 ? "bg-success text-success-foreground" : pct >= 50 ? "bg-warning text-warning-foreground" : "bg-destructive text-destructive-foreground"}>
                    {a.score}/{a.total} • {pct}%
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Course progress</CardTitle>
            <CardDescription>Your completion across enrolled courses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.courses.map(({ course, enrollment }) => (
              <div key={course.id}>
                <div className="flex justify-between text-sm mb-1">
                  <Link to={`/courses/${course.id}`} className="font-medium hover:text-primary">{course.code} — {course.title}</Link>
                  <span className="text-muted-foreground">{enrollment.progress}%</span>
                </div>
                <Progress value={enrollment.progress} className="h-2" />
              </div>
            ))}
            {data.courses.length === 0 && <div className="text-sm text-muted-foreground">No enrolled courses yet.</div>}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
