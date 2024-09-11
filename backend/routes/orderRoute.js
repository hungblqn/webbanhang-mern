import express, { response } from 'express';
import { Order } from '../models/orderModel.js';
import { Product } from '../models/productModel.js';

const router = express.Router();

//get order with id
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const order = await Order.findById(id);
        return response.status(200).json(order);
    }
    catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: error.message });
    }
});

//get all orders
router.get('/', async (request, response) => {
    try {
        const orders = await Order.find({}).populate('account');
        return response.status(200).json({
            count: orders.length,
            data: orders
        });
    }
    catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: error.message });
    }
});

router.get('/done/done', async (request, response) => {
    try {
        const orders = await Order.find({status: "Done"}).populate('account');
        return response.status(200).json({
            count: orders.length,
            data: orders
        });
    }
    catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: error.message });
    }
});

//get all orders by accountId

router.get('/:id/ref', async (request, response) => {
    try{
        const { id } = request.params;
        const orders = await Order.find({account: id}).populate('account').populate('products.product').sort({ createdAt: 'desc' });
        return response.status(200).json({
            count: orders.length,
            data: orders
        });
    }
    catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: error.message });
    }
})

// Post order
router.post('/', async (request, response) => {
    try {
        if (!request.body.account ||
            !request.body.products ||
            !request.body.receiverName ||
            !request.body.address ||
            !request.body.phoneNumber ||
            !request.body.totalMoney) {
            return response.status(400).send({
                message: 'please send all order required fields'
            });
        }

        const orderProducts = request.body.products;

        // Check if there's sufficient stock for each product
        for (const orderProduct of orderProducts) {
            const product = await Product.findById(orderProduct.product);

            if (!product || product.stock_quantity < orderProduct.quantity) {
                return response.status(400).send({
                    message: 'Insufficient stock for one or more products in the order.'
                });
            }
        }

        // Create the order
        const newOrder = {
            account: request.body.account,
            products: request.body.products,
            receiverName: request.body.receiverName,
            address: request.body.address,
            phoneNumber: request.body.phoneNumber,
            totalMoney: request.body.totalMoney,
        };

        const order = await Order.create(newOrder);

        // Update stock_quantity for each product in the order
        for (const orderProduct of orderProducts) {
            const product = await Product.findById(orderProduct.product);
            product.stock_quantity -= orderProduct.quantity;
            await product.save();
        }

        return response.status(201).send(order);
    } catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: error.message });
    }
});

// Put order
router.put('/:id', async (request, response) => {
    try {
        const orderId = request.params.id;

        if (!request.body.receiverName ||
            !request.body.address ||
            !request.body.phoneNumber ||
            !request.body.status) {
            return response.status(400).send({
                message: 'Please send all required order fields'
            });
        }

        const updatedOrder = {
            receiverName: request.body.receiverName,
            address: request.body.address,
            phoneNumber: request.body.phoneNumber,
            status: request.body.status
        };

        const order = await Order.findByIdAndUpdate(orderId, updatedOrder, { new: true });

        if (!order) {
            return response.status(404).send({
                message: 'Order not found'
            });
        }

        return response.status(200).send(order);
    } catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: error.message });
    }
});


//Delete order
router.delete('/:id', async (request, response) => {
    try{
        const { id } = request.params;
        const result = await Order.findByIdAndDelete(id);

        if (!result) return response.status(404).json({ message: "Order not found" });
        return response.status(200).send({ message: "Order deleted successfully" });
    }
    catch(error){
        console.log(error.message);
        return response.status(500).send({message: error.message});
    }
})



export default router;