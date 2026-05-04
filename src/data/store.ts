// In-memory store with localStorage persistence. Mirrors the Laravel API surface so
// swapping to a real backend later is just replacing these functions with HTTP calls.
import {
  Course, Enrollment, Lesson, Quiz, QuizAttempt, QuizQuestion, User,
  seedAttempts, seedCourses, seedEnrollments, seedLessons, seedQuestions, seedQuizzes, seedUsers,
} from "./seed";

const KEY = "vu_lms_db_v1";

interface DB {
  users: User[];
  courses: Course[];
  lessons: Lesson[];
  enrollments: Enrollment[];
  quizzes: Quiz[];
  questions: QuizQuestion[];
  attempts: QuizAttempt[];
}

function load(): DB {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const fresh: DB = {
    users: seedUsers,
    courses: seedCourses,
    lessons: seedLessons,
    enrollments: seedEnrollments,
    quizzes: seedQuizzes,
    questions: seedQuestions,
    attempts: seedAttempts,
  };
  save(fresh);
  return fresh;
}
function save(db: DB) {
  localStorage.setItem(KEY, JSON.stringify(db));
}
function nextId<T extends { id: number }>(arr: T[]) {
  return arr.length ? Math.max(...arr.map(a => a.id)) + 1 : 1;
}

// Course covers in seed are imported assets; after JSON round-trip they remain strings — fine.

export const db = {
  // --- Users ---
  listUsers: () => load().users,
  findUserByEmail: (email: string) => load().users.find(u => u.email.toLowerCase() === email.toLowerCase()),
  createUser: (u: Omit<User, "id">) => {
    const d = load(); const user = { ...u, id: nextId(d.users) }; d.users.push(user); save(d); return user;
  },
  updateUser: (id: number, patch: Partial<User>) => {
    const d = load(); const i = d.users.findIndex(u => u.id === id);
    if (i >= 0) { d.users[i] = { ...d.users[i], ...patch }; save(d); }
  },
  deleteUser: (id: number) => {
    const d = load(); d.users = d.users.filter(u => u.id !== id); save(d);
  },

  // --- Courses ---
  listCourses: () => load().courses,
  getCourse: (id: number) => load().courses.find(c => c.id === id),
  coursesByInstructor: (uid: number) => load().courses.filter(c => c.instructor_id === uid),
  createCourse: (c: Omit<Course, "id">) => {
    const d = load(); const course = { ...c, id: nextId(d.courses) }; d.courses.push(course); save(d); return course;
  },
  updateCourse: (id: number, patch: Partial<Course>) => {
    const d = load(); const i = d.courses.findIndex(c => c.id === id);
    if (i >= 0) { d.courses[i] = { ...d.courses[i], ...patch }; save(d); }
  },
  deleteCourse: (id: number) => {
    const d = load();
    d.courses = d.courses.filter(c => c.id !== id);
    d.lessons = d.lessons.filter(l => l.course_id !== id);
    d.enrollments = d.enrollments.filter(e => e.course_id !== id);
    const quizIds = d.quizzes.filter(q => q.course_id === id).map(q => q.id);
    d.quizzes = d.quizzes.filter(q => q.course_id !== id);
    d.questions = d.questions.filter(q => !quizIds.includes(q.quiz_id));
    d.attempts = d.attempts.filter(a => !quizIds.includes(a.quiz_id));
    save(d);
  },

  // --- Lessons ---
  lessonsByCourse: (cid: number) => load().lessons.filter(l => l.course_id === cid).sort((a, b) => a.order - b.order),
  getLesson: (id: number) => load().lessons.find(l => l.id === id),
  createLesson: (l: Omit<Lesson, "id">) => {
    const d = load(); const lesson = { ...l, id: nextId(d.lessons) }; d.lessons.push(lesson); save(d); return lesson;
  },
  updateLesson: (id: number, patch: Partial<Lesson>) => {
    const d = load(); const i = d.lessons.findIndex(l => l.id === id);
    if (i >= 0) { d.lessons[i] = { ...d.lessons[i], ...patch }; save(d); }
  },
  deleteLesson: (id: number) => {
    const d = load(); d.lessons = d.lessons.filter(l => l.id !== id); save(d);
  },

  // --- Enrollments ---
  enrollmentsByStudent: (sid: number) => load().enrollments.filter(e => e.student_id === sid),
  enrollmentsByCourse: (cid: number) => load().enrollments.filter(e => e.course_id === cid),
  isEnrolled: (sid: number, cid: number) => load().enrollments.some(e => e.student_id === sid && e.course_id === cid),
  enroll: (sid: number, cid: number) => {
    const d = load();
    if (d.enrollments.some(e => e.student_id === sid && e.course_id === cid)) return;
    d.enrollments.push({ id: nextId(d.enrollments), student_id: sid, course_id: cid, enrolled_at: new Date().toISOString().slice(0, 10), progress: 0 });
    save(d);
  },
  unenroll: (sid: number, cid: number) => {
    const d = load(); d.enrollments = d.enrollments.filter(e => !(e.student_id === sid && e.course_id === cid)); save(d);
  },
  setProgress: (sid: number, cid: number, progress: number) => {
    const d = load(); const i = d.enrollments.findIndex(e => e.student_id === sid && e.course_id === cid);
    if (i >= 0) { d.enrollments[i].progress = Math.max(d.enrollments[i].progress, progress); save(d); }
  },

  // --- Quizzes ---
  quizzesByCourse: (cid: number) => load().quizzes.filter(q => q.course_id === cid),
  getQuiz: (id: number) => load().quizzes.find(q => q.id === id),
  questionsByQuiz: (qid: number) => load().questions.filter(q => q.quiz_id === qid),
  createQuiz: (q: Omit<Quiz, "id">) => {
    const d = load(); const quiz = { ...q, id: nextId(d.quizzes) }; d.quizzes.push(quiz); save(d); return quiz;
  },
  addQuestion: (q: Omit<QuizQuestion, "id">) => {
    const d = load(); const question = { ...q, id: nextId(d.questions) }; d.questions.push(question); save(d); return question;
  },
  deleteQuiz: (id: number) => {
    const d = load();
    d.quizzes = d.quizzes.filter(q => q.id !== id);
    d.questions = d.questions.filter(q => q.quiz_id !== id);
    d.attempts = d.attempts.filter(a => a.quiz_id !== id);
    save(d);
  },

  // --- Attempts ---
  attemptsByStudent: (sid: number) => load().attempts.filter(a => a.student_id === sid),
  attemptsByQuiz: (qid: number) => load().attempts.filter(a => a.quiz_id === qid),
  saveAttempt: (a: Omit<QuizAttempt, "id">) => {
    const d = load(); const attempt = { ...a, id: nextId(d.attempts) }; d.attempts.push(attempt); save(d); return attempt;
  },

  // --- Stats ---
  resetAll: () => { localStorage.removeItem(KEY); load(); },
};
