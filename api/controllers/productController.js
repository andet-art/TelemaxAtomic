import * as Product from '../models/productModel.js';

export const getProducts = async (req, res, next) => {
  try {
    const [rows] = await Product.getAllProducts();
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const [rows] = await Product.getProductById(req.params.id);
    if (!rows.length) return res.status(404).json({ message: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    await Product.createProduct(req.body);
    res.status(201).json({ message: 'Product created' });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    await Product.updateProduct(req.params.id, req.body);
    res.json({ message: 'Product updated' });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await Product.deleteProduct(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};
