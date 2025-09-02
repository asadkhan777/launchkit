import { prisma } from '@launchkit-ai/lib';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Params {
  slug: string;
}

export default async function CoursePage({ params }: { params: Params }) {
  const course = await prisma.course.findFirst({
    where: { slug: params.slug },
    include: { lessons: true },
  });
  if (!course) return notFound();
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-4 text-3xl font-bold">{course.title}</h1>
      <p className="mb-6 text-neutral-700">{course.description}</p>
      <ol className="mb-6 list-decimal space-y-2 pl-4">
        {course.lessons.map((lesson: any, i: number) => (
          <li key={lesson.id} className="font-medium">
            {i + 1}. {lesson.title}
          </li>
        ))}
      </ol>
      <form action="/api/checkout" method="post">
        <input type="hidden" name="courseId" value={course.id} />
        {/* PriceId must be set in DB or env; this is a placeholder */}
        <input
          type="hidden"
          name="priceId"
          value={process.env.STRIPE_PRICE_ID}
        />
        <button
          disabled
          className="rounded-lg bg-neutral-300 px-4 py-2 text-neutral-600"
        >
          Buy (coming soon)
        </button>
      </form>
      <p className="mt-4 text-sm text-neutral-500">
        Checkout integration placeholder.
      </p>
      <Link
        className="mt-6 inline-block text-blue-600 hover:underline"
        href="/"
      >
        Back to home
      </Link>
    </main>
  );
}
