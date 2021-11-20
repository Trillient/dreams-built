import mongoose from 'mongoose';

const jobSchema = mongoose.Schema(
  {
    jobNumber: { type: Number, required: true, unique: true, min: 22000 },
    company: String,
    address: String,
    city: String,
    client: String,
    area: Number,
    isInvoiced: Boolean,
    dueDates: [
      {
        jobDescription: String,
        dueDate: Date,
        contractor: String,
      },
    ],
  },
  { timestamps: true }
);

const jobDetails = mongoose.model('jobDetails', jobSchema);

export default jobDetails;
