import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getJob } from '../../actions/jobActions';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const JobDetailsScreen = ({ match }) => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  const jobId = match.params.id;

  const jobDetails = useSelector((state) => state.job);
  const { loading, error, job } = jobDetails;

  const [jobNumber, setJobNumber] = useState('');
  const [client, setClient] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [color, setColor] = useState('');

  useEffect(() => {
    if (!job || job._id !== jobId) {
      (async () => {
        try {
          const token = await getAccessTokenSilently();
          dispatch(getJob(token, jobId));
        } catch (err) {
          console.log(err);
        }
      })();
    } else {
      setJobNumber(job.jobNumber);
      setClient(job.client.clientName);
      setAddress(job.address);
      setCity(job.city);
      setColor(job.color);
    }
  }, [dispatch, getAccessTokenSilently, job, jobId]);

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <div>
      {jobNumber} - {client} - {address} - {city} - {color}
    </div>
  );
};

export default JobDetailsScreen;
