const JobPart = require('../jobPartModel');

describe('Given a JobPart schema model JobParts has been updated', () => {
  it("A property named 'jobPartTitle' should be on the schema", () => {
    const jobPart = JobPart.schema.obj.jobPartTitle;
    expect(jobPart).toBeTruthy();
    expect(jobPart.type()).toEqual(expect.any(String));
    expect(jobPart.required).toBeTruthy();
  });
  it("A property named 'jobOrder' should be on the schema", () => {
    const jobOrder = JobPart.schema.obj.jobOrder;
    expect(jobOrder).toBeTruthy();
    expect(jobOrder.type()).toEqual(expect.any(Number));
  });
  it("A property named 'jobDescription' should be on the schema", () => {
    const jobDescription = JobPart.schema.obj.jobDescription;
    expect(jobDescription).toBeTruthy();
    expect(jobDescription.type()).toEqual(expect.any(String));
  });
});
