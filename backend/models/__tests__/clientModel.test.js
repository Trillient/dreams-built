const Client = require('../clientModel.js');

describe('Given a User schema model has been updated', () => {
  it("A property named 'clientName' should be on the schema", () => {
    const clientName = Client.schema.obj.clientName;
    expect(clientName).toBeTruthy();
    expect(clientName.type()).toEqual(expect.any(String));
  });
  it("A property named 'color' may be on the schema", () => {
    const color = Client.schema.obj.color;
    expect(color).toBeTruthy();
  });
  it("A property named 'contact' may be on the schema and be an Object", () => {
    const contact = Client.schema.obj.contact;
    expect(contact).toBeTruthy();
    expect(typeof contact).toBe('object');
  });
  it("A property named 'contact' should contain 'email' and 'name' properties that are strings.", () => {
    const email = Client.schema.obj.contact.email;
    const name = Client.schema.obj.contact.name;

    expect(email).toBeTruthy();
    expect(email.type()).toEqual(expect.any(String));

    expect(name).toBeTruthy();
    expect(name.type()).toEqual(expect.any(String));
  });
});
