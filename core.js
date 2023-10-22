const tests = [];
const onlys = [];
const beforeAlls = [];
const beforeEachs = [];
const afterAlls = [];
const afterEachs = [];

// 暂时只考虑一层，不考虑嵌套
export function describe(name, callback) {
  callback();
}

export function test(name, callback) {
  tests.push({ name, callback });
}

export const it = test;

test.only = function (name, callback) {
  onlys.push({ name, callback });
};

export function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Failed, ${actual} is not equal to ${expected}`);
      }
    },
  };
}

export function beforeAll(callback) {
  beforeAlls.push(callback);
}

export function beforeEach(callback) {
  beforeEachs.push(callback);
}

export function afterAll(callback) {
  afterAlls.push(callback);
}

export function afterEach(callback) {
  afterEachs.push(callback);
}

export function run() {
  for (const beforeAllCallback of beforeAlls) {
    beforeAllCallback();
  }

  const suits = onlys.length > 0 ? onlys : tests;
  for (const test of suits) {
    for (const beforeEachCallback of beforeEachs) {
      beforeEachCallback();
    }

    try {
      test.callback();
      console.log(`ok: ${test.name}`);
    } catch (error) {
      console.log(`Fail: ${error}`);
    }

    for (const afterEachCallback of afterEachs) {
      afterEachCallback();
    }
  }

  for (const afterAllCallback of afterAlls) {
    afterAllCallback();
  }
}
