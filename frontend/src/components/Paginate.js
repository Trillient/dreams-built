import { Button } from 'react-bootstrap';

import styles from './paginate.module.css';

const Paginate = ({ setCurrentPage, currentPage = null, totalPages = null }) => {
  return (
    totalPages > 0 && (
      <div className={styles.pagination}>
        <Button aria-label="Previous page" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage <= 1}>
          prev
        </Button>
        {currentPage > 10 && (
          <>
            <Button onClick={() => setCurrentPage(currentPage - 10)}>{currentPage - 10}</Button>
            {'. . .'}
          </>
        )}
        {currentPage > 3 && <Button onClick={() => setCurrentPage(currentPage - 3)}>{currentPage - 3}</Button>}
        {currentPage > 2 && <Button onClick={() => setCurrentPage(currentPage - 2)}>{currentPage - 2}</Button>}
        {currentPage > 1 && <Button onClick={() => setCurrentPage(currentPage - 1)}>{currentPage - 1}</Button>}
        <Button variant="success">{currentPage}</Button>
        {totalPages >= currentPage + 1 && <Button onClick={() => setCurrentPage(currentPage + 1)}>{currentPage + 1}</Button>}
        {totalPages >= currentPage + 2 && <Button onClick={() => setCurrentPage(currentPage + 2)}>{currentPage + 2}</Button>}
        {totalPages >= currentPage + 3 && <Button onClick={() => setCurrentPage(currentPage + 3)}>{currentPage + 3}</Button>}
        {totalPages >= currentPage + 10 && (
          <>
            {'. . .'}
            <Button onClick={() => setCurrentPage(currentPage + 10)}>{currentPage + 10}</Button>
          </>
        )}
        <Button aria-label="Next page" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= totalPages}>
          next
        </Button>
      </div>
    )
  );
};

export default Paginate;
