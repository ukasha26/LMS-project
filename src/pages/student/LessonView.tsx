import { useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { db } from "@/data/store";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export default function LessonView() {
  const { courseId, lessonId } = useParams();
  const cid = Number(courseId);
  const lid = Number(lessonId);
  const { user } = useAuth();
  const navigate = useNavigate();

  const data = useMemo(() => {
    const course = db.getCourse(cid);
    const lessons = db.lessonsByCourse(cid);
    const idx = lessons.findIndex(l => l.id === lid);
    return { course, lessons, lesson: lessons[idx], idx };
  }, [cid, lid]);

  if (!data.course || !data.lesson) return <div>Lesson not found</div>;
  const { course, lessons, lesson, idx } = data;
  const prev = lessons[idx - 1];
  const next = lessons[idx + 1];

  const markComplete = () => {
    if (!user) return;
    const pct = Math.round(((idx + 1) / lessons.length) * 100);
    db.setProgress(user.id, cid, pct);
    toast.success("Lesson marked complete");
    if (next) navigate(`/courses/${cid}/lessons/${next.id}`);
    else navigate(`/courses/${cid}`);
  };

  const progressPct = Math.round(((idx + 1) / lessons.length) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Button asChild variant="ghost" size="sm"><Link to={`/courses/${cid}`}><ArrowLeft className="h-4 w-4 mr-1" /> {course.code} — {course.title}</Link></Button>
        <div className="text-sm text-muted-foreground">Lesson {idx + 1} of {lessons.length}</div>
      </div>

      <div>
        <Progress value={progressPct} className="h-2" />
      </div>

      <Card className="bg-gradient-card">
        <CardContent className="p-8 lg:p-12 space-y-4">
          <div className="text-xs uppercase tracking-wider text-primary font-semibold">Lesson {idx + 1}</div>
          <h1 className="font-display text-3xl lg:text-4xl text-balance">{lesson.title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" /> {lesson.duration_min} minutes
          </div>
          <div className="aspect-video bg-gradient-hero rounded-xl mt-4 flex items-center justify-center text-primary-foreground/80 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_60%)]" />
            <div className="text-center relative">
              <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3 backdrop-blur">
                <ArrowRight className="h-7 w-7" />
              </div>
              <div className="text-sm">Video player placeholder</div>
            </div>
          </div>
          <div className="prose max-w-none mt-6">
            <p className="text-base leading-relaxed text-foreground/90 whitespace-pre-line">{lesson.content}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" disabled={!prev} onClick={() => prev && navigate(`/courses/${cid}/lessons/${prev.id}`)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Previous
        </Button>
        <Button onClick={markComplete} className="bg-success hover:bg-success/90 text-success-foreground">
          <CheckCircle2 className="h-4 w-4 mr-1" /> {next ? "Complete & Next" : "Complete Course"}
        </Button>
        <Button variant="outline" disabled={!next} onClick={() => next && navigate(`/courses/${cid}/lessons/${next.id}`)}>
          Next <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
