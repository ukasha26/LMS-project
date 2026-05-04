import { useMemo, useState } from "react";
import { db } from "@/data/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function AdminCourses() {
  const [v, setV] = useState(0);
  const courses = useMemo(() => db.listCourses(), [v]);

  const remove = (id: number) => {
    if (!confirm("Delete this course and all its content?")) return;
    db.deleteCourse(id); toast.success("Course deleted"); setV(x => x + 1);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl">All Courses</h1>
        <p className="text-muted-foreground mt-1">System-wide course management</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-lg">{courses.length} courses</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>
              <TableHead>Code</TableHead><TableHead>Title</TableHead><TableHead>Instructor</TableHead>
              <TableHead>Status</TableHead><TableHead className="text-right">Students</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {courses.map(c => {
                const instr = db.listUsers().find(u => u.id === c.instructor_id);
                const enr = db.enrollmentsByCourse(c.id).length;
                return (
                  <TableRow key={c.id}>
                    <TableCell><Badge variant="outline">{c.code}</Badge></TableCell>
                    <TableCell><Link to={`/courses/${c.id}`} className="font-medium hover:text-primary">{c.title}</Link></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{instr?.name || "—"}</TableCell>
                    <TableCell><Badge className={c.status === "published" ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}>{c.status}</Badge></TableCell>
                    <TableCell className="text-right font-medium">{enr}</TableCell>
                    <TableCell className="text-right"><Button size="icon" variant="ghost" className="text-destructive" onClick={() => remove(c.id)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
