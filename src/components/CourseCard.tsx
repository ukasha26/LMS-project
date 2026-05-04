import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Course } from "@/data/seed";
import { api } from "@/lib/api";
import { BookOpen, Clock, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface Props {
  course: Course;
  enrolled?: boolean;
  progress?: number;
  studentId?: number;
  onChange?: () => void;
}

export default function CourseCard({ course, enrolled, progress, studentId, onChange }: Props) {
  const navigate = useNavigate();
  const [isEnrolling, setIsEnrolling] = useState(false);

  const handleEnroll = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!studentId) return;
    setIsEnrolling(true);
    try {
      await api.enroll(course.id);
      toast.success(`Enrolled in ${course.code}`);
      onChange?.();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsEnrolling(false);
    }
  };

  const lessonCount = 0; // Will be loaded separately if needed

  return (
    <Card className="group overflow-hidden bg-gradient-card hover:shadow-elevated transition-all duration-300 border-border/60 flex flex-col">
      <Link to={`/courses/${course.id}`} className="block">
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          <img
            src={course.cover}
            alt={`${course.title} cover`}
            loading="lazy"
            width={800}
            height={450}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
          <Badge className="absolute top-3 left-3 bg-background/90 text-foreground hover:bg-background/90">{course.code}</Badge>
          <Badge variant="secondary" className="absolute top-3 right-3 bg-accent text-accent-foreground hover:bg-accent">{course.credits} cr</Badge>
        </div>
      </Link>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <span className="font-medium">{course.category}</span>
          <span>•</span>
          <span className="capitalize">{course.status}</span>
        </div>
        <CardTitle className="text-base leading-snug line-clamp-2">
          <Link to={`/courses/${course.id}`} className="hover:text-primary transition-colors">{course.title}</Link>
        </CardTitle>
        <CardDescription className="line-clamp-2 text-xs">{course.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 mt-auto space-y-3">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {lessonCount} lessons</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> ~{lessonCount * 40}m</span>
        </div>
        {enrolled ? (
          <>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{progress ?? 0}%</span>
              </div>
              <Progress value={progress ?? 0} className="h-1.5" />
            </div>
            <Button size="sm" className="w-full" onClick={() => navigate(`/courses/${course.id}`)}>Continue</Button>
          </>
        ) : studentId ? (
          <Button size="sm" className="w-full" onClick={handleEnroll} disabled={isEnrolling}>{isEnrolling ? "Enrolling..." : "Enroll Now"}</Button>
        ) : (
          <Button size="sm" variant="outline" className="w-full" onClick={() => navigate(`/courses/${course.id}`)}>View Details</Button>
        )}
      </CardContent>
    </Card>
  );
}
