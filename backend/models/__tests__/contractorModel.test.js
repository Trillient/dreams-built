const Contractor = require('../contractorModel');

describe('Given a Contractor schema model has been updated', () => {
  it("A property named 'contractor' should be on the schema", () => {
    const contractor = Contractor.schema.obj.contractor;
    expect(contractor).toBeTruthy();
    expect(contractor.type()).toEqual(expect.any(String));
    expect(contractor.required).toBeTruthy();
  });
  it("A property named 'contact' may be on the schema and be an Object", () => {
    const contact = Contractor.schema.obj.contact;
    expect(contact).toBeTruthy();
    expect(contact.type()).toEqual(expect.any(String));
  });
  it("A property named 'email' may be on the schema", () => {
    const email = Contractor.schema.obj.email;
    expect(email).toBeTruthy();
    expect(email.type()).toEqual(expect.any(String));
  });
  it("A property named 'phone' may be on the schema", () => {
    const phone = Contractor.schema.obj.phone;
    expect(phone).toBeTruthy();
    expect(phone.type()).toEqual(expect.any(String || Number));
  });
});
