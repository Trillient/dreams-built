import { useEffect, useState } from 'react';
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
import { ToastContainer } from 'react-toastify';
import PaginationGroup from '../../components/groups/PaginationGroup';
import HeaderSearchGroup from '../../components/groups/HeaderSearchGroup';

const JobListScreen = () => {
  const { getAccessTokenSilently } = useAuth0();

  const dispatch = useDispatch();

  const jobsList = useSelector((state) => state.jobsList);
  const { loading, error, jobList, pages } = jobsList;

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(2);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      const token = await getAccessTokenSilently();
      dispatch(getJobList(token, limit, currentPage, search));
    })();
  }, [currentPage, dispatch, getAccessTokenSilently, limit, search]);

  if (currentPage === 0 && pages > 0) {
    setCurrentPage(1);
  }

  if (currentPage > pages) {
    if (pages === 0) {
      setCurrentPage(0);
    } else {
      setCurrentPage(1);
    }
  }

  return (
    <>
      <ToastContainer theme="colored" />
      <div className={styles.parent}>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <section className="container">
            <div className={styles.card}>
              <HeaderSearchGroup title="Jobs" setSearch={setSearch} link="/jobs/create" />
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
                      {job.client === null ? (
                        <td>Client Deleted</td>
                      ) : (
                        <td className={styles.company} style={{ backgroundColor: job.client.color, color: fontColorContrast(job.client.color) }}>
                          {job.client.clientName}
                        </td>
                      )}
                      <td>{job.address}</td>
                      <td>{job.city}</td>
                      <td>{job.endClient}</td>
                      <td>{job.squareMeters}</td>
                      <td>{job.isInvoiced}</td>
                      <td>
                        <LinkContainer to={`/job/details/${job._id}`}>
                          <Button className="btn-sm">
                            <FiEdit />
                          </Button>
                        </LinkContainer>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <PaginationGroup pages={pages} currentPage={currentPage} setCurrentPage={setCurrentPage} limit={limit} setLimit={setLimit} />
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default JobListScreen;
