import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FiEdit } from 'react-icons/fi';
import fontColorContrast from 'font-color-contrast';

import styles from './jobListScreen.module.css';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { getJobList } from '../../actions/jobActions';

const JobListScreen = () => {
  const { getAccessTokenSilently } = useAuth0();

  const dispatch = useDispatch();

  useEffect(() => {
    let token;
    const getToken = async () => {
      token = await getAccessTokenSilently();
    };
    getToken().then(() => dispatch(getJobList(token)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const jobsList = useSelector((state) => state.jobsList);
  const { loading, error, jobList } = jobsList;

  return (
    <div>
      <h1>Jobs</h1>
      <LinkContainer to={`/job/add`}>
        <Button className="btn-sm">+</Button>
      </LinkContainer>
      <div>Search job || Sort By customer/newest/oldest/paid || Update table columns</div>
      <section className={styles.table}>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message error={error} />
        ) : (
          <Table hover responsive>
            <thead className={styles['table-head']}>
              <tr>
                <th>Job Number</th>
                <th>Company</th>
                <th>Address</th>
                <th>City</th>
                <th>Client</th>
                <th>m&sup2;</th>
                <th>Invoiced</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {jobList.map((job) => (
                <tr className={styles.row} key={job._id}>
                  <td>
                    <strong>{job.jobNumber}</strong>
                  </td>
                  <td className={styles.company} style={{ backgroundColor: job.client.color, color: fontColorContrast(job.client.color) }}>
                    {job.client.clientName}
                  </td>
                  <td>{job.address}</td>
                  <td>{job.city}</td>
                  <td>{job.endClient}</td>
                  <td>{job.squareMeters}</td>
                  <td>{job.isInvoiced}</td>
                  <td>
                    <LinkContainer to={`/job/details/${job.jobNumber}`}>
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
      <div>Pagination</div>
    </div>
  );
};

export default JobListScreen;
