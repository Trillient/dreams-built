import TimeSheet from '../timeSheetModel.js';

describe('Given a timesheet shema model has been updated', () => {
  it.todo('A property named "user" should be on the schema');

  it.todo('A property of "weekStart" should be on the shcema and be a date');

  it.todo('A property of "weekEnd" should be on the shcema and be a date');

  it.todo('A property of entries should be an array.');

  describe('When an entry is added to the entries array,', () => {
    it.todo('Then is should contain a unique entryID');
    it.todo('Then is should contain the entry day property');
    it.todo('Then is should contain the date the entry was made for');
    it.todo('Then it should contain the startTime');
    it.todo('Then it should contain the endTime');
    it.todo('Then it should contain a jobNumber referenced to the list of jobs');
  });
});
