import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const SearchBox = ({ setSearch }) => {
  const [keyword, setKeyword] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    setSearch(keyword.trim());
  };

  return (
    <Form onSubmit={submitHandler}>
      <Form.Control type="text" name="q" onChange={(e) => setKeyword(e.target.value)} placeholder="Search..." className="mr-sm-2 ml-sm-5"></Form.Control>
      <Button type="submit" variant="outline-success" className="p-2">
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
