import { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import { BsFillPrinterFill } from 'react-icons/bs';

import styles from './reactPrint.module.css';

const getPageMargins = () => {
  return `@page { margin: 2rem 2.5rem  !important; }`;
};

const ReactPrint = ({ children }) => {
  const componentRef = useRef();

  return (
    <>
      <ReactToPrint
        trigger={() => (
          <button className={styles.printer}>
            <BsFillPrinterFill />
          </button>
        )}
        content={() => componentRef.current}
      />
      <div ref={componentRef} className={styles.print}>
        <style>{getPageMargins()}</style>
        {children}
      </div>
    </>
  );
};

export default ReactPrint;
