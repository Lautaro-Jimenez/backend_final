import { Router } from 'express';
import { canAccess } from '../middleware/access.js'
import { passportCall } from '../utils/sessionUtils.js';
import CartController from '../controllers/cart.controller.js';

const router = Router();

router.post('/', CartController.createCart);

router.get('/:id', CartController.getCartById);

router.put('/:id', passportCall('current'), canAccess(['user', 'premium']), CartController.addProductToCart);

router.put('/:id/product/:pid', passportCall('current'),  canAccess(['user', 'premium']),CartController.addProductQuantityToCart);

router.delete('/:cid/product/:pid', CartController.deleteProductFromCart);

router.delete('/:id', CartController.deleteAllProductsFromCart);

router.get('/:id/purchase', passportCall('current'), CartController.completePurchase)

export default router;