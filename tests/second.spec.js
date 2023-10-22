import {
  test,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
  afterEach,
  describe,
} from "../core";

beforeAll(() => {
  console.log("before all");
});

beforeEach(() => {
  console.log("before each");
});

describe("all tests", () => {
  test("first test case", () => {
    console.log("---first test case---");
    expect(1 + 1).toBe(2);
  });

  test("second test case inside describe", () => {
    console.log("---second test case---");
    expect(1 + 1).toBe(3);
  });

  it("it", () => {
    console.log("---it---");
  });

  // test.only("only test this", () => {
  //   console.log("only test this");
  // });
});

afterEach(() => {
  console.log("after each");
});

afterAll(() => {
  console.log("after all");
});
