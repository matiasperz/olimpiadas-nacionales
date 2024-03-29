const router = require('express').Router();
const passport = require('passport');

const { createUserSchema, updateUserSchema } = require('../../utils/schemas/user');
const { mongoIdSchema } = require('../../utils/schemas/general');
const validationHandler = require('../../utils/middlewares/validationHandler');

const UserService = require('../../services/user');
const ActivityService = require('../../services/activity');

//Services
const userService = new UserService();
const activityService = new ActivityService();

//Stragegies
require('../../utils/strategies/jwt');

//To get user data

//Get all users of a sertain productor
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    const { productorId } = req.user;

    try {
        const users = await userService.getUsersByProductor({ productorId });

        res.status(200).json({
            data: users,
            message: 'Users retrived succesfuly'
        });
    } catch (err) {
        next(err);
    }
});

router.get('/me', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    const { _id } = req.user;

    try {
        const user = await userService.getUser({ userId: _id });

        res.status(200).json({
            data: user,
            message: 'Data retrived succesfuly'
        });
    } catch (err) {
        next(err);
    }
});

router.get('/:userId', async (req, res, next) => {
    const { userId } = req.params;

    try {
        const user = await userService.getUser({ userId });

        res.status(200).json({
            data: user,
            message: 'User retrived succesfuly'
        });
    } catch (err) {
        next(err);
    }
});

//To get user activity
router.get('/:userId/activity', async (req, res, next) => {
    const { userId } = req.params;

    try {
        const activity = await activityService.getActivityByUser({ userId });

        res.status(200).json({
            data: activity,
            message: 'User activity retrived succesfuly'
        });
    } catch (err) {
        next(err);
    }
});

//To create a new user
router.post('/', passport.authenticate('jwt', { session: false }), validationHandler(createUserSchema), async (req, res, next) => {
    const { body: user } = req;
    const { productorId } = req.user;

    try{
        const createdUserId = await userService.createUser({ user: {...user, productorId} });
        
        res.status(201).json({
            data: createdUserId,
            message: 'User created succesfuly'
        })
    } catch(err){
        next(err);
    }
});

//To edit an existent user
router.put('/:userId', passport.authenticate('jwt', { session: false }), validationHandler({ userId: mongoIdSchema }, 'params'), validationHandler(updateUserSchema), async (req, res, next) => {
    const { userId } = req.params;
    const { body: user } = req;

    try{
        const updatedUserId = await userService.updateUser({ userId, user });
        
        res.status(200).json({
            data: updatedUserId,
            message: 'User updated succesfuly'
        })
    } catch(err){
        next(err);
    }
});

//To delete an existent user
router.delete('/:userId', passport.authenticate('jwt', { session: false }), validationHandler({ userId: mongoIdSchema }, 'params'), async (req, res, next) => {
    const { userId } = req.params;

    try{
        const deletedUserId = await userService.deleteUser({ userId });
        
        res.status(200).json({
            data: deletedUserId,
            message: 'User deleted succesfuly'
        })
    } catch(err){
        next(err);
    }
});

module.exports = router;