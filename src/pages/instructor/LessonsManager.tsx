import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Pencil, X, Check } from "lucide-react";
import { toast } from "sonner";

export default function LessonsManager({ courseId, onChange }: { courseId: number; onChange?: () => void }) {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ title: "", content: "", duration_min: 30 });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getLessons(courseId);
        setLessons(data);
      } catch (err) {
        console.error("Failed to load lessons:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId]);

  const refresh = async () => {
    const data = await api.getLessons(courseId);
    setLessons(data);
    onChange?.();
  };

  const startAdd = () => {
    setEditing(null); 
    setAdding(true);
    setForm({ title: "", content: "", duration_min: 30 });
  };

  const startEdit = (l: any) => {
    setAdding(false); 
    setEditing(l);
    setForm({ title: l.title, content: l.content, duration_min: l.duration_min });
  };

  const save = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setSubmitting(true);
    try {
      if (editing) {
        await api.updateLesson(editing.id, form);
        toast.success("Lesson updated");
      } else {
        await api.createLesson(courseId, { ...form, order: lessons.length + 1 });
        toast.success("Lesson added");
      }
      setAdding(false);
      setEditing(null);
      await refresh();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (l: any) => {
    if (!confirm(`Delete lesson "${l.title}"?`)) return;
    try {
      await api.deleteLesson(l.id);
      toast.success("Lesson deleted");
      await refresh();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  if (loading) return <div className="text-sm text-muted-foreground">Loading lessons...</div>;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm">Lessons ({lessons.length})</h4>
        {!adding && !editing && <Button size="sm" variant="outline" onClick={startAdd}><Plus className="h-3.5 w-3.5 mr-1" /> Add Lesson</Button>}
      </div>
      <div className="space-y-2">
        {lessons.map((l, i) => (
          <div key={l.id} className="bg-card p-3 rounded border flex gap-3 items-center">
            <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{l.title}</div>
              <div className="text-xs text-muted-foreground">{l.duration_min} min</div>
            </div>
            <Button size="icon" variant="ghost" onClick={() => startEdit(l)}><Pencil className="h-3.5 w-3.5" /></Button>
            <Button size="icon" variant="ghost" className="text-destructive" onClick={() => remove(l)}><Trash2 className="h-3.5 w-3.5" /></Button>
          </div>
        ))}
        {(adding || editing) && (
          <div className="bg-card p-4 rounded border space-y-3">
            <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div className="space-y-2"><Label>Content</Label><Textarea rows={3} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} /></div>
            <div className="space-y-2"><Label>Duration (min)</Label><Input type="number" min={1} value={form.duration_min} onChange={e => setForm({ ...form, duration_min: Number(e.target.value) })} /></div>
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => { setAdding(false); setEditing(null); }} disabled={submitting}><X className="h-4 w-4 mr-1" /> Cancel</Button>
              <Button size="sm" onClick={save} disabled={submitting}><Check className="h-4 w-4 mr-1" /> {submitting ? "Saving..." : "Save"}</Button>
            </div>
          </div>
        )}
        {lessons.length === 0 && !adding && <div className="text-sm text-muted-foreground py-4 text-center">No lessons yet.</div>}
      </div>
    </div>
  );
}
