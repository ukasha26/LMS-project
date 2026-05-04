import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { courseImages } from "@/data/seed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, BookOpen, Users, FileQuestion } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import LessonsManager from "./LessonsManager";

const categories = ["Computer Science", "Mathematics", "Business", "Languages", "Sciences", "Design"];
const covers = Object.values(courseImages);

export default function ManageCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const data = await api.myCourses();
        setCourses(data);
      } catch (err) {
        console.error("Failed to load courses:", err);
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const blank = { title: "", code: "", description: "", category: "Computer Science", status: "draft", credits: 3, cover: covers[0] };
  const [form, setForm] = useState(blank);

  const startCreate = () => { setEditing(null); setForm(blank); setOpen(true); };
  const startEdit = (c: any) => { 
    setEditing(c); 
    setForm({ 
      title: c.title, 
      code: c.code, 
      description: c.description, 
      category: c.category, 
      status: c.status, 
      credits: c.credits, 
      cover: c.cover 
    }); 
    setOpen(true); 
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      if (editing) {
        await api.updateCourse(editing.id, form);
        toast.success("Course updated");
      } else {
        await api.createCourse(form);
        toast.success("Course created");
      }
      setOpen(false);
      const data = await api.myCourses();
      setCourses(data);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (c: any) => {
    if (!confirm(`Delete ${c.code}? This will remove its lessons and quizzes.`)) return;
    try {
      await api.deleteCourse(c.id);
      toast.success("Course deleted");
      setCourses(courses.filter(x => x.id !== c.id));
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  if (!user) return null;
  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl">My Courses</h1>
          <p className="text-muted-foreground mt-1">Create, edit and manage your course content</p>
        </div>
        <Button onClick={startCreate}><Plus className="h-4 w-4 mr-1" /> New Course</Button>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-xl">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground mb-4">You haven't created any courses yet.</p>
          <Button onClick={startCreate}><Plus className="h-4 w-4 mr-1" /> Create your first course</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map(c => (
            <Card key={c.id}>
              <CardContent className="p-5 flex flex-col md:flex-row gap-4">
                <img src={c.cover} alt="" className="h-32 md:h-24 md:w-32 w-full rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline">{c.code}</Badge>
                    <Badge className={c.status === "published" ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}>{c.status}</Badge>
                    <Badge variant="secondary">{c.category}</Badge>
                  </div>
                  <h3 className="font-display text-lg mt-2"><Link to={`/courses/${c.id}`} className="hover:text-primary">{c.title}</Link></h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{c.description}</p>
                  <div className="flex gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {c.lessons_count || 0} lessons</span>
                    <span className="flex items-center gap-1"><FileQuestion className="h-3.5 w-3.5" /> {c.quizzes_count || 0} quizzes</span>
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {c.enrollments_count || 0} students</span>
                  </div>
                </div>
                <div className="flex md:flex-col gap-2">
                  <Button size="sm" variant="outline" onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
                    {expanded === c.id ? "Hide" : "Lessons"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => startEdit(c)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => remove(c)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
              {expanded === c.id && (
                <div className="border-t bg-muted/30 p-5">
                  <LessonsManager courseId={c.id} onChange={() => {}} />
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Course" : "New Course"}</DialogTitle>
            <DialogDescription>{editing ? "Update course details" : "Fill in the details to create a new course"}</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Course Code</Label><Input required value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="CS101" /></div>
              <div className="space-y-2"><Label>Credits</Label><Input type="number" min={1} max={6} value={form.credits} onChange={e => setForm({ ...form, credits: Number(e.target.value) })} /></div>
            </div>
            <div className="space-y-2"><Label>Title</Label><Input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea rows={3} required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={x => setForm({ ...form, category: x })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={x => setForm({ ...form, status: x })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cover Image</Label>
              <div className="grid grid-cols-3 gap-2">
                {covers.map(c => (
                  <button type="button" key={c} onClick={() => setForm({ ...form, cover: c })} className={`aspect-video rounded overflow-hidden border-2 ${form.cover === c ? "border-primary ring-2 ring-primary/30" : "border-transparent"}`}>
                    <img src={c} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={submitting}>Cancel</Button>
              <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : (editing ? "Save Changes" : "Create Course")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
