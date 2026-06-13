import { test } from 'node:test';
import * as assert from 'node:assert';
import { build } from '../../helper.js';
import {
  buildCourse,
  buildUser,
  buildCourseLesson,
} from '../../../lib/data.js';

test('get course lessons', async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: '/api/course-lessons',
  });
  assert.equal(res.statusCode, 200, res.body);
});

test('get course lessons/:id', async (t) => {
  const app = await build(t);

  const courseLesson = await app.db.query.courseLessons.findFirst();
  assert.ok(courseLesson);

  const res = await app.inject({
    url: `/api/course-lessons/${courseLesson.id}`,
  });
  assert.equal(res.statusCode, 200, res.body);
});

test('post course lessons', async (t) => {
  const app = await build(t);
  const course = await app.db.query.courses.findFirst();
  const body = buildCourseLesson({ courseId: course.id });

  const res = await app.inject({
    method: 'post',
    url: `/api/course-lessons`,
    body: body,
  });
  assert.equal(res.statusCode, 201, res.body);
});

test('patch course lessons/:id', async (t) => {
  const app = await build(t);

  const courseLesson = await app.db.query.courseLessons.findFirst();
  assert.ok(courseLesson);

  // const authHeader = await getAuthHeader(app);
  const course = await app.db.query.courses.findFirst();
  const body = buildCourseLesson({ courseId: course.id });

  const res = await app.inject({
    method: 'patch',
    url: `/api/course-lessons/${courseLesson.id}`,
    body,
  });
  assert.equal(res.statusCode, 200, res.body);
});

test('delete course lessons/:id', async (t) => {
  const app = await build(t);

  const courseLesson = await app.db.query.courseLessons.findFirst();
  assert.ok(courseLesson);

  const res = await app.inject({
    method: 'delete',
    url: `/api/course-lessons/${courseLesson.id}`,
  });

  assert.equal(res.statusCode, 204, res.body);
});
