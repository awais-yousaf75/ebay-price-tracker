function directionClass(direction) {
  if (direction === "lower") return "badge good";
  if (direction === "higher") return "badge bad";
  return "badge";
}

export default function ProductTable({ products, onToggle, onDelete, onSelect }) {
  return (
    <div className="card">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Previous</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td onClick={() => onSelect(product)} className="clickable">
                {product.title || product.url}
              </td>
              <td>{product.currentPrice ?? "-"}</td>
              <td>{product.previousPrice ?? "-"}</td>
              <td>
                <span className={directionClass(product.changeDirection)}>
                  {product.changeDirection}
                </span>
              </td>
              <td>
                <button onClick={() => onToggle(product)}>
                  {product.active ? "Pause" : "Resume"}
                </button>
                <button className="danger" onClick={() => onDelete(product._id)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
          {!products.length && (
            <tr>
              <td colSpan="5">No tracked products yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
