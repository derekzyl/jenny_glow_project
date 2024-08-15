import { shippingService } from "../../../admin/shipping";
import { branchService } from "../../../branch";
import { BranchTypeE } from "../../../branch/interface_branch/interface.branch";
import { ApiError } from "../../../errors";
import { productService } from "../../../product";
import { addressService } from "../../../user/address/main_address";
import { CrudService } from "expressbolt";
import { CART, CART_ITEM } from "./model.cart";
export async function createCart(userId) {
    const cart = await CrudService.create({
        modelData: {
            Model: CART,
            select: [],
        },
        data: {
            userId,
            totalPrice: 0,
            vat: 0,
            subTotal: 0,
            totalShippingFee: 0,
            cartItemsId: []
        },
        check: {},
    });
    return cart;
}
export const getUserCart = async (userId) => {
    const cart = await CrudService.getOne({
        modelData: {
            Model: CART,
            select: [],
        },
        data: { userId },
        populate: {},
    });
    return cart;
};
export async function clearCart(userId) {
    const getUserCrt = await getUserCart(userId);
    if (!getUserCrt['success'] || !getUserCrt['data']) {
        const cart = await createCart(userId);
        return cart;
    }
    if (getUserCrt['data']['cartItemsId'].length > 0) {
        for (const item of getUserCrt['data']['cartItemsId']) {
            await CrudService.delete({
                modelData: {
                    Model: CART_ITEM,
                    select: [],
                },
                data: { id: item },
            });
        }
    }
    const cart = await CrudService.update({
        modelData: {
            Model: CART,
            select: [],
        },
        filter: { userId },
        data: {
            totalPrice: 0,
            vat: 0,
            subTotal: 0,
            totalShippingFee: 0,
            cartItemsId: []
        },
    });
    return cart;
}
export async function addToCart(userId, cartItem) {
    const cart = await CrudService.update({
        modelData: {
            Model: CART,
            select: [],
        },
        filter: { userId },
        data: {
            $push: { cartItemsId: cartItem }
        },
    });
    return cart;
}
export async function addToCartItem(data) {
    let price = 0;
    let shippingFee = 0;
    const getCart = await CART.findById(data.cartId);
    if (!getCart) {
        throw new ApiError(404, 'cart not found');
    }
    let getCartIt = await CART_ITEM.findOne({ productId: data.productId, cartId: data.cartId });
    const getBranch = await branchService.getOneBranch({ branchType: BranchTypeE.ONLINE });
    const defaultAddress = await addressService.getUserDefaultAddress(getCart.userId);
    if (defaultAddress) {
        const shippingF = await shippingService.getShippingFeeFromAddressId(defaultAddress.id);
        shippingFee = shippingF;
    }
    if (!getBranch['data']) {
        throw new ApiError(404, 'branch not found');
    }
    if (data.variantId) {
        const getVariant = await productService.getOneProductVariant(data.variantId);
        if (!getVariant['data']) {
            throw new ApiError(404, 'product not found');
        }
        price = getVariant['data'].price;
    }
    else {
        const getProduct = await productService.getOneProduct(data.productId);
        if (!getProduct['data'] || !getProduct['data'].product) {
            throw new ApiError(404, 'product not found');
        }
        price = getProduct['data'].product.price;
    }
    if (getCartIt) {
        getCartIt.totalPrice += price;
        getCartIt.totalCount += 1;
        getCartIt.shippingFee += shippingFee;
        await getCartIt.save();
    }
    else {
        getCartIt = await CART_ITEM.create({
            totalPrice: price,
            totalCount: 1,
            shippingFee,
            productId: data.productId,
            cartId: data.cartId,
        });
    }
    getCart.totalPrice += (getCartIt.totalPrice + getCartIt.shippingFee + getCart.vat);
    getCart.subTotal += getCartIt.totalPrice;
    getCart.totalShippingFee += shippingFee;
    const cartIt = new Set([...getCart.cartItemsId, getCartIt.id]);
    getCart.cartItemsId = Array.from(cartIt);
    return getCart;
}
export async function removeFromCartItem(data) {
    let price = 0;
    let shippingFee = 0;
    const getCart = await CART.findById(data.cartId);
    if (!getCart) {
        throw new ApiError(404, 'cart not found');
    }
    let getCartIt = await CART_ITEM.findOne({ productId: data.productId, cartId: data.cartId });
    const getBranch = await branchService.getOneBranch({ branchType: BranchTypeE.ONLINE });
    const defaultAddress = await addressService.getUserDefaultAddress(getCart.userId);
    if (defaultAddress) {
        const shippingF = await shippingService.getShippingFeeFromAddressId(defaultAddress.id);
        shippingFee = shippingF;
    }
    if (!getBranch['data']) {
        throw new ApiError(404, 'branch not found');
    }
    if (data.variantId) {
        const getVariant = await productService.getOneProductVariant(data.variantId);
        if (!getVariant['data']) {
            throw new ApiError(404, 'product not found');
        }
        price = getVariant['data'].price;
    }
    else {
        const getProduct = await productService.getOneProduct(data.productId);
        if (!getProduct['data'] || !getProduct['data'].product) {
            throw new ApiError(404, 'product not found');
        }
        price = getProduct['data'].product.price;
    }
    if (getCartIt) {
        if (getCartIt.totalCount > 1) {
            getCartIt.totalPrice -= price;
            getCartIt.totalCount -= 1;
            getCartIt.shippingFee -= shippingFee;
            await getCartIt.save();
        }
        else {
            await CART_ITEM.deleteOne(getCartIt.id);
        }
    }
    else {
        getCartIt = await CART_ITEM.create({
            totalPrice: price,
            totalCount: 1,
            shippingFee,
            productId: data.productId,
            cartId: data.cartId,
        });
    }
    getCart.totalPrice -= (getCartIt.totalPrice + getCartIt.shippingFee + getCart.vat);
    getCart.subTotal -= getCartIt.totalPrice;
    getCart.totalShippingFee -= shippingFee;
    let cartIt = getCart.cartItemsId;
    const getCartItemsA = await CART_ITEM.find({ cartId: getCart.id });
    cartIt = getCartItemsA.map((data) => data.id);
    getCart.cartItemsId = cartIt;
    return getCart;
}
export async function getCartItemById(cartItemId) {
    const cartItem = await CrudService.getOne({
        modelData: {
            Model: CART_ITEM,
            select: [],
        },
        data: { id: cartItemId },
        populate: {},
    });
    return cartItem;
}
export async function getCartItem(filter) {
    const cartItem = await CrudService.getOne({
        modelData: {
            Model: CART_ITEM,
            select: [],
        },
        data: filter,
        populate: {},
    });
    return cartItem;
}
export async function updateCartItem(cartItemId, data) {
    const cartItem = await CrudService.update({
        modelData: {
            Model: CART_ITEM,
            select: [],
        },
        filter: { id: cartItemId },
        data,
    });
    return cartItem;
}
export async function getCartItemsByCartId(cartId, query = {}) {
    const cartItems = await CrudService.getMany({
        filter: { cartId }, modelData: {
            Model: CART_ITEM,
            select: [],
        }, populate: {}, query
    });
    return cartItems;
}
export async function deleteCartItem(cartItemId) {
    const cartItem = await CrudService.delete({
        modelData: {
            Model: CART_ITEM,
            select: [],
        },
        data: { id: cartItemId },
    });
    return cartItem;
}
export async function updateCart(cartId, data) {
    const cart = await CrudService.update({
        modelData: {
            Model: CART,
            select: [],
        },
        filter: { id: cartId },
        data,
    });
    return cart;
}
export async function updateCartItemsByAddressChange(cartId, addressId) {
    let shippingFee = 0;
    const getCart = await CART.findById(cartId);
    if (!getCart) {
        throw new ApiError(404, 'cart not found');
    }
    const getCartItems = await CART_ITEM.find({ cartId });
    const getBranch = await branchService.getOneBranch({ branchType: BranchTypeE.ONLINE });
    const defaultAddress = await addressService.getOneAddressById(addressId);
    if (defaultAddress) {
        const shippingF = await shippingService.getShippingFeeFromAddressId(defaultAddress.id);
        shippingFee = shippingF;
    }
    if (!getBranch['data']) {
        throw new ApiError(404, 'branch not found');
    }
    const ge = getCartItems.map(async (dt) => {
        dt.shippingFee = shippingFee * dt.totalCount;
        shippingFee += (shippingFee * dt.totalCount);
        await dt.save();
    });
    await Promise.all(ge);
    getCart.totalPrice = getCart.subTotal + shippingFee + getCart.vat;
    getCart.totalShippingFee = shippingFee;
    return getCart;
}
//# sourceMappingURL=service.cart.js.map