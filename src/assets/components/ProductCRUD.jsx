// src/ProductCRUD.jsx
import React, { useState, useEffect } from 'react';
import '../css/ProductCRUD.css';
import { db } from '../../firebaseConfig.js';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

function ProductCRUD() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(''); // Nuevo campo para cantidad
  const [editingIndex, setEditingIndex] = useState(null);
  const [error, setError] = useState('');

  const productsCollection = collection(db, "products");

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(productsCollection);
      const productsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsList);
    };
    fetchProducts();
  }, []);

  const validateFields = () => {
    if (!name || !price || !quantity) {
      setError('Todos los campos son obligatorios');
      return false;
    }
    if (isNaN(price) || Number(price) <= 0) {
      setError('El precio debe ser un número positivo');
      return false;
    }
    if (isNaN(quantity) || Number(quantity) <= 0) {
      setError('La cantidad debe ser un número positivo');
      return false;
    }
    if (products.some((product, index) => product.name === name && index !== editingIndex)) {
      setError('El producto ya está registrado');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    const newProduct = { name, price: Number(price), quantity: Number(quantity) };

    if (editingIndex !== null) {
      const productDoc = doc(db, "products", products[editingIndex].id);
      await updateDoc(productDoc, newProduct);

      const updatedProducts = [...products];
      updatedProducts[editingIndex] = { id: products[editingIndex].id, ...newProduct };
      setProducts(updatedProducts);
      setEditingIndex(null);
    } else {
      const docRef = await addDoc(productsCollection, newProduct);
      setProducts([...products, { id: docRef.id, ...newProduct }]);
    }

    setName('');
    setPrice('');
    setQuantity(''); // Limpiar el campo de cantidad
  };

  const handleDelete = async (index) => {
    const productDoc = doc(db, "products", products[index].id);
    await deleteDoc(productDoc);
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    setName(products[index].name);
    setPrice(products[index].price);
    setQuantity(products[index].quantity); // Llenar el campo de cantidad al editar
    setEditingIndex(index);
  };

  return (
    <div className="container">
      <h2 className="title">{editingIndex !== null ? 'Editar Producto' : 'Registrar Producto'}</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre del producto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />
        <input
          type="number"
          placeholder="Precio"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="input"
        />
        <input
          type="number"
          placeholder="Cantidad"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="input"
        />
        <button type="submit" className="button">
          {editingIndex !== null ? 'Actualizar' : 'Agregar'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}

      <h2 className="title">Listado de Productos</h2>
      <ul className="productList">
        {products.map((product, index) => (
          <li key={product.id} className="productItem">
            <span className="productText">
              {product.name} - ${product.price} - Cantidad: {product.quantity}
            </span>
            <button onClick={() => handleEdit(index)} className="editButton">Editar</button>
            <button onClick={() => handleDelete(index)} className="deleteButton">Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductCRUD;
