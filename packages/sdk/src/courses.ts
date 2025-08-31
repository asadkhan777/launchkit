import { Course as PrismaCourse, Lesson as PrismaLesson } from '@prisma/client';
import { CourseCreateSchema, CourseSchema, type CourseCreate, type Course } from './schemas.js';
import { getPrismaClient } from './database.js';
import { handlePrismaError, SDKException } from './errors.js';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function transformPrismaCourse(
  prismaCourse: PrismaCourse & { lessons?: PrismaLesson[] }
): Course {
  return {
    id: prismaCourse.id,
    ownerId: prismaCourse.ownerId,
    slug: prismaCourse.slug,
    title: prismaCourse.title,
    description: prismaCourse.description,
    createdAt: prismaCourse.createdAt,
    updatedAt: prismaCourse.updatedAt,
    lessons: prismaCourse.lessons?.map(lesson => ({
      id: lesson.id,
      courseId: lesson.courseId,
      title: lesson.title,
      content: lesson.content,
      order: lesson.order,
      createdAt: new Date(), // Note: Prisma lesson doesn't have these fields in our schema
      updatedAt: new Date(),
    })),
  };
}

export async function createCourse(input: CourseCreate): Promise<Course> {
  // Validate input
  const validatedInput = CourseCreateSchema.parse(input);
  
  const prisma = getPrismaClient();
  const slug = generateSlug(validatedInput.title);

  try {
    const course = await prisma.course.create({
      data: {
        ownerId: validatedInput.ownerId,
        slug,
        title: validatedInput.title,
        description: validatedInput.description ?? '',
        lessons: {
          create: validatedInput.lessons.map((lesson, index) => ({
            title: lesson.title,
            content: lesson.content,
            order: lesson.order ?? index,
          })),
        },
      },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return transformPrismaCourse(course);
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function listCourses(ownerId: string): Promise<Course[]> {
  if (!ownerId || typeof ownerId !== 'string') {
    throw new SDKException('INVALID_INPUT', 'Owner ID must be a non-empty string');
  }

  const prisma = getPrismaClient();

  try {
    const courses = await prisma.course.findMany({
      where: { ownerId },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return courses.map(transformPrismaCourse);
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function getCourseById(id: string): Promise<Course | null> {
  if (!id || typeof id !== 'string') {
    throw new SDKException('INVALID_INPUT', 'Course ID must be a non-empty string');
  }

  const prisma = getPrismaClient();

  try {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return course ? transformPrismaCourse(course) : null;
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  if (!slug || typeof slug !== 'string') {
    throw new SDKException('INVALID_INPUT', 'Course slug must be a non-empty string');
  }

  const prisma = getPrismaClient();

  try {
    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return course ? transformPrismaCourse(course) : null;
  } catch (error) {
    handlePrismaError(error);
  }
}
