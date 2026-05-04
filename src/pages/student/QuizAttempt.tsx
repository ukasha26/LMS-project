import { useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { db } from "@/data/store";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function QuizAttempt() {
  const { id } = useParams();
  const qid = Number(id);
  const { user } = useAuth();
  const navigate = useNavigate();

  const quiz = useMemo(() => db.getQuiz(qid), [qid]);
  const questions = useMemo(() => db.questionsByQuiz(qid), [qid]);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<{ score: number; total: number } | null>(null);

  if (!quiz) return <div>Quiz not found</div>;
  if (questions.length === 0) return <div>No questions yet.</div>;

  const q = questions[current];
  const allAnswered = questions.every(qu => answers[qu.id] !== undefined);

  const submit = () => {
    let score = 0;
    questions.forEach(qu => { if (answers[qu.id] === qu.correct_index) score++; });
    if (user) {
      db.saveAttempt({
        quiz_id: qid, student_id: user.id, score, total: questions.length,
        attempted_at: new Date().toISOString().slice(0, 10), answers,
      });
    }
    setSubmitted({ score, total: questions.length });
  };

  if (submitted) {
    const pct = Math.round((submitted.score / submitted.total) * 100);
    const passed = pct >= 60;
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="text-center shadow-elevated">
          <CardContent className="p-10 space-y-4">
            <div className={`h-20 w-20 rounded-full ${passed ? "bg-success" : "bg-warning"} text-white flex items-center justify-center mx-auto`}>
              <Trophy className="h-10 w-10" />
            </div>
            <h1 className="font-display text-3xl">{passed ? "Well done!" : "Keep practicing!"}</h1>
            <p className="text-muted-foreground">You scored</p>
            <div className="text-6xl font-bold font-display">{pct}%</div>
            <Badge className={`text-base px-3 py-1 ${passed ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"}`}>
              {submitted.score} / {submitted.total} correct
            </Badge>
            <div className="pt-4">
              <h3 className="font-display text-lg mb-3 text-left">Review</h3>
              <div className="space-y-2 text-left">
                {questions.map((qu, i) => {
                  const correct = answers[qu.id] === qu.correct_index;
                  return (
                    <div key={qu.id} className={`p-3 rounded-lg border ${correct ? "border-success/40 bg-success/5" : "border-destructive/40 bg-destructive/5"}`}>
                      <div className="flex gap-2 items-start">
                        {correct ? <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" /> : <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />}
                        <div className="flex-1">
                          <div className="text-sm font-medium">Q{i + 1}. {qu.question}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Correct answer: <span className="font-semibold text-foreground">{qu.options[qu.correct_index]}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-2 justify-center pt-4">
              <Button asChild variant="outline"><Link to={`/courses/${quiz.course_id}`}>Back to Course</Link></Button>
              <Button asChild><Link to="/my-results">My Results</Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button asChild variant="ghost" size="sm"><Link to={`/courses/${quiz.course_id}`}><ArrowLeft className="h-4 w-4 mr-1" /> Cancel quiz</Link></Button>

      <Card className="shadow-elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-display">{quiz.title}</CardTitle>
              <CardDescription>Question {current + 1} of {questions.length}</CardDescription>
            </div>
            <Badge variant="outline">{Object.keys(answers).length} / {questions.length} answered</Badge>
          </div>
          <Progress value={((current + 1) / questions.length) * 100} className="h-2 mt-3" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-lg font-medium leading-snug">{q.question}</div>
          <div className="space-y-2">
            {q.options.map((opt, i) => {
              const selected = answers[q.id] === i;
              return (
                <button
                  key={i}
                  onClick={() => setAnswers(a => ({ ...a, [q.id]: i }))}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                    selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/40"
                  }`}
                >
                  <div className={`h-7 w-7 rounded-full border-2 flex items-center justify-center shrink-0 text-sm font-semibold ${
                    selected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" disabled={current === 0} onClick={() => setCurrent(c => c - 1)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            {current < questions.length - 1 ? (
              <Button onClick={() => setCurrent(c => c + 1)}>Next <ArrowRight className="h-4 w-4 ml-1" /></Button>
            ) : (
              <Button onClick={submit} disabled={!allAnswered} className="bg-success hover:bg-success/90 text-success-foreground">
                Submit Quiz
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
