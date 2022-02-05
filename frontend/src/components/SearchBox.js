import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

import styles from './searchBox.module.css';

const SearchBox = ({ setSearch }) => {
  const [keyword, setKeyword] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    setSearch(keyword.trim());
  };

  return (
    <Form onSubmit={submitHandler}>
      <div className={styles.parent}>
        <Form.Control type="text" name="q" onChange={(e) => setKeyword(e.target.value)} placeholder="Search..." className={styles.input}></Form.Control>
        <Button type="submit" variant="info" className={styles.btn}>
          <FaSearch />
        </Button>
      </div>
    </Form>
  );
};

export default SearchBox;
