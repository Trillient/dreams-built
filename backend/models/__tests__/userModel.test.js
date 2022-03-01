const User = require('../userModel.js');

describe('Given a User schema model has been updated', () => {
  it("A property named 'userId' should be on the schema", () => {
    const userId = User.schema.obj.userId;
    expect(userId).toBeTruthy();
    expect(userId.type()).toEqual(expect.any(String));
    expect(userId.required).toBeTruthy();
  });
  it("A property named 'firstName' should be on the schema", () => {
    const firstName = User.schema.obj.firstName;
    expect(firstName).toBeTruthy();
    expect(firstName.type()).toEqual(expect.any(String));
  });
  it("A property named 'lastName' should be on the schema", () => {
    const lastName = User.schema.obj.lastName;
    expect(lastName).toBeTruthy();
    expect(lastName.type()).toEqual(expect.any(String));
  });
  it("A property named 'auth0Email' should be on the schema", () => {
    const email = User.schema.obj.auth0Email;
    expect(email).toBeTruthy();
    expect(email.type()).toEqual(expect.any(String));
  });
  it("A property named 'hourlyRate' should be on the schema", () => {
    const hourlyRate = User.schema.obj.hourlyRate;
    expect(hourlyRate).toBeTruthy();
    expect(hourlyRate.type()).toEqual(expect.any(Number));
  });
});
