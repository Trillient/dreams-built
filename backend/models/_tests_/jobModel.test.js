import JobDetails from '../jobModel.js';

describe('Given a Petemon shema JobDetails has been updated', () => {
  test("A property named 'id' should be on the schema", () => {
    const id = JobDetails.schema.obj.id;
    expect(id).toBeTruthy();
  });

  test("A property named 'name' should be on the schema and be an Object", () => {
    const name = JobDetails.schema.obj.name;
    expect(name).toBeTruthy();
    expect(_.isObject(name)).toBe(true);
  });

  test("A property named 'name' should contain a property named 'english'", () => {
    const name = JobDetails.schema.obj.name;
    expect(name).toBeTruthy();
    expect(name.english).toBeTruthy();
    expect(_.isObject(name.english)).toBeTruthy();
  });

  test('name.english should be of type String', () => {
    const name = JobDetails.schema.obj.name;
    expect(name).toBeTruthy();
    expect(name.english).toBeTruthy();
    expect(name.english.type).toBeTruthy();
    expect(typeof name.english.type()).toBe('string');
  });

  test("A property named 'type' should be on the schema and be an Array", () => {
    const type = JobDetails.schema.obj.type;
    expect(Array.isArray(type)).toBe(true);
  });

  test("A property named 'base' should be on the schema", () => {
    const base = JobDetails.schema.obj.base;
    expect(base).toBeTruthy();
    expect(_.isObject(base)).toBe(true);
  });
});
