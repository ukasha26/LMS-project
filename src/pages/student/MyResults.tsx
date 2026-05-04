import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/data/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy } from "lucide-react";

export default function MyResults() {
  const { user } = useAuth();
  const rows = useMemo(() => {
    if (!user) return [];
    return db.attemptsByStudent(user.id).map(a => {
      const quiz = db.getQuiz(a.quiz_id);
      const course = quiz ? db.getCourse(quiz.course_id) : null;
      return { ...a, quiz, course };
    }).sort((a, b) => b.attempted_at.localeCompare(a.attempted_at));
  }, [user]);

  if (!user) return null;
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl">Quiz Results</h1>
        <p className="text-muted-foreground mt-1">Your performance across all attempted assessments</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Trophy className="h-5 w-5 text-accent" /> All Attempts</CardTitle></CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No quiz attempts yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Quiz</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">%</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(r => {
                  const pct = Math.round((r.score / r.total) * 100);
                  const passed = pct >= 60;
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="text-muted-foreground text-sm">{r.attempted_at}</TableCell>
                      <TableCell className="font-medium">{r.course?.code}</TableCell>
                      <TableCell>{r.quiz?.title}</TableCell>
                      <TableCell className="text-right">{r.score} / {r.total}</TableCell>
                      <TableCell className="text-right font-bold">{pct}%</TableCell>
                      <TableCell>
                        <Badge className={passed ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"}>
                          {passed ? "Passed" : "Needs improvement"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
