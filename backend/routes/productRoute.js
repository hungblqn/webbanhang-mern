import express from 'express';
import { Product } from '../models/productModel.js';

const router = express.Router();

//Get all product
router.get('/', async (request, response) => {
    try {
        const products = await Product.find({});
        return response.status(200).json({
            count: products.length,
            data: products
        });
    }
    catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: error.message });
    }
});

//Get product by id
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const product = await Product.findById(id);
        return response.status(200).json(product);
    }
    catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: error.message });
    }
});

//Add product
router.post('/', async (request, response) => {
    try {
        if (!request.body.name ||
            !request.body.description ||
            !request.body.price ||
            !request.body.image ||
            !request.body.category ||
            !request.body.stock_quantity) {
            return response.status(400).send({
                message: 'Please send all product fields: name, des, price, image, category, quantity'
            });
        }
        const newProduct = {
            name: request.body.name,
            description: request.body.description,
            price: request.body.price,
            image: request.body.image,
            category: request.body.category,
            stock_quantity: request.body.stock_quantity
        };
        const product = await Product.create(newProduct);
        return response.status(201).send(product);
    }
    catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//Update product
router.put('/:id', async (request, response) => {
    try {
        if (!request.body.name ||
            !request.body.description ||
            !request.body.price ||
            !request.body.image ||
            !request.body.category ||
            !request.body.stock_quantity) {
            return response.status(400).send({
                message: 'Please send all product fields: name, des, price, image, category, quantity'
            });
        }
        const { id } = request.params;
        const product = {
            name: request.body.name,
            description: request.body.description,
            price: request.body.price,
            image: request.body.image,
            category: request.body.category,
            stock_quantity: request.body.stock_quantity
        };
        const result = await Product.findByIdAndUpdate(id, product);

        if (!result) return response.status(404).json({ message: "Product not found" });
        return response.status(200).send({ message: "Product updated successfully" });
    }
    catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//Delete product
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const result = await Product.findByIdAndDelete(id);

        if (!result) return response.status(404).json({ message: "Product not found" });
        return response.status(200).send({ message: "Product deleted successfully" });
    }
    catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Get product by name (finding likely matches)
router.get('/findByName/:productName', async (request, response) => {
    try {
      const { productName } = request.params;
  
      // Use a regular expression for case-insensitive partial match
      const regex = new RegExp(productName, 'i');
  
      const products = await Product.find({ name: { $regex: regex } });
  
      if (products) {
        response.status(200).send({ message: 'done', data: products });
      }
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  })



export default router;
