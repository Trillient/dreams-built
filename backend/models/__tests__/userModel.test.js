const User = require('../userModel.js');

describe('Given a User schema model has been updated', () => {
  it("A property named 'userId' should be on the schema", () => {
    const userId = User.schema.obj.userId;
    expect(userId).toBeTruthy();
    expect(userId.type()).toEqual(expect.any(String));
  });
});
