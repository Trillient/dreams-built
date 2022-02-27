import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { FiEdit } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { getJobPartsList, updateJobPartOrder } from '../../actions/jobActions';

import HeaderSearchGroup from '../../components/groups/HeaderSearchGroup';
import PaginationGroup from '../../components/groups/PaginationGroup';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

import styles from './jobPartScreen.module.css';

const JobPartScreen = () => {
  const { getAccessTokenSilently } = useAuth0();

  const dispatch = useDispatch();

  const jobsPartsList = useSelector((state) => state.jobParts);
  const { loading, error, jobParts, pages } = jobsPartsList;

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [search, setSearch] = useState('');

  const [list, setList] = useState(jobParts);

  useEffect(() => {
    (async () => {
      const token = await getAccessTokenSilently();
      dispatch(getJobPartsList(token, limit, currentPage, search));
    })();
  }, [currentPage, limit, search, dispatch, getAccessTokenSilently]);

  useEffect(() => {
    setList(jobParts);
  }, [jobParts]);

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

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(list);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const rearrangedList = items.map((item, index) => {
      item.jobOrder = index;
      return item;
    });

    setList(rearrangedList);
  };

  const handleSubmit = async () => {
    const token = await getAccessTokenSilently();
    dispatch(updateJobPartOrder(token, list));
  };

  return (
    <div className={styles.parent}>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <section className="container">
          <div className={styles.card}>
            <HeaderSearchGroup title="Job Parts" setSearch={setSearch} link="/jobparts/create" />
            <Table hover responsive>
              <thead>
                <tr>
                  <th style={{ width: '5%' }}>Order</th>
                  <th>Job Part</th>
                  <th className={styles.responsive}>Job Description</th>
                  <th style={{ width: '5%' }}>Edit</th>
                </tr>
              </thead>
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="jobParts">
                  {(provided) => (
                    <tbody {...provided.droppableProps} ref={provided.innerRef}>
                      {list &&
                        list.map(({ jobOrder, jobPartTitle, _id, jobDescription }, index) => (
                          <Draggable key={jobOrder} draggableId={jobOrder.toString()} index={index}>
                            {(provided) => (
                              <tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <td>{jobOrder + 1}</td>
                                <td>
                                  <strong>{jobPartTitle}</strong>
                                </td>
                                <td className={styles.responsive}>{jobDescription}</td>
                                <td>
                                  <LinkContainer to={`/jobparts/edit/${_id}`}>
                                    <Button className="btn-sm">
                                      <FiEdit />
                                    </Button>
                                  </LinkContainer>
                                </td>
                              </tr>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </tbody>
                  )}
                </Droppable>
              </DragDropContext>
            </Table>
            <PaginationGroup pages={pages} currentPage={currentPage} setCurrentPage={setCurrentPage} limit={limit} setLimit={setLimit} />
            <Button onClick={handleSubmit} disabled={list === jobParts} variant={list === jobParts ? 'primary' : 'success'} style={{ margin: '1rem 0' }}>
              Save Order
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default withAuthenticationRequired(JobPartScreen, {
  onRedirecting: () => <Loader />,
});
