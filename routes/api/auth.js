const router = require('express').Router();
const passport = require('passport');
const boom = require('boom');
const jwt = require('jsonwebtoken');

const { adminConfig, srvConfig } = require('../../config');
const { signUpSchema } = require('../../utils/schemas/auth'); //Our schema for test our incoming signUp data
const validationHandler = require('../../utils/middlewares/validationHandler'); //Our validation handler to test the received data
const UserService = require('../../services/user'); //Our user service
const ProductorService = require('../../services/productor'); //Our productor service

const userService = new UserService();
const productorService = new ProductorService();

//Basic strategy
require('../../utils/strategies/basic'); //The basic method is retrived and executed, adding the necesary data for passport to work with

//Sing-in endpoint
router.post('/sign-in', (req, res, next) => {
    passport.authenticate('basic', (err, user) => { //Executing the basic auth, the Callback is called after the user is retrived and only if a user was found with 0 errors
        if(err || !user){
            return next(boom.unauthorized()); //If there is no user, triggers an unauthorized error
        }
        
        req.logIn(user, { session: false }, (error) => { //Inicia sesion con el usuario dado, si hay error lo reporta sin el boom
            if (error) {
                return next(error); //If an error occurs the express error handler is called
            }
            
            const payload = { email: user.email, role: user.role }; // Si no hay error el payload se crea con el user recien creado recibido en el callback
            const token = jwt.sign(payload, adminConfig.authJwtSecret, { //Signing the JWT with the payload
                expiresIn: srvConfig.dev ? '59m' : '15m' //This means that this token expires in 15 minutes
            });
            
            res.cookie('token', token, { //A cookie with the token for the client gets created
                httpOnly: !srvConfig.dev,
                sameSite: !srvConfig.dev
            })

            return res.status(200).json({ token, user }); //We answer the client with a succesfull status, with the token, and his user data
        });
    })(req, res, next); //Because of we've created a callback after authentication, we need to pass this arguments to the passport clousure
});

//Sign-up endpoint
router.post('/sign-up', validationHandler(signUpSchema), async (req, res, next) => {
    const { user, productor } = req.body; //We extract the user and productor objects with their respective data

    try {
        const createdProductorId = await productorService.createProductor({ productor }); //We create the productor
        const createUserId = await userService.createUser({ user: { ...user, productorId: createdProductorId } }); //We create the productor's user adding the received productorId
        
        res.status(201).json({ //We answer the client with the created userId, productorId, and a succesfull status as well
            data: {
                createUserId,
                createdProductorId
            },
            message: 'User created succesfully'
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;