import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/data/store";
import { Quiz } from "@/data/seed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, FileQuestion, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

export default function ManageQuizzes() {
  const { user } = useAuth();
  const [v, setV] = useState(0);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  const myCourses = useMemo(() => user ? db.coursesByInstructor(user.id) : [], [user, v]);
  const quizzes = useMemo(() => myCourses.flatMap(c => db.quizzesByCourse(c.id).map(q => ({ q, c }))), [myCourses, v]);

  const [form, setForm] = useState({ title: "", course_id: 0, duration_min: 15 });
  const startCreate = () => { setForm({ title: "", course_id: myCourses[0]?.id || 0, duration_min: 15 }); setOpen(true); };

  const create = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.course_id) { toast.error("Select a course"); return; }
    db.createQuiz(form);
    toast.success("Quiz created — now add questions");
    setOpen(false); setV(x => x + 1);
  };

  const remove = (q: Quiz) => {
    if (!confirm(`Delete "${q.title}"?`)) return;
    db.deleteQuiz(q.id); toast.success("Quiz deleted"); setV(x => x + 1);
  };

  if (!user) return null;
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl">Quizzes</h1>
          <p className="text-muted-foreground mt-1">Create assessments and manage questions</p>
        </div>
        <Button onClick={startCreate} disabled={myCourses.length === 0}><Plus className="h-4 w-4 mr-1" /> New Quiz</Button>
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-xl">
          <FileQuestion className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No quizzes yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {quizzes.map(({ q, c }) => {
            const questions = db.questionsByQuiz(q.id);
            const attempts = db.attemptsByQuiz(q.id);
            const isOpen = expanded === q.id;
            return (
              <Card key={q.id}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="h-11 w-11 rounded-lg bg-accent/15 text-accent-foreground flex items-center justify-center"><FileQuestion className="h-5 w-5" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline">{c.code}</Badge>
                        <h3 className="font-medium">{q.title}</h3>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{questions.length} questions • {q.duration_min} min • {attempts.length} attempts</div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setExpanded(isOpen ? null : q.id)}>
                      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />} Questions
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive" onClick={() => remove(q)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  {isOpen && <QuestionsEditor quizId={q.id} onChange={() => setV(x => x + 1)} />}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Quiz</DialogTitle></DialogHeader>
          <form onSubmit={create} className="space-y-4">
            <div className="space-y-2"><Label>Title</Label><Input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Course</Label>
              <Select value={String(form.course_id)} onValueChange={v => setForm({ ...form, course_id: Number(v) })}>
                <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                <SelectContent>{myCourses.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.code} — {c.title}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Duration (min)</Label><Input type="number" min={1} value={form.duration_min} onChange={e => setForm({ ...form, duration_min: Number(e.target.value) })} /></div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function QuestionsEditor({ quizId, onChange }: { quizId: number; onChange?: () => void }) {
  const [v, setV] = useState(0);
  const questions = db.questionsByQuiz(quizId);
  const [form, setForm] = useState({ question: "", options: ["", "", "", ""], correct_index: 0 });
  const [adding, setAdding] = useState(false);

  const save = () => {
    if (!form.question.trim() || form.options.some(o => !o.trim())) { toast.error("Fill question and all 4 options"); return; }
    db.addQuestion({ quiz_id: quizId, ...form });
    toast.success("Question added");
    setForm({ question: "", options: ["", "", "", ""], correct_index: 0 });
    setAdding(false); setV(x => x + 1); onChange?.();
  };

  return (
    <div className="mt-4 pt-4 border-t space-y-3">
      {questions.map((q, i) => (
        <div key={q.id} className="bg-muted/40 p-3 rounded text-sm">
          <div className="font-medium">{i + 1}. {q.question}</div>
          <div className="grid grid-cols-2 gap-1 mt-2 text-xs">
            {q.options.map((o, j) => (
              <div key={j} className={`p-1.5 rounded ${j === q.correct_index ? "bg-success/20 text-success font-medium" : "text-muted-foreground"}`}>
                {String.fromCharCode(65 + j)}. {o} {j === q.correct_index && "✓"}
              </div>
            ))}
          </div>
        </div>
      ))}
      {adding ? (
        <div className="bg-card p-4 rounded border space-y-3">
          <div className="space-y-2"><Label>Question</Label><Input value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-2">
            {form.options.map((o, i) => (
              <div key={i} className="space-y-1">
                <Label className="text-xs">Option {String.fromCharCode(65 + i)} {i === form.correct_index && "(correct)"}</Label>
                <Input value={o} onChange={e => {
                  const opts = [...form.options]; opts[i] = e.target.value;
                  setForm({ ...form, options: opts });
                }} />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label>Correct Answer</Label>
            <Select value={String(form.correct_index)} onValueChange={v => setForm({ ...form, correct_index: Number(v) })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {form.options.map((_, i) => <SelectItem key={i} value={String(i)}>{String.fromCharCode(65 + i)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => setAdding(false)}>Cancel</Button>
            <Button size="sm" onClick={save}>Add Question</Button>
          </div>
        </div>
      ) : (
        <Button size="sm" variant="outline" onClick={() => setAdding(true)}><Plus className="h-3.5 w-3.5 mr-1" /> Add Question</Button>
      )}
    </div>
  );
}
