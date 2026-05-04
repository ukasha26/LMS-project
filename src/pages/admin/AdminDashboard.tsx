import { useMemo, useState } from "react";
import { db } from "@/data/store";
import StatCard from "@/components/StatCard";
import { Users, BookOpen, FileQuestion, GraduationCap, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [v] = useState(0);
  const data = useMemo(() => {
    const users = db.listUsers();
    const courses = db.listCourses();
    const allQuizzes = courses.flatMap(c => db.quizzesByCourse(c.id));
    const allEnrollments = courses.flatMap(c => db.enrollmentsByCourse(c.id));
    return {
      users, courses, allQuizzes, allEnrollments,
      students: users.filter(u => u.role === "student"),
      instructors: users.filter(u => u.role === "instructor"),
    };
  }, [v]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="rounded-2xl bg-gradient-hero text-primary-foreground p-6 lg:p-8 shadow-elevated">
        <div className="text-sm text-primary-foreground/80">Administration</div>
        <h1 className="font-display text-3xl mt-1">Platform Overview</h1>
        <p className="text-primary-foreground/80 mt-2">Real-time view of users, courses and engagement.</p>
      </div>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={data.students.length} icon={GraduationCap} variant="primary" />
        <StatCard label="Instructors" value={data.instructors.length} icon={Users} variant="accent" />
        <StatCard label="Courses" value={data.courses.length} icon={BookOpen} variant="success" />
        <StatCard label="Quizzes" value={data.allQuizzes.length} icon={FileQuestion} variant="warning" />
      </section>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg">Top Courses</CardTitle>
            <Button asChild variant="ghost" size="sm"><Link to="/admin/courses">View all</Link></Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Course</TableHead><TableHead className="text-right">Enrollments</TableHead></TableRow></TableHeader>
              <TableBody>
                {data.courses.map(c => ({ c, n: db.enrollmentsByCourse(c.id).length }))
                  .sort((a, b) => b.n - a.n).slice(0, 5).map(({ c, n }) => (
                    <TableRow key={c.id}>
                      <TableCell><Badge variant="outline" className="mr-2">{c.code}</Badge>{c.title}</TableCell>
                      <TableCell className="text-right font-medium">{n}</TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Activity className="h-5 w-5" /> Recent Activity</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {data.allEnrollments.slice(-6).reverse().map(e => {
              const s = data.users.find(u => u.id === e.student_id);
              const c = data.courses.find(co => co.id === e.course_id);
              return (
                <div key={e.id} className="flex items-center gap-3 p-3 rounded border bg-muted/20 text-sm">
                  <div className="h-8 w-8 rounded-full bg-success/15 text-success flex items-center justify-center"><GraduationCap className="h-4 w-4" /></div>
                  <div className="flex-1"><span className="font-medium">{s?.name}</span> enrolled in <span className="font-medium">{c?.code}</span></div>
                  <span className="text-xs text-muted-foreground">{e.enrolled_at}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
