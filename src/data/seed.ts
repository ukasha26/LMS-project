// Mock data layer for VU LMS — mirrors the Laravel/MySQL schema described in the spec.
// Tables: users, courses, lessons, enrollments, quizzes, quiz_questions, quiz_attempts.
import csImg from "@/assets/course-cs.jpg";
import mathImg from "@/assets/course-math.jpg";
import businessImg from "@/assets/course-business.jpg";
import englishImg from "@/assets/course-english.jpg";
import physicsImg from "@/assets/course-physics.jpg";
import designImg from "@/assets/course-design.jpg";

export type Role = "admin" | "instructor" | "student";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string; // mock only
  role: Role;
  avatar?: string;
  studentId?: string;
}

export interface Course {
  id: number;
  title: string;
  code: string;
  description: string;
  category: string;
  status: "published" | "draft" | "archived";
  instructor_id: number;
  cover: string;
  credits: number;
}

export interface Lesson {
  id: number;
  course_id: number;
  title: string;
  content: string;
  order: number;
  duration_min: number;
}

export interface Enrollment {
  id: number;
  course_id: number;
  student_id: number;
  enrolled_at: string;
  progress: number; // 0-100
}

export interface QuizQuestion {
  id: number;
  quiz_id: number;
  question: string;
  options: string[];
  correct_index: number;
}

export interface Quiz {
  id: number;
  course_id: number;
  lesson_id?: number;
  title: string;
  duration_min: number;
}

export interface QuizAttempt {
  id: number;
  quiz_id: number;
  student_id: number;
  score: number;
  total: number;
  attempted_at: string;
  answers: Record<number, number>;
}

export const courseImages = { csImg, mathImg, businessImg, englishImg, physicsImg, designImg };

// ---------- Seed data ----------
export const seedUsers: User[] = [
  { id: 1, name: "Dr. Aamir Khan", email: "admin@vu.edu.pk", password: "admin123", role: "admin", avatar: "https://i.pravatar.cc/150?img=12" },
  { id: 2, name: "Prof. Sara Ahmed", email: "sara@vu.edu.pk", password: "instructor123", role: "instructor", avatar: "https://i.pravatar.cc/150?img=47" },
  { id: 3, name: "Prof. Hamza Iqbal", email: "hamza@vu.edu.pk", password: "instructor123", role: "instructor", avatar: "https://i.pravatar.cc/150?img=15" },
  { id: 4, name: "Ali Raza", email: "student@vu.edu.pk", password: "student123", role: "student", studentId: "BSCS-22-001", avatar: "https://i.pravatar.cc/150?img=33" },
  { id: 5, name: "Ayesha Malik", email: "ayesha@vu.edu.pk", password: "student123", role: "student", studentId: "BSCS-22-002", avatar: "https://i.pravatar.cc/150?img=45" },
  { id: 6, name: "Bilal Hussain", email: "bilal@vu.edu.pk", password: "student123", role: "student", studentId: "BSSE-22-014", avatar: "https://i.pravatar.cc/150?img=68" },
  { id: 7, name: "Fatima Noor", email: "fatima@vu.edu.pk", password: "student123", role: "student", studentId: "BBA-22-031", avatar: "https://i.pravatar.cc/150?img=49" },
];

export const seedCourses: Course[] = [
  { id: 1, code: "CS101", title: "Introduction to Programming", description: "Learn the fundamentals of programming using C++ — variables, control flow, functions, arrays and pointers. A mandatory course for all CS students.", category: "Computer Science", status: "published", instructor_id: 2, cover: csImg, credits: 3 },
  { id: 2, code: "CS201", title: "Data Structures & Algorithms", description: "Stacks, queues, linked lists, trees, graphs, sorting and searching. Strong focus on time-complexity analysis.", category: "Computer Science", status: "published", instructor_id: 2, cover: csImg, credits: 4 },
  { id: 3, code: "MTH101", title: "Calculus and Analytical Geometry", description: "Limits, continuity, derivatives, integrals, and applications. Essential mathematical foundation for engineering.", category: "Mathematics", status: "published", instructor_id: 3, cover: mathImg, credits: 3 },
  { id: 4, code: "MGT101", title: "Principles of Management", description: "Planning, organizing, leading and controlling. Case-study driven introduction to modern business management.", category: "Business", status: "published", instructor_id: 3, cover: businessImg, credits: 3 },
  { id: 5, code: "ENG101", title: "English Composition", description: "Academic writing, grammar, paragraph structure, and effective communication for university students.", category: "Languages", status: "published", instructor_id: 3, cover: englishImg, credits: 3 },
  { id: 6, code: "PHY101", title: "Applied Physics", description: "Mechanics, waves, electromagnetism and modern physics with laboratory components.", category: "Sciences", status: "published", instructor_id: 2, cover: physicsImg, credits: 3 },
  { id: 7, code: "GD201", title: "Graphic Design Foundations", description: "Color theory, typography, layout and tools of the trade. Build your first portfolio pieces.", category: "Design", status: "draft", instructor_id: 2, cover: designImg, credits: 2 },
];

export const seedLessons: Lesson[] = [
  // CS101
  { id: 1, course_id: 1, order: 1, title: "Welcome & Setting Up Your Environment", duration_min: 25, content: "In this lesson we install a C++ compiler, set up VS Code, and write our first 'Hello World' program. We discuss what programming is, the role of a compiler, and the iterative cycle of write → compile → run → debug." },
  { id: 2, course_id: 1, order: 2, title: "Variables, Data Types and Operators", duration_min: 35, content: "Integers, floats, characters and booleans. Declaration vs initialization. Arithmetic, relational and logical operators. We work through examples computing area of a circle and converting temperature units." },
  { id: 3, course_id: 1, order: 3, title: "Control Flow: if / else / switch", duration_min: 40, content: "Selection statements let our programs make decisions. We compare nested if statements with switch-case and write a small grade-calculator program." },
  { id: 4, course_id: 1, order: 4, title: "Loops: for, while, do-while", duration_min: 45, content: "Iteration is the heart of computing. We cover counter-controlled and condition-controlled loops, break/continue, and write a program to print prime numbers up to N." },
  { id: 5, course_id: 1, order: 5, title: "Functions and Scope", duration_min: 50, content: "Decomposing programs with functions, parameters, return values, pass-by-value vs reference, and the concept of scope. Building blocks for larger systems." },
  // CS201
  { id: 6, course_id: 2, order: 1, title: "Asymptotic Analysis & Big-O", duration_min: 40, content: "We formalize how to measure the efficiency of an algorithm using Big-O notation. Best, worst and average cases." },
  { id: 7, course_id: 2, order: 2, title: "Arrays and Linked Lists", duration_min: 50, content: "Trade-offs between contiguous and linked storage. Singly, doubly and circular linked lists with full implementations." },
  { id: 8, course_id: 2, order: 3, title: "Stacks & Queues", duration_min: 35, content: "LIFO and FIFO structures. Applications in expression evaluation, undo functionality, and BFS." },
  { id: 9, course_id: 2, order: 4, title: "Trees and Binary Search Trees", duration_min: 55, content: "Tree terminology, traversals (pre/in/post-order), BST insert/search/delete and balanced trees." },
  // MTH101
  { id: 10, course_id: 3, order: 1, title: "Limits and Continuity", duration_min: 45, content: "Intuitive and formal (epsilon-delta) definition of limits. One-sided limits and continuous functions." },
  { id: 11, course_id: 3, order: 2, title: "Derivatives and Differentiation Rules", duration_min: 50, content: "Power, product, quotient and chain rules. Implicit differentiation and applications to rates of change." },
  // MGT101
  { id: 12, course_id: 4, order: 1, title: "What is Management?", duration_min: 30, content: "Defining management, the four functions (planning, organizing, leading, controlling), and the role of a manager." },
  { id: 13, course_id: 4, order: 2, title: "Strategic Planning", duration_min: 40, content: "SWOT analysis, vision/mission statements and setting SMART objectives." },
  // ENG101
  { id: 14, course_id: 5, order: 1, title: "Sentence Structure & Grammar", duration_min: 35, content: "Subjects, predicates, clauses and common grammatical pitfalls in academic writing." },
  // PHY101
  { id: 15, course_id: 6, order: 1, title: "Newton's Laws of Motion", duration_min: 45, content: "Inertia, F=ma, action-reaction pairs and worked examples involving pulleys and inclined planes." },
];

export const seedEnrollments: Enrollment[] = [
  { id: 1, course_id: 1, student_id: 4, enrolled_at: "2026-02-10", progress: 60 },
  { id: 2, course_id: 3, student_id: 4, enrolled_at: "2026-02-12", progress: 35 },
  { id: 3, course_id: 5, student_id: 4, enrolled_at: "2026-02-15", progress: 80 },
  { id: 4, course_id: 1, student_id: 5, enrolled_at: "2026-02-11", progress: 45 },
  { id: 5, course_id: 2, student_id: 5, enrolled_at: "2026-02-18", progress: 20 },
  { id: 6, course_id: 1, student_id: 6, enrolled_at: "2026-02-14", progress: 75 },
  { id: 7, course_id: 4, student_id: 7, enrolled_at: "2026-02-16", progress: 90 },
  { id: 8, course_id: 6, student_id: 6, enrolled_at: "2026-03-01", progress: 10 },
];

export const seedQuizzes: Quiz[] = [
  { id: 1, course_id: 1, title: "CS101 — Quiz 1: Basics", duration_min: 15 },
  { id: 2, course_id: 1, title: "CS101 — Quiz 2: Control Flow", duration_min: 20 },
  { id: 3, course_id: 2, title: "CS201 — Quiz 1: Big-O & Lists", duration_min: 20 },
  { id: 4, course_id: 3, title: "MTH101 — Quiz 1: Limits", duration_min: 25 },
  { id: 5, course_id: 4, title: "MGT101 — Quiz 1: Functions of Mgmt", duration_min: 15 },
];

export const seedQuestions: QuizQuestion[] = [
  // Quiz 1 — CS101 Basics
  { id: 1, quiz_id: 1, question: "Which of the following is NOT a primitive data type in C++?", options: ["int", "float", "string", "char"], correct_index: 2 },
  { id: 2, quiz_id: 1, question: "What does the `cout` object do?", options: ["Reads input", "Writes to standard output", "Compiles code", "Allocates memory"], correct_index: 1 },
  { id: 3, quiz_id: 1, question: "Which header is required for `cout` and `cin`?", options: ["<stdio.h>", "<iostream>", "<conio.h>", "<string>"], correct_index: 1 },
  { id: 4, quiz_id: 1, question: "What is the result of `7 % 3`?", options: ["2", "1", "3", "0"], correct_index: 1 },
  { id: 5, quiz_id: 1, question: "Which symbol is used for single-line comments in C++?", options: ["//", "#", "/*", "--"], correct_index: 0 },
  // Quiz 2 — CS101 Control Flow
  { id: 6, quiz_id: 2, question: "Which loop is guaranteed to execute at least once?", options: ["for", "while", "do-while", "foreach"], correct_index: 2 },
  { id: 7, quiz_id: 2, question: "`break` statement is used to:", options: ["Skip an iteration", "Exit the loop", "Restart the loop", "Pause execution"], correct_index: 1 },
  { id: 8, quiz_id: 2, question: "Which of the following is a valid switch label?", options: ["default:", "else:", "elif:", "otherwise:"], correct_index: 0 },
  { id: 9, quiz_id: 2, question: "What does `continue` do inside a loop?", options: ["Exits the loop", "Skips to next iteration", "Pauses execution", "Returns from function"], correct_index: 1 },
  // Quiz 3 — CS201
  { id: 10, quiz_id: 3, question: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], correct_index: 1 },
  { id: 11, quiz_id: 3, question: "A linked list provides O(1) ____.", options: ["Random access", "Insertion at head", "Binary search", "Sorting"], correct_index: 1 },
  { id: 12, quiz_id: 3, question: "Which structure is LIFO?", options: ["Queue", "Stack", "Heap", "Tree"], correct_index: 1 },
  // Quiz 4 — MTH101
  { id: 13, quiz_id: 4, question: "lim(x→0) sin(x)/x = ?", options: ["0", "1", "∞", "undefined"], correct_index: 1 },
  { id: 14, quiz_id: 4, question: "A function is continuous at x=a if:", options: ["f(a) exists", "lim exists", "lim equals f(a)", "All of the above"], correct_index: 3 },
  // Quiz 5 — MGT101
  { id: 15, quiz_id: 5, question: "Which is NOT a function of management?", options: ["Planning", "Organizing", "Marketing", "Controlling"], correct_index: 2 },
  { id: 16, quiz_id: 5, question: "SMART goals must be:", options: ["Specific & Measurable", "Achievable & Relevant", "Time-bound", "All of the above"], correct_index: 3 },
];

export const seedAttempts: QuizAttempt[] = [
  { id: 1, quiz_id: 1, student_id: 4, score: 4, total: 5, attempted_at: "2026-03-12", answers: {} },
  { id: 2, quiz_id: 4, student_id: 4, score: 1, total: 2, attempted_at: "2026-04-01", answers: {} },
  { id: 3, quiz_id: 1, student_id: 5, score: 3, total: 5, attempted_at: "2026-03-14", answers: {} },
  { id: 4, quiz_id: 5, student_id: 7, score: 2, total: 2, attempted_at: "2026-04-05", answers: {} },
];
