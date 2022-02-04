import { Button } from 'react-bootstrap';

const Paginate = ({ setCurrentPage, currentPage = null, totalPages = null }) => {
  const prevDisabled = currentPage > 1 ? false : true;
  const nextDisabled = currentPage >= totalPages ? true : false;

  return (
    <div>
      <Button aria-label="Previous page" onClick={() => setCurrentPage(currentPage - 1)} disabled={prevDisabled}>
        prev
      </Button>

      {totalPages > 1 && currentPage >= 1 && (
        <div>
          Page: {currentPage}/{totalPages}
        </div>
      )}

      <Button aria-label="Next page" onClick={() => setCurrentPage(currentPage + 1)} disabled={nextDisabled}>
        next
      </Button>
    </div>
  );
};

export default Paginate;
