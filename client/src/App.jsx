import { useEffect, useState } from "react";
import {
  addProduct,
  deleteProduct,
  getHistory,
  getProducts,
  getSchedulerStatus,
  runTracking,
  toggleProduct,
} from "./api/client";
import PriceHistoryChart from "./components/PriceHistoryChart";
import ProductForm from "./components/ProductForm";
import ProductTable from "./components/ProductTable";
import SchedulerPanel from "./components/SchedulerPanel";

export default function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [history, setHistory] = useState([]);
  const [scheduler, setScheduler] = useState(null);
  const [error, setError] = useState("");

  async function loadProducts() {
    const rows = await getProducts();
    setProducts(rows);
  }

  async function loadScheduler() {
    const status = await getSchedulerStatus();
    setScheduler(status);
  }

  useEffect(() => {
    loadProducts().catch((err) => setError(err.message));
    loadScheduler().catch((err) => setError(err.message));
  }, []);

  const handleAdd = async (url) => {
    try {
      setError("");
      await addProduct(url);
      await loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleRunNow = async () => {
    try {
      setError("");
      await runTracking();
      await loadProducts();
      await loadScheduler();
      if (selectedProduct) {
        const data = await getHistory(selectedProduct._id);
        setHistory(data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleSelect = async (product) => {
    setSelectedProduct(product);
    const data = await getHistory(product._id);
    setHistory(data);
  };

  return (
    <main className="container">
      <h1>eBay Price Tracker (MERN + Olostep)</h1>
      {error && <p className="error">{error}</p>}
      <ProductForm onAdd={handleAdd} />
      <SchedulerPanel scheduler={scheduler} onRunNow={handleRunNow} />
      <ProductTable
        products={products}
        onSelect={handleSelect}
        onToggle={async (product) => {
          await toggleProduct(product._id, !product.active);
          await loadProducts();
        }}
        onDelete={async (id) => {
          await deleteProduct(id);
          await loadProducts();
          if (selectedProduct?._id === id) {
            setSelectedProduct(null);
            setHistory([]);
          }
        }}
      />
      <PriceHistoryChart selectedProduct={selectedProduct} history={history} />
    </main>
  );
}
