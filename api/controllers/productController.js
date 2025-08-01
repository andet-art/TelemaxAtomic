import * as Product from '../models/productModel.js';

export const getProducts = async (req, res, next) => {
  try {
    const [products] = await Product.getAllProducts();
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err.message);
    next(err);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const [product] = await Product.getProductById(req.params.id);
    if (!product.length) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product[0]);
  } catch (err) {
    console.error('Error fetching product:', err.message);
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, version, image_url } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({ message: 'Name, description, and price are required' });
    }

    await Product.createProduct(req.body);
    res.status(201).json({ message: 'Product created' });
  } catch (err) {
    console.error('Error creating product:', err.message);
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({ message: 'Name, description, and price are required' });
    }

    await Product.updateProduct(req.params.id, req.body);
    res.json({ message: 'Product updated' });
  } catch (err) {
    console.error('Error updating product:', err.message);
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await Product.deleteProduct(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Error deleting product:', err.message);
    next(err);
  }
};
