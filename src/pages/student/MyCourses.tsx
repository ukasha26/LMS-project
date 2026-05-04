import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import CourseCard from "@/components/CourseCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function MyCourses() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const data = await api.getMyEnrollments();
        setEnrollments(data);
      } catch (err) {
        console.error("Failed to load enrollments:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (!user) return null;
  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl">My Courses</h1>
        <p className="text-muted-foreground mt-1">All courses you're currently enrolled in</p>
      </div>
      {enrollments.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-xl">
          <p className="text-muted-foreground mb-4">You haven't enrolled in any course yet.</p>
          <Button asChild><Link to="/courses">Browse Catalog</Link></Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {enrollments.map(({ course, progress }) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              enrolled 
              progress={progress} 
              studentId={user.id} 
              onChange={() => window.location.reload()} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
