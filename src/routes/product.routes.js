import { Router } from 'express';
import { canAccess } from '../middleware/access.js'
import { passportCall } from '../utils/sessionUtils.js';
import ProductController from '../controllers/products.controller.js';
import { uploadProductImage } from '../middleware/multerUpload.js';


const router = Router();

router.get('/', ProductController.getAllProducts); 

router.get('/:id', ProductController.getProductByID);

router.post('/', passportCall('current'), canAccess(['admin', 'premium']), uploadProductImage.array('thumbnail'), ProductController.addProduct);

router.put('/:id', passportCall('current'), canAccess(['admin', 'premium']), ProductController.editProduct);

router.delete('/:id', passportCall('current'), canAccess(['admin', 'premium']), ProductController.deleteProduct);

export default router;