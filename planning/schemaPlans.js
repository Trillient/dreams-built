const schema = {
  _id: String,
  firstName: String,
  lastName: String,
  birthDate: Date,
  hourlyRate: Number,
  timeSheet: [{ weeklyTimeSheet }],
};

const weeklyTimeSheet = {
  weekStart: String,
  weekEnd: String,
  dayTimeSheet: [{ dayTimeSheet }],
};

const dayTimeSheet = {
  date: Date,
  day: [{ timeSheetEntries }],
};

const timeSheetEntries = {
  startTime: Number,
  endTime: Number,
  jobNumber: Number,
  totalTime: Number,
};

//EXAMPLE

[
  {
    _id: "XXXXXXXXXXXXXXXX",
    firstName: "John",
    lastName: "Doe",
    birthDate: "21/03/1999",
    hourlyRate: 22,
    timeSheet: [
      {
        weekStart: "16/08/2021",
        weekEnd: "22/08/2021",
        dayTimeSheet: [
          {
            date: "21/08/2021",
            day: [
              {
                startTime: "10:00am",
                endTime: "12:00pm",
                jobNumber: 21100,
                totalTime: 2,
              },
              {
                startTime: "1:00pm",
                endTime: "3:00pm",
                jobNumber: 21101,
                totalTime: 2,
              },
            ],
          },
          {
            date: "22/08/2021",
            day: [
              {
                startTime: "10:00am",
                endTime: "12:00pm",
                jobNumber: 21100,
                totalTime: 2,
              },
              {
                startTime: "1:00pm",
                endTime: "3:00pm",
                jobNumber: 21101,
                totalTime: 2,
              },
            ],
          },
        ],
      },
      {
        weekStart: "09/08/2021",
        weekEnd: "15/08/2021",
        dayTimeSheet: [
          {
            date: "12/08/2021",
            day: [
              {
                startTime: "10:00am",
                endTime: "12:00pm",
                jobNumber: 21100,
                totalTime: 2,
              },
              {
                startTime: "1:00pm",
                endTime: "3:00pm",
                jobNumber: 21101,
                totalTime: 2,
              },
            ],
          },
          {
            date: "13/08/2021",
            day: [
              {
                startTime: "10:00am",
                endTime: "12:00pm",
                jobNumber: 21100,
                totalTime: 2,
              },
              {
                startTime: "1:00pm",
                endTime: "3:00pm",
                jobNumber: 21101,
                totalTime: 2,
              },
            ],
          },
        ],
      },
    ],
  },
];
