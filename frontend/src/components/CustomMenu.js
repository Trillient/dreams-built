import React from 'react';

import { useState } from 'react';
import { FormControl } from 'react-bootstrap';

const CustomMenu = React.forwardRef(({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
  const [value, setValue] = useState('');
  return (
    <div ref={ref} style={style} className={className} aria-labelledby={labeledBy}>
      <FormControl autoFocus className="mx-3 my-2 w-auto" placeholder="Type to filter..." onChange={(e) => setValue(e.target.value)} value={value} />
      <ul className="list-unstyled">{React.Children.toArray(children).filter(({ props }) => !value || props.children.toString().toLowerCase().includes(value))}</ul>
    </div>
  );
});

export default CustomMenu;
