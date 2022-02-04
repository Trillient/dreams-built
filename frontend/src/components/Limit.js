const Limit = ({ setLimit, limit }) => {
  return (
    <select className="form-select form-select-sm mb-3" aria-label=".form-select-lg" defaultValue={limit} onChange={(e) => setLimit(e.target.value)}>
      <option value="1">One</option>
      <option value="2">Two</option>
      <option value="3">Three</option>
    </select>
  );
};

export default Limit;
