import { test } from 'node:test';
import * as assert from 'node:assert';
import { build } from '../../helper.js';
import { buildCourse, buildUser } from '../../../lib/data.js';

test('get courses', async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: '/api/courses',
  });
  assert.equal(res.statusCode, 200, res.body);
});

test('get courses/:id', async (t) => {
  const app = await build(t);

  const course = await app.db.query.courses.findFirst();
  assert.ok(course);

  const res = await app.inject({
    url: `/api/courses/${course.id}`,
  });
  assert.equal(res.statusCode, 200, res.body);
});

test('post courses', async (t) => {
  const app = await build(t);
  const user = await app.db.query.users.findFirst();
  const body = buildCourse({ creatorId: user.id });

  const res = await app.inject({
    method: 'post',
    url: `/api/courses`,
    body: body,
  });
  assert.equal(res.statusCode, 201, res.body);
});

test('patch courses/:id', async (t) => {
  const app = await build(t);

  const course = await app.db.query.courses.findFirst();
  assert.ok(course);

  // const authHeader = await getAuthHeader(app);
  const user = await app.db.query.users.findFirst();
  const body = buildCourse({ creatorId: user.id });

  const res = await app.inject({
    method: 'patch',
    url: `/api/courses/${course.id}`,
    body,
  });
  assert.equal(res.statusCode, 200, res.body);
});

test('delete courses/:id', async (t) => {
  const app = await build(t);

  const course = await app.db.query.courses.findFirst();
  assert.ok(course);

  const res = await app.inject({
    method: 'delete',
    url: `/api/courses/${course.id}`,
  });

  assert.equal(res.statusCode, 204, res.body);
});
