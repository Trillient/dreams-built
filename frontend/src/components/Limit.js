import { Form } from 'react-bootstrap';

import styles from './limit.module.css';

const Limit = ({ setLimit, limit }) => {
  return (
    <Form className={styles.select}>
      <Form.Group controlId={`limit`}>
        <Form.Control as="select" style={{ color: 'gray' }} className="form-select form-select-md" defaultValue={limit} onChange={(e) => setLimit(e.target.value)}>
          <option value="25">25 per page</option>
          <option value="50">50 per page</option>
          <option value="75">75 per page</option>
          <option value="100">100 per page</option>
        </Form.Control>
      </Form.Group>
    </Form>
  );
};

export default Limit;
