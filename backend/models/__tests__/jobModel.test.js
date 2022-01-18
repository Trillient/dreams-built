const JobDetails = require('../jobModel.js');

describe('Given a jobDetails schema model JobDetails has been updated', () => {
  it("A property named 'jobNumber' should be on the schema", () => {
    const job = JobDetails.schema.obj.jobNumber;
    expect(job).toBeTruthy();
    expect(job.type()).toEqual(expect.any(Number));
  });
  it("A property named 'client' may be on the schema", () => {
    const client = JobDetails.schema.obj.client;
    expect(client).toBeTruthy();
    expect(client.ref).toBe('Client');
  });
  it("A property named 'address' may be on the schema", () => {
    const address = JobDetails.schema.obj.address;
    expect(address).toBeTruthy();
    expect(address.type()).toEqual(expect.any(String));
  });
  it("A property named 'city' may be on the schema", () => {
    const city = JobDetails.schema.obj.city;
    expect(city).toBeTruthy();
    expect(city.type()).toEqual(expect.any(String));
  });
  it("A property named 'area' may be on the schema", () => {
    const area = JobDetails.schema.obj.area;
    expect(area).toBeTruthy();
    expect(area.type()).toEqual(expect.any(Number));
  });
  it("A property named 'endClient' may be on the schema", () => {
    const endClient = JobDetails.schema.obj.endClient;
    expect(endClient).toBeTruthy();
    expect(endClient.type()).toEqual(expect.any(String));
  });
  it("A property named 'color' may be on the schema", () => {
    const color = JobDetails.schema.obj.color;
    expect(color).toBeTruthy();
    expect(color.type()).toEqual(expect.any(String));
  });
  it("A property named 'isInvoiced' is on the schema with a default value of false", () => {
    const isInvoiced = JobDetails.schema.obj.isInvoiced;
    expect(isInvoiced).toBeTruthy();
    expect(typeof isInvoiced.type()).toBe('boolean');
    expect(isInvoiced.default).toBeFalsy();
  });
});
