export default function PriceHistoryChart({ selectedProduct, history }) {
  return (
    <div className="card">
      <h3>Price History</h3>
      {!selectedProduct && <p>Select a product to view history.</p>}
      {selectedProduct && !history.length && <p>No snapshots yet.</p>}
      {history.length > 0 && (
        <ul className="history">
          {history.map((entry) => (
            <li key={entry._id}>
              <span>{new Date(entry.checkedAt).toLocaleString()}</span>
              <strong>
                {entry.price} {entry.currency}
              </strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
