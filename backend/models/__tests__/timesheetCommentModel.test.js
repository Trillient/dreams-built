const TimesheetComment = require('../timesheetCommentModel');

describe('Given a timesheet schema model has been updated', () => {
  it('A property named "user" should be on the schema', () => {
    const user = TimesheetComment.schema.obj.user;
    expect(user).toBeTruthy();
    expect(user.ref).toBe('User');
    expect(user.required).toBeTruthy();
  });
  it('A property named "day" should be on the schema', () => {
    const day = TimesheetComment.schema.obj.day;
    expect(day).toBeTruthy();
    expect(day.required).toBeTruthy();
    expect(day.type()).toEqual(expect.any(String));
  });
  it('A property named "weekStart" should be on the schema', () => {
    const weekStart = TimesheetComment.schema.obj.weekStart;
    expect(weekStart).toBeTruthy();
    expect(weekStart.required).toBeTruthy();
    expect(weekStart.type()).toEqual(expect.any(String));
  });

  it('A property named "comments" should be on the schema', () => {
    const comments = TimesheetComment.schema.obj.comments;
    expect(comments).toBeTruthy();
    expect(comments.type()).toEqual(expect.any(String));
  });
});
