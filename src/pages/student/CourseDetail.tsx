import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, BookOpen, CheckCircle2, Clock, FileQuestion, GraduationCap, PlayCircle } from "lucide-react";
import { toast } from "sonner";

export default function CourseDetail() {
  const { id } = useParams();
  const cid = Number(id);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any | null>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [myEnrollment, setMyEnrollment] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const c = await api.getCourse(cid);
        setCourse(c);
        const l = await api.getLessons(cid);
        setLessons(l);
        const q = await api.getQuizzes(cid);
        setQuizzes(q);
        if (user?.role === "student") {
          const enr = await api.getMyEnrollments();
          const myEnr = enr.find((e: any) => e.course_id === cid);
          setMyEnrollment(myEnr || null);
        }
      } catch (err) {
        console.error("Failed to load course:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [cid, user]);

  const enroll = async () => {
    if (!user) return;
    try {
      await api.enroll(cid);
      toast.success(`Enrolled in ${course?.code}`);
      setMyEnrollment({ course_id: cid, student_id: user.id, progress: 0 });
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!course) return <div className="text-center py-12">Course not found. <Link to="/courses" className="text-primary">Back to catalog</Link></div>;

  const isStudent = user?.role === "student";
  const enrolled = !!myEnrollment;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Button asChild variant="ghost" size="sm"><Link to={isStudent ? "/courses" : "/dashboard"}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Link></Button>

      <div className="rounded-2xl overflow-hidden shadow-elevated bg-card">
        <div className="relative h-56 lg:h-72">
          <img src={course.cover} alt={course.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-accent text-accent-foreground hover:bg-accent">{course.code}</Badge>
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/20">{course.category}</Badge>
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/20">{course.credits} credits</Badge>
            </div>
            <h1 className="font-display text-2xl lg:text-4xl text-balance">{course.title}</h1>
          </div>
        </div>
        <div className="p-6 lg:p-8 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h2 className="font-display text-lg mb-2">About this course</h2>
              <p className="text-muted-foreground leading-relaxed">{course.description}</p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1.5"><BookOpen className="h-4 w-4 text-primary" /> {lessons.length} lessons</div>
              <div className="flex items-center gap-1.5"><FileQuestion className="h-4 w-4 text-primary" /> {quizzes.length} quizzes</div>
              <div className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" /> ~{lessons.length * 30} minutes</div>
            </div>
          </div>
          <div>
            <Card className="bg-muted/30">
              <CardContent className="p-5 space-y-3">
                {enrolled ? (
                  <>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Your progress</div>
                      <Progress value={myEnrollment?.progress || 0} className="h-2" />
                      <div className="text-sm font-medium mt-2">{myEnrollment?.progress || 0}% complete</div>
                    </div>
                    {lessons[0] && (
                      <Button className="w-full" onClick={() => navigate(`/courses/${cid}/lessons/${lessons[0].id}`)}>
                        <PlayCircle className="h-4 w-4 mr-1" /> Continue Learning
                      </Button>
                    )}
                  </>
                ) : isStudent ? (
                  <Button className="w-full" onClick={enroll}>Enroll in this course</Button>
                ) : (
                  <div className="text-sm text-muted-foreground">Sign in as a student to enroll.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Course Lessons</CardTitle>
          <CardDescription>Sequential content — work through these in order</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {lessons.length === 0 && <div className="text-sm text-muted-foreground">No lessons published yet.</div>}
          {lessons.map((l, idx) => {
            const completed = enrolled && (myEnrollment?.progress >= ((idx + 1) / lessons.length) * 100);
            return (
              <button
                key={l.id}
                onClick={() => enrolled ? navigate(`/courses/${cid}/lessons/${l.id}`) : toast.info("Enroll to access lessons")}
                className="w-full flex items-center gap-4 p-4 rounded-lg border hover:border-primary hover:bg-muted/40 transition-colors text-left"
              >
                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${completed ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}>
                  {completed ? <CheckCircle2 className="h-5 w-5" /> : <span className="text-sm font-bold">{idx + 1}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{l.title}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5"><Clock className="h-3 w-3" /> {l.duration_min} min</div>
                </div>
                <PlayCircle className="h-5 w-5 text-primary shrink-0" />
              </button>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quizzes & Assessments</CardTitle>
          <CardDescription>Test your understanding and earn scores</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {quizzes.length === 0 && <div className="text-sm text-muted-foreground">No quizzes available yet.</div>}
          {quizzes.map((q: any) => (
            <div key={q.id} className="flex items-center gap-4 p-4 rounded-lg border">
              <div className="h-10 w-10 rounded-full bg-accent/15 text-accent-foreground flex items-center justify-center shrink-0">
                <FileQuestion className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium">{q.title}</div>
                <div className="text-xs text-muted-foreground">{q.duration_min} min</div>
              </div>
              <Button
                size="sm"
                onClick={() => enrolled ? navigate(`/quiz/${q.id}`) : toast.info("Enroll to attempt quiz")}
                disabled={!enrolled}
              >Attempt</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
