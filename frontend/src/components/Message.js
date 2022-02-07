import React from 'react';
import { Alert } from 'react-bootstrap';

const Message = ({ variant, children, margin = '2rem' }) => {
  return (
    <Alert style={{ margin: margin }} variant={variant}>
      {children}
    </Alert>
  );
};

Message.defaultProps = {
  variant: 'info',
};

export default Message;
