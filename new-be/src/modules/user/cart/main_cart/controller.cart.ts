import { catchAsync } from '@modules/utils';
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { cartService } from '..';
// Assuming you have a service file with these functions

export const createCart = catchAsync(async (req: Request, res: Response) => {
  const { user } = req;
  const cart = await cartService.createCart(user.id);
  res.status(201).json(cart);
});

export const getUserCart = catchAsync(async (req: Request, res: Response) => {
  const { user } = req;
  const cart = await cartService.getUserCart(user.id);
  res.json(cart);
});

export const clearCart = catchAsync(async (req: Request, res: Response) => {
  const { user } = req;
  const cart = await cartService.clearCart(user.id);
  res.json(cart);
});

export const addToCart = catchAsync(async (req: Request, res: Response) => {
  const { user } = req;
  const cartItem = {
    productId: new Types.ObjectId(req.body.productId),
    totalCount: req.body.totalCount,
  };
  const cart = await cartService.addToCart(user.id, cartItem);
  res.status(201).json(cart);
});

export const addToCartItem = catchAsync(async (req: Request, res: Response) => {
  const cartItem = {
    productId: new Types.ObjectId(req.body.productId),
    cartId: new Types.ObjectId(req.body.cartId),
    variantId: req.body.variantId ? new Types.ObjectId(req.body.variantId) : undefined,
  };
  const cart = await cartService.addToCartItem(cartItem);
  res.status(201).json(cart);
});

export const removeFromCartItem = catchAsync(async (req: Request, res: Response) => {
  const cartItem = {
    productId: new Types.ObjectId(req.body.productId),
    cartId: new Types.ObjectId(req.body.cartId),
    variantId: req.body.variantId ? new Types.ObjectId(req.body.variantId) : undefined,
  };
  const cart = await cartService.removeFromCartItem(cartItem);
  res.json(cart);
});

export const getCartItemById = catchAsync(async (req: Request, res: Response) => {
  const cartItemId = new Types.ObjectId(req.params['id']);
  const cartItem = await cartService.getCartItemById(cartItemId);
  res.json(cartItem);
});

export const getCartItemsByCartId = catchAsync(async (req: Request, res: Response) => {
  const cartId = new Types.ObjectId(req.params['cartId']);
  const cartItems = await cartService.getCartItemsByCartId(cartId, req.query);
  res.json(cartItems);
});

export const updateCartItem = catchAsync(async (req: Request, res: Response) => {
  const cartItemId = new Types.ObjectId(req.params['id']);
  const data = {
    shippingFee: req.body.shippingFee,
    totalPrice: req.body.totalPrice,
    totalCount: req.body.totalCount,
  };
  const cartItem = await cartService.updateCartItem(cartItemId, data);
  res.json(cartItem);
});

export const deleteCartItem = catchAsync(async (req: Request, res: Response) => {
  const cartItemId = new Types.ObjectId(req.params['id']);
  const cartItem = await cartService.deleteCartItem(cartItemId);
  res.json(cartItem);
});

export const updateCart = catchAsync(async (req: Request, res: Response) => {
  const cartId = new Types.ObjectId(req.params['id']);
  const data = {
    totalPrice: req.body.totalPrice,
    vat: req.body.vat,
    subTotal: req.body.subTotal,
    totalShippingFee: req.body.totalShippingFee,
  };
  const cart = await cartService.updateCart(cartId, data);
  res.json(cart);
});

export const updateCartItemsByAddressChange = catchAsync(async (req: Request, res: Response) => {
  const cartId = new Types.ObjectId(req.params['id']);
  const addressId = new Types.ObjectId(req.body.addressId);
  const cart = await cartService.updateCartItemsByAddressChange(cartId, addressId);
  res.json(cart);
});
