const User = require('../userModel.js');

describe('Given a User shema model has been updated', () => {
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

  it("A property named 'email' should be on the schema and is unique", () => {
    const email = User.schema.obj.email;
    console.log(email);
    expect(email).toBeTruthy();
    expect(email.unique).toBeTruthy();
  });

  it('isAdmin should be of type Boolean and a default value of False', () => {
    const isAdmin = User.schema.obj.isAdmin;
    expect(isAdmin).toBeTruthy();
    expect(isAdmin.default).toBeFalsy();
  });

  // TODO - user Details Schema test

  // TODO - timestamp test
});
