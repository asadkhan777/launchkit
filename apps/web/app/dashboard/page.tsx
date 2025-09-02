import { prisma } from '@launchkit-ai/lib';
import Link from 'next/link';

export default async function DashboardPage() {
  const courses = await prisma.course.findMany({ include: { lessons: true } });
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>
      {courses.length === 0 ? (
        <p>No courses yet.</p>
      ) : (
        <ul className="space-y-4">
          {courses.map((course: any) => (
            <li key={course.id} className="rounded-lg border p-4">
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p className="text-sm text-neutral-600">
                {course.lessons.length} lessons
              </p>
              <Link
                className="text-blue-600 hover:underline"
                href={`/course/${course.slug}`}
              >
                View
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
