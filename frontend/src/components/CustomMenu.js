import React from 'react';

const CustomMenu = React.forwardRef(({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
  return (
    <div ref={ref} style={style} className={className} aria-labelledby={labeledBy}>
      <ul className="list-unstyled">{React.Children.toArray(children)}</ul>
    </div>
  );
});

export default CustomMenu;
