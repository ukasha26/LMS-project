import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/data/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function MyStudents() {
  const { user } = useAuth();
  const data = useMemo(() => {
    if (!user) return [];
    const courses = db.coursesByInstructor(user.id);
    const rows: { student: any; course: any; progress: number; quizAvg: number | null }[] = [];
    courses.forEach(c => {
      db.enrollmentsByCourse(c.id).forEach(e => {
        const student = db.listUsers().find(u => u.id === e.student_id);
        if (!student) return;
        const courseQuizIds = db.quizzesByCourse(c.id).map(q => q.id);
        const attempts = db.attemptsByStudent(student.id).filter(a => courseQuizIds.includes(a.quiz_id));
        const quizAvg = attempts.length ? Math.round(attempts.reduce((s, a) => s + a.score / a.total * 100, 0) / attempts.length) : null;
        rows.push({ student, course: c, progress: e.progress, quizAvg });
      });
    });
    return rows;
  }, [user]);
  if (!user) return null;
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl">My Students</h1>
        <p className="text-muted-foreground mt-1">Performance and progress across your courses</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-lg">Enrolled Students ({data.length})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="text-right">Quiz Avg</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((r, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9"><AvatarImage src={r.student.avatar} /><AvatarFallback>{r.student.name[0]}</AvatarFallback></Avatar>
                      <div>
                        <div className="font-medium text-sm">{r.student.name}</div>
                        <div className="text-xs text-muted-foreground">{r.student.studentId || r.student.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{r.course.code}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={r.progress} className="h-1.5 w-24" />
                      <span className="text-xs text-muted-foreground">{r.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {r.quizAvg === null ? <span className="text-muted-foreground text-sm">—</span> :
                      <Badge className={r.quizAvg >= 70 ? "bg-success text-success-foreground" : r.quizAvg >= 50 ? "bg-warning text-warning-foreground" : "bg-destructive text-destructive-foreground"}>{r.quizAvg}%</Badge>}
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No students enrolled yet.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
