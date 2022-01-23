const JobPartDueDate = require('../jobPartDueDateModel');

describe('Given a JobPartDueDate schema model, when JobPartDueDates has been updated', () => {
  it("A property named 'job' should be on the schema", () => {
    const job = JobPartDueDate.schema.obj.job;
    expect(job).toBeTruthy();
    expect(job.ref).toBe('JobDetails');
    expect(job.required).toBeTruthy();
  });
  it("A property named 'jobPartTitle' should be on the schema", () => {
    const jobPartTitle = JobPartDueDate.schema.obj.jobPartTitle;
    expect(jobPartTitle).toBeTruthy();
    expect(jobPartTitle.ref).toBe('JobPart');
  });
  it("A property named 'dueDate' should be on the schema", () => {
    const dueDate = JobPartDueDate.schema.obj.dueDate;
    expect(dueDate).toBeTruthy();
    expect(dueDate.type()).toEqual(expect.any(String));
  });
  it("A property named 'startDate' should be on the schema", () => {
    const startDate = JobPartDueDate.schema.obj.startDate;
    expect(startDate).toBeTruthy();
    expect(startDate.type()).toEqual(expect.any(String));
  });
  it("A property named 'contractor.contact' should be on the schema", () => {
    const contact = JobPartDueDate.schema.obj.contractor.contact;
    expect(contact).toBeTruthy();
    expect(contact.type()).toEqual(expect.any(String));
  });

  it("A property named 'contractor.email' should be on the schema", () => {
    const email = JobPartDueDate.schema.obj.contractor.email;
    expect(email).toBeTruthy();
    expect(email.type()).toEqual(expect.any(String));
  });
  it("A property named 'contractor.phone' should be on the schema", () => {
    const phone = JobPartDueDate.schema.obj.contractor.phone;
    expect(phone).toBeTruthy();
    expect(phone.type()).toEqual(expect.any(String));
  });
});
