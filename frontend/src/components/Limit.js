const Limit = ({ setLimit, limit }) => {
  return (
    <select className="form-select form-select-sm mb-3" aria-label=".form-select-lg" defaultValue={limit} onChange={(e) => setLimit(e.target.value)}>
      <option value="25">25</option>
      <option value="50">50</option>
      <option value="100">100</option>
    </select>
  );
};

export default Limit;
