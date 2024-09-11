import express from 'express';
import { Cart } from '../models/cartModel.js';
import { Account } from '../models/accountModel.js';
import { Product } from '../models/productModel.js';

const router = express.Router();

//Get all cart
router.get('/', async (request, response) => {
    try {
        const carts = await Cart.find({});
        return response.status(200).json({
            count: carts.length,
            data: carts
        });
    }
    catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: error.message });
    }
});

//Create new cart
router.post('/', async (request, response) => {
    try {
        if (!request.body.account) {
            message: 'Send all required field: account'
        }
        const newCart = {
            account: request.body.account,
            products: []
        }
        const cart = await Cart.create(newCart)
        return response.status(201).send(cart);
    }
    catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: error.message });
    }
})

//get cart reference with account id
router.get('/:id/ref', async (request, response) => {
    try {
        const { id } = request.params;
        // Find the cart document and populate the 'account' field
        const cart = await Cart.findOne({ account: id }).populate('account').populate('products.product');
        return response.status(200).json(cart);
    }
    catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: error.message });
    }
})
//check if product exist in products in cart with account id
router.get('/:id/:idProduct', async (request, response) => {
    try {
        const { id, idProduct } = request.params;
        const productIdToCheck = idProduct;

        // Find the cart with the given account ID and check if the specified product exists in its products array
        const cart = await Cart.findOne({
            account: id,
            'products.product': productIdToCheck,
        });

        if (cart) {
            // Product exists in the cart's products array
            return response.status(200).json({ message: 'Product exists in the cart.', product: cart.products });
        } else {
            // Product does not exist in the cart's products array
            return response.status(200).json({ message: 'Product does not exist in the cart.' });
        }
    } catch (error) {
        console.error(error);  // Log the full error for debugging
        return response.status(500).send({ message: 'Internal Server Error' });
    }
});

//get cart with account id
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const cart = await Cart.findOne({ account: id });
        return response.status(200).json(cart);
    }
    catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: error.message });
    }
});

//delete cart with account id
router.delete('/:id', async (request, response) => {
    try {
        const { id: accountId } = request.params;

        const result = await Cart.findOneAndDelete({ account: accountId });

        if (!result) return response.status(404).json({ message: "cart not found" });
        return response.status(200).send({ message: "cart deleted successfully" });
    } catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: error.message });
    }
});

// Add product to cart by account ID
router.post('/add-product', async (request, response) => {
    try {
        const { accountId, productId, quantity } = request.body;

        if (!accountId || !productId || !quantity) {
            return response.status(400).json({ message: 'Send all required fields: accountId, productId, and quantity' });
        }

        const cart = await Cart.findOne({ account: accountId });
        if (!cart) {
            return response.status(404).json({ message: 'Cart not found for the given account ID' });
        }

        const productToAdd = await Product.findById(productId);

        // Check if there's already a product with the same productId in the cart
        const existingProduct = cart.products.find((p) => p.product.equals(productToAdd._id));

        if (existingProduct) {
            existingProduct.quantity += quantity;
        }
        else {
            const product = {
                product: productId,
                quantity: quantity,
            };
            cart.products.push(product);
            
        }
        await cart.save();
        return response.status(201).json("done");
    } catch (error) {
        console.log(error.message);
        return response.status(500).json({ message: error.message });
    }
});



// Route to remove a product from the cart
router.post('/remove-product', async (req, res) => {
    const { accountId, productId } = req.body;

    try {
        console.log('Remove from cart request:', req.body);

        const updatedCart = await Cart.findOneAndUpdate(
            { account: accountId },
            { $pull: { products: { _id: productId } } },
            { new: true }
        );

        console.log('Updated Cart:', updatedCart);

        if (!updatedCart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        return res.status(200).json(updatedCart.products);
    } catch (error) {
        console.error('Error removing product from cart:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


export default router;