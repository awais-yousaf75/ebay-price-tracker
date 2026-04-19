import { useState } from "react";

export default function ProductForm({ onAdd }) {
  const [url, setUrl] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!url.trim()) return;
    await onAdd(url);
    setUrl("");
  };

  return (
    <form className="card row" onSubmit={handleSubmit}>
      <input
        type="url"
        placeholder="Paste eBay product URL"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        required
      />
      <button type="submit">Add Product</button>
    </form>
  );
}
