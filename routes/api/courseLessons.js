import { asc, eq } from 'drizzle-orm';
import * as schemas from '../../db/schema.js';

export default async function (fastify) {
  const db = fastify.db;

  fastify.get(
    '/course-lessons',
    {
      onRequest: [fastify.authenticate],
    },
    async function (request) {
      const perPage = 10;
      const { page = 1 } = request.query;

      return await db.query.courseLessons.findMany({
        orderBy: asc(schemas.courseLessons.id),
        limit: perPage,
        offset: (Number(page) - 1) * perPage,
      });
    },
  );

  fastify.get(
    '/course-lessons/:id',
    {
      onRequest: [fastify.authenticate],
    },
    async (request) => {
      const courseLesson = await db.query.courseLessons.findFirst({
        where: eq(schemas.courseLessons.id, request.params.id),
      });
      fastify.assert(courseLesson, 404);
      return courseLesson;
    },
  );

  fastify.post(
    '/course-lessons',
    {
      onRequest: [fastify.authenticate],
    },
    async (request, reply) => {
      const [courseLesson] = await db
        .insert(schemas.courseLessons)
        .values(request.body)
        .returning();

      return reply.code(201).send(courseLesson);
    },
  );

  fastify.patch(
    '/course-lessons/:id',
    {
      onRequest: [fastify.authenticate],
    },
    async (request) => {
      const [courseLesson] = await db
        .update(schemas.courseLessons)
        .set(request.body)
        .where(eq(schemas.courseLessons.id, request.params.id))
        .returning();
      fastify.assert(courseLesson, 404);

      return courseLesson;
    },
  );

  fastify.delete(
    '/course-lessons/:id',
    {
      onRequest: [fastify.authenticate],
    },
    async (request, reply) => {
      const [courseLesson] = await db
        .delete(schemas.courseLessons)
        .where(eq(schemas.courseLessons.id, request.params.id))
        .returning();
      fastify.assert(courseLesson, 404);

      return reply.code(204).send();
    },
  );
}
