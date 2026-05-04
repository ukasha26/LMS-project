import { useMemo, useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import CourseCard from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

export default function BrowseCourses() {
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [courses, setCourses] = useState<any[]>([]);
  const [myEnrollments, setMyEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.listCourses();
        setCourses(data);
        if (user?.role === "student") {
          const enr = await api.getMyEnrollments();
          setMyEnrollments(enr);
        }
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const categories = useMemo(() => ["all", ...Array.from(new Set(courses.map((c: any) => c.category)))], [courses]);
  const filtered = courses.filter((c: any) =>
    (cat === "all" || c.category === cat) &&
    (q === "" || `${c.code} ${c.title} ${c.description}`.toLowerCase().includes(q.toLowerCase()))
  );
  const enrolledMap = useMemo(() => {
    const m = new Map<number, number>();
    myEnrollments.forEach((e: any) => m.set(e.course_id, e.progress));
    return m;
  }, [myEnrollments]);

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl">Course Catalog</h1>
        <p className="text-muted-foreground mt-1">Discover courses across every department</p>
      </div>
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by title, code or topic…" className="pl-9" />
        </div>
      </div>
      <Tabs value={cat} onValueChange={setCat}>
        <TabsList className="flex-wrap h-auto">
          {categories.map(c => <TabsTrigger key={c} value={c} className="capitalize">{c === "all" ? "All Categories" : c}</TabsTrigger>)}
        </TabsList>
      </Tabs>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((c: any) => (
          <CourseCard
            key={c.id}
            course={c}
            studentId={user?.role === "student" ? user.id : undefined}
            enrolled={enrolledMap.has(c.id)}
            progress={enrolledMap.get(c.id)}
            onChange={() => location.reload()}
          />
        ))}
        {filtered.length === 0 && <div className="col-span-full text-center text-muted-foreground py-12">No courses match your search.</div>}
      </div>
    </div>
  );
}
