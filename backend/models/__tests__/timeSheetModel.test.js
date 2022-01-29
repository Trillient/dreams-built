const TimesheetEntry = require('../timesheetEntryModel.js');

describe('Given a timesheet schema model has been updated', () => {
  it('A property named "user" should be on the schema', () => {
    const user = TimesheetEntry.schema.obj.user;
    expect(user).toBeTruthy();
    expect(user.ref).toBe('User');
    expect(user.required).toBeTruthy();
  });
  it('Then is should contain a userId', () => {
    const user = TimesheetEntry.schema.obj.userId;
    expect(user).toBeTruthy();
    expect(user.type()).toEqual(expect.any(String));
    expect(user.required).toBeTruthy();
  });
  it('Then is should contain an entryID', () => {
    const entry = TimesheetEntry.schema.obj.entryId;
    expect(entry).toBeTruthy();
    expect(entry.type()).toEqual(expect.any(String));
    expect(entry.required).toBeTruthy();
  });
  it('Then is should contain the entry day property', () => {
    const entry = TimesheetEntry.schema.obj.day;
    expect(entry).toBeTruthy();
    expect(entry.type()).toEqual(expect.any(String));
    expect(entry.required).toBeTruthy();
  });
  it('Then it should contain the startTime', () => {
    const entry = TimesheetEntry.schema.obj.startTime;
    expect(entry).toBeTruthy();
    expect(entry.type()).toEqual(expect.any(String));
    expect(entry.required).toBeTruthy();
  });
  it('Then it should contain the endTime', () => {
    const entry = TimesheetEntry.schema.obj.endTime;
    expect(entry).toBeTruthy();
    expect(entry.type()).toEqual(expect.any(String));
    expect(entry.required).toBeTruthy();
  });
  it('Then it should contain a jobNumber', () => {
    const entry = TimesheetEntry.schema.obj.jobNumber;
    expect(entry).toBeTruthy();
    expect(entry.type()).toEqual(expect.any(Number));
    expect(entry.required).toBeTruthy();
  });
  it('Then it should contain a jobTime', () => {
    const entry = TimesheetEntry.schema.obj.jobTime;
    expect(entry).toBeTruthy();
    expect(entry.type()).toEqual(expect.any(Number));
    expect(entry.required).toBeTruthy();
  });
  it('A property of "weekStart" should be on the schema and be a date', () => {
    const entry = TimesheetEntry.schema.obj.weekStart;
    expect(entry).toBeTruthy();
    expect(entry.type()).toEqual(expect.any(String));
    expect(entry.required).toBeTruthy();
  });
  it('A property of "weekEnd" may be own the schema and be a date', () => {
    const entry = TimesheetEntry.schema.obj.weekEnd;
    expect(entry).toBeTruthy();
    expect(entry.type()).toEqual(expect.any(String));
  });
  it('A property of "isArchive" should be own the schema', () => {
    const entry = TimesheetEntry.schema.obj.isArchive;
    expect(entry).toBeTruthy();
    expect(entry.type()).toEqual(expect.any(Boolean));
  });
});
