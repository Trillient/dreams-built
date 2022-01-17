const Client = require('../clientModel.js');

describe('Given a User schema model has been updated', () => {
  it("A property named 'userId' should be on the schema", () => {
    const clientName = Client.schema.obj.clientName;
    expect(clientName).toBeTruthy();
    expect(clientName.type()).toEqual(expect.any(String));
    expect(clientName.unique()).toBeTruthy();
  });
});
