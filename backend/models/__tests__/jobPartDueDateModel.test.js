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
  it("A property named 'dueDateRange' should be on the schema", () => {
    const dueDateRange = JobPartDueDate.schema.obj.dueDateRange;
    expect(dueDateRange).toBeTruthy();
    expect(Array.isArray(dueDateRange)).toBeTruthy();
    expect(dueDateRange[0].type()).toEqual(expect.any(String));
  });
  it("A property named 'contractors' should be on the schema", () => {
    const contractors = JobPartDueDate.schema.obj.contractors;
    expect(contractors).toBeTruthy();
    expect(Array.isArray(contractors)).toBeTruthy();
    expect(contractors[0].ref).toBe('Contractor');
  });
});
