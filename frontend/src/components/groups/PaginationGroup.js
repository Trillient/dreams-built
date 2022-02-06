import React from 'react';
import Limit from '../Limit';
import Paginate from '../Paginate';

import styles from './paginationGroup.module.css';

const PaginationGroup = ({ pages, currentPage, setCurrentPage, limit, setLimit }) => {
  return (
    pages > 1 && (
      <div className={styles.controls}>
        <div>
          <Paginate setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={pages} />
        </div>
        <div className={styles.limit}>
          <Limit setLimit={setLimit} limit={limit} />
        </div>
      </div>
    )
  );
};

export default PaginationGroup;
