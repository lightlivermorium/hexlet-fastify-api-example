import { asc, eq } from 'drizzle-orm';
import * as schemas from '../../db/schema.js';

export default async function (fastify) {
  const db = fastify.db;

  fastify.get('/courses', async function (request) {
    const perPage = 10;
    const { page = 1 } = request.query;
    const courses = await db.query.courses.findMany({
      orderBy: asc(schemas.courses.id),
      limit: perPage,
      offset: (Number(page) - 1) * perPage,
    });

    return courses;
  });

  fastify.get('/courses/:id', async (request) => {
    const course = await db.query.courses.findFirst({
      where: eq(schemas.courses.id, request.params.id),
    });
    fastify.assert(course, 404);
    return course;
  });

  fastify.post('/courses', async (request, reply) => {
    const [course] = await db
      .insert(schemas.courses)
      .values(request.body)
      .returning();

    return reply.code(201).send(course);
  });

  fastify.patch('/courses/:id', async (request) => {
    const [course] = await db
      .update(schemas.courses)
      .set(request.body)
      .where(eq(schemas.courses.id, request.params.id))
      .returning();
    fastify.assert(course, 404);

    return course;
  });

  fastify.delete('/courses/:id', async (request, reply) => {
    const [course] = await db
      .delete(schemas.courses)
      .where(eq(schemas.courses.id, request.params.id))
      .returning();
    fastify.assert(course, 404);

    return reply.code(204).send();
  });
}
