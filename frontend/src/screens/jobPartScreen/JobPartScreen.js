import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { FiEdit } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { ToastContainer } from 'react-toastify';
import { getJobPartsList } from '../../actions/jobActions';

import Loader from '../../components/Loader';
import Message from '../../components/Message';

const JobPartScreen = () => {
  const { getAccessTokenSilently } = useAuth0();

  const dispatch = useDispatch();

  useEffect(() => {
    let token;
    const getToken = async () => {
      token = await getAccessTokenSilently();
    };
    getToken().then(() => dispatch(getJobPartsList(token)));
  }, [dispatch, getAccessTokenSilently]);

  const jobsPartsList = useSelector((state) => state.jobParts);
  const { loading, error, jobParts } = jobsPartsList;

  return (
    <>
      <ToastContainer theme="colored" />
      <h1>Job Parts</h1>
      <LinkContainer to={`/jobparts/create`}>
        <Button>+</Button>
      </LinkContainer>
      <section>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Table hover responsive>
            <thead>
              <tr>
                <th>Order</th>
                <th>Job Part</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {jobParts.map((jobPart) => (
                <tr key={jobPart._id}>
                  <td>{jobPart.jobOrder}</td>
                  <td>{jobPart.jobPartTitle}</td>
                  <td>
                    <LinkContainer to={`/jobparts/edit/${jobPart._id}`}>
                      <Button className="btn-sm">
                        <FiEdit />
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </section>
    </>
  );
};

export default withAuthenticationRequired(JobPartScreen, {
  onRedirecting: () => <Loader />,
});
