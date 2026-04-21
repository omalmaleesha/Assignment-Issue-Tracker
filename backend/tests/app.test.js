const test = require('node:test');
const assert = require('node:assert/strict');

// Basic smoke test to ensure app module exports an Express app instance.
test('app module should be loadable', async () => {
  const app = require('../src/app');
  assert.ok(app);
  assert.equal(typeof app.use, 'function');
});
