import express from 'express';
import { Category } from '../models/categoryModel.js';

const router = express.Router();

router.get('/', async (request, response) => {
    try {
        const categories = await Category.find({});
        return response.status(200).json({
            count: categories.length,
            data: categories
        });
    }
    catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: error.message });
    }
});

router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const category = await Category.findById(id);
        return response.status(200).json(category);
    }
    catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: error.message });
    }
});

router.post('/', async (request, response) => {
    try {
        if (!request.body.name) {
            return response.status(400).send({
                message: 'please send all order required fields'
            });
        }

        // Create the order
        const data = {
            name: request.body.name
        };

        const category = await Category.create(data);

        return response.status(201).send(category);
    } catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: error.message });
    }
});

router.put('/:id', async (request, response) => {
    try {
        const id = request.params.id;

        if (!request.body.name) {
            return response.status(400).send({
                message: 'Please send all required order fields'
            });
        }

        const data = {
            name: request.body.name
        };

        const category = await Category.findByIdAndUpdate(id, data);

        if (!category) {
            return response.status(404).send({
                message: 'category not found'
            });
        }

        return response.status(200).send(category);
    } catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: error.message });
    }
});


router.delete('/:id', async (request, response) => {
    try{
        const { id } = request.params;
        const result = await Category.findByIdAndDelete(id);

        if (!result) return response.status(404).json({ message: "Category not found" });
        return response.status(200).send({ message: "Order deleted successfully" });
    }
    catch(error){
        console.log(error.message);
        return response.status(500).send({message: error.message});
    }
})

export default router;