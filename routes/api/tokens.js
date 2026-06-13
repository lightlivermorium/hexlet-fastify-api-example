import * as schemas from '../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function (fastify) {
  const db = fastify.db;

  fastify.post('/tokens', async (request, reply) => {
    const user = await db.query.users.findFirst({
      where: eq(schemas.users.email, request.body.email),
    });
    fastify.assert.ok(user, 404);

    const token = fastify.jwt.sign(
      { id: user.id, email: user.email },
      { expiresIn: '1h' },
    );
    return reply.code(201).send({ token });
  });
}
