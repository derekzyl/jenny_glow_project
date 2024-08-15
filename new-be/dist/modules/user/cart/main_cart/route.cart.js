import { auth } from '../../../auth';
import { validate } from '../../../validate';
import express from 'express';
import { cartController } from '..';
import { cartValidations } from './validation.cart';
const router = express.Router();
// Create Cart
router.post('/', auth(), validate(cartValidations.createCart), cartController.createCart);
// Get User Cart
router.get('/user/:userId', auth(), validate(cartValidations.getUserCart), cartController.getUserCart);
// Clear Cart
router.delete('/clear', auth(), validate(cartValidations.clearCart), cartController.clearCart);
// Add Item to Cart
router.post('/add-item', auth(), validate(cartValidations.addToCartItem), cartController.addToCartItem);
// Remove Item from Cart
router.delete('/remove-item', auth(), validate(cartValidations.removeFromCartItem), cartController.removeFromCartItem);
// Get Cart Item by ID
router.get('/item/:id', auth(), validate(cartValidations.getCartItemById), cartController.getCartItemById);
// Update Cart Item by ID
router.patch('/item/:id', auth(), validate(cartValidations.updateCartItem), cartController.updateCartItem);
// Get Cart Items by Cart ID
router.get('/:cartId/items', auth(), validate(cartValidations.getCartItemsByCartId), cartController.getCartItemsByCartId);
// Update Cart by Address Change
router.patch('/:cartId/address/:addressId', auth(), validate(cartValidations.updateCartItemsByAddressChange), cartController.updateCartItemsByAddressChange);
// Delete Cart Item by ID
router.delete('/item/:id', auth(), validate(cartValidations.deleteCartItem), cartController.deleteCartItem);
// Update Cart
router.patch('/:cartId', auth(), validate(cartValidations.updateCart), cartController.updateCart);
export default router;
//# sourceMappingURL=route.cart.js.map