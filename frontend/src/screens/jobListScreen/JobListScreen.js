import { useEffect, useState, useRef } from 'react';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FiEdit } from 'react-icons/fi';
import fontColorContrast from 'font-color-contrast';
import ReactToPrint from 'react-to-print';
import { ToastContainer } from 'react-toastify';
import { BsFillPrinterFill } from 'react-icons/bs';
import { TiTick } from 'react-icons/ti';

import { getJobList } from '../../actions/jobActions';

import Loader from '../../components/Loader';
import Message from '../../components/Message';
import PaginationGroup from '../../components/groups/PaginationGroup';
import HeaderSearchGroup from '../../components/groups/HeaderSearchGroup';

import styles from './jobListScreen.module.css';

const getPageMargins = () => {
  return `@page { margin: 2rem 2.5rem  !important; }`;
};

const JobListScreen = () => {
  const { getAccessTokenSilently } = useAuth0();

  const componentRef = useRef();
  const dispatch = useDispatch();

  const jobsList = useSelector((state) => state.jobsList);
  const { loading, error, jobList, pages } = jobsList;

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);
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
          <>
            <section className="container">
              <ReactToPrint
                trigger={() => (
                  <button className={styles.printer}>
                    <BsFillPrinterFill />
                  </button>
                )}
                content={() => componentRef.current}
              />
              <div className={styles.card}>
                <HeaderSearchGroup title="Jobs" setSearch={setSearch} link="/jobs/create" />
                <div ref={componentRef}>
                  <style>{getPageMargins()}</style>
                  <Table bordered hover>
                    <thead className={styles['table-head']}>
                      <tr>
                        <th>Job Number</th>
                        <th className={styles.sm}>Client</th>
                        <th>Address</th>
                        <th className={styles.md}>City</th>
                        <th className={`${styles.md} ${styles.edit}`}>Customer</th>
                        <th className={`${styles.md} ${styles.edit}`}>m&sup2;</th>
                        <th className={styles.md} style={{ width: '4%' }}>
                          Invoiced
                        </th>
                        <th className={styles.edit} style={{ width: '4%' }}>
                          Edit
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobList.map((job) => (
                        <tr className={styles.row} key={job._id}>
                          <td>
                            <strong>{job.jobNumber}</strong>
                          </td>
                          {job.client === null ? (
                            <td className={styles.sm}>Client Deleted</td>
                          ) : (
                            <td className={(styles.company, styles.sm)} style={{ backgroundColor: job.client.color, color: fontColorContrast(job.client.color) }}>
                              {job.client.clientName}
                            </td>
                          )}
                          <td>{job.address}</td>
                          <td className={styles.md}>{job.city}</td>
                          <td className={`${styles.md} ${styles.edit}`}>{job.endClient}</td>
                          <td className={`${styles.md} ${styles.edit}`}>{job.area}</td>
                          <td className={`${styles.md} ${styles.checked}`}>{job.isInvoiced ? <TiTick /> : null}</td>
                          <td className={styles.edit}>
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
                </div>
                <PaginationGroup pages={pages} currentPage={currentPage} setCurrentPage={setCurrentPage} limit={limit} setLimit={setLimit} />
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
};

export default withAuthenticationRequired(JobListScreen, {
  onRedirecting: () => <Loader />,
});
