const TimeSheetEntry = require('../timeSheetEntryModel.js');

describe('Given a timesheet schema model has been updated', () => {
  it('A property named "user" should be on the schema', () => {
    const user = TimeSheetEntry.schema.obj.user;
    expect(user).toBeTruthy();
    expect(user.ref).toBe('User');
    expect(user.required).toBeTruthy();
  });
  it('Then is should contain a userId', () => {
    const user = TimeSheetEntry.schema.obj.userId;
    expect(user).toBeTruthy();
    expect(user.type()).toEqual(expect.any(String));
    expect(user.required).toBeTruthy();
  });
  it('Then is should contain an entryID', () => {
    const entry = TimeSheetEntry.schema.obj.entryId;
    expect(entry).toBeTruthy();
    expect(entry.type()).toEqual(expect.any(String));
    expect(entry.required).toBeTruthy();
  });
  it('Then is should contain the entry day property', () => {
    const entry = TimeSheetEntry.schema.obj.day;
    expect(entry).toBeTruthy();
    expect(entry.type()).toEqual(expect.any(String));
    expect(entry.required).toBeTruthy();
  });
  it('Then is should contain the date the entry was made for', () => {
    const entry = TimeSheetEntry.schema.obj.date;
    expect(entry).toBeTruthy();
    expect(entry.type()).toEqual(expect.any(String));
    expect(entry.required).toBeTruthy();
  });
  it('Then it should contain the startTime', () => {
    const entry = TimeSheetEntry.schema.obj.startTime;
    expect(entry).toBeTruthy();
    expect(entry.type()).toEqual(expect.any(String));
    expect(entry.required).toBeTruthy();
  });
  it('Then it should contain the endTime', () => {
    const entry = TimeSheetEntry.schema.obj.endTime;
    expect(entry).toBeTruthy();
    expect(entry.type()).toEqual(expect.any(String));
    expect(entry.required).toBeTruthy();
  });
  it('Then it should contain a jobNumber', () => {
    const entry = TimeSheetEntry.schema.obj.jobNumber;
    expect(entry).toBeTruthy();
    expect(entry.type()).toEqual(expect.any(Number));
    expect(entry.required).toBeTruthy();
  });
  it('Then it should contain a jobTime', () => {
    const entry = TimeSheetEntry.schema.obj.jobTime;
    expect(entry).toBeTruthy();
    expect(entry.type()).toEqual(expect.any(Number));
    expect(entry.required).toBeTruthy();
  });
  it('A property of "weekStart" should be on the shcema and be a date', () => {
    const entry = TimeSheetEntry.schema.obj.weekStart;
    expect(entry).toBeTruthy();
    expect(entry.type()).toEqual(expect.any(String));
    expect(entry.required).toBeTruthy();
  });

  it('A property of "weekEnd" should be own the shcema and be a date', () => {
    const entry = TimeSheetEntry.schema.obj.weekEnd;
    expect(entry).toBeTruthy();
    expect(entry.type()).toEqual(expect.any(String));
    expect(entry.required).toBeTruthy();
  });
});
