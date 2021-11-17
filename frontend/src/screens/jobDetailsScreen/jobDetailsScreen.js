import jobList from '../../data/jobList.json';

const jobDetailsScreen = ({ match }) => {
  const job = jobList.filter((job) => job.jobNumber === parseInt(match.params.jobNumber));
  const { jobNumber, company, address, city, clientName } = job[0];

  return (
    <div>
      {jobNumber} - {company} - {address} - {city} - {clientName}
    </div>
  );
};

export default jobDetailsScreen;
