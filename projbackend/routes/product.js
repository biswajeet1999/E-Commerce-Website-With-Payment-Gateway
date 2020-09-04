const router = require('express').Router();
const { check } = require('express-validator');

const { getUserById } = require('../controllers/user');
const { isSignedIn, isAdmin, isAuthenticated } = require('../controllers/auth');
const { getProductById, 
        getProduct, 
        createProduct, 
        photo, 
        deleteProduct, 
        updateProduct, 
        getAllProducts, 
        getAllUniqueCategories } = require('../controllers/product');

        
router.param('productId', getProductById);
router.param('userId', getUserById);

router.post('/product/create/:userId', isSignedIn, isAuthenticated, isAdmin, [
    check('name').trim().isEmpty().withMessage('name required'),
    check('description').trim().isEmpty().withMessage('description required'),
    check('price').isEmpty().withMessage('price required'),
    check('category').trim().isEmpty().withMessage('category required'),
    check('stock').isEmpty().withMessage('stock required')
], createProduct);

router.get('/product/:productId', getProduct);
router.get('/product/photo/:productId', photo);
router.delete('/product/:productId/:userId', isSignedIn,isAuthenticated, isAdmin, deleteProduct);
router.put('/product/:productId/:userId', isSignedIn, isAuthenticated, isAdmin, updateProduct);
router.get('/products', getAllProducts);
router.get('/products/categories', getAllUniqueCategories);

module.exports = router;