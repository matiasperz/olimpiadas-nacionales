const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const boom = require('boom');

const UserService = require('../../services/user')
const { adminConfig } = require('../../config');

passport.use(
    new Strategy({
        secretOrKey: adminConfig.authJwtSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    
    async (tokenPayload, done) => {
        const userService = new UserService();

        try{
            const [user] = await userService.getUsers('users', { email: tokenPayload.email });
            
            if(!user){
                return done(boom.unauthorized(), false);
            }

            return done(false, user);
        }catch(err){
            return done(err);
        }
    })
);