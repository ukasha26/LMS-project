import { useMemo } from "react";
import { db } from "@/data/store";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ClipboardList, Trophy, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function AdminReports() {
  const data = useMemo(() => {
    const courses = db.listCourses();
    const users = db.listUsers();
    const allAttempts = courses.flatMap(c => db.quizzesByCourse(c.id)).flatMap(q => db.attemptsByQuiz(q.id));
    const totalEnr = courses.flatMap(c => db.enrollmentsByCourse(c.id));
    const avgScore = allAttempts.length ? Math.round(allAttempts.reduce((s, a) => s + a.score / a.total * 100, 0) / allAttempts.length) : 0;
    const byCategory = courses.reduce((m, c) => {
      const enr = db.enrollmentsByCourse(c.id).length;
      m[c.category] = (m[c.category] || 0) + enr; return m;
    }, {} as Record<string, number>);
    return { courses, users, allAttempts, totalEnr, avgScore, byCategory };
  }, []);
  const maxCat = Math.max(1, ...Object.values(data.byCategory));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-1">Platform-wide metrics</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Enrollments" value={data.totalEnr.length} icon={BookOpen} variant="primary" />
        <StatCard label="Quiz Attempts" value={data.allAttempts.length} icon={ClipboardList} variant="accent" />
        <StatCard label="Avg Quiz Score" value={`${data.avgScore}%`} icon={Trophy} variant="success" />
        <StatCard label="Active Users" value={data.users.length} icon={Users} variant="warning" />
      </div>
      <Card>
        <CardHeader><CardTitle className="text-lg">Enrollments by Category</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(data.byCategory).map(([cat, n]) => (
            <div key={cat}>
              <div className="flex justify-between text-sm mb-1"><span className="font-medium">{cat}</span><span className="text-muted-foreground">{n}</span></div>
              <Progress value={(n / maxCat) * 100} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
