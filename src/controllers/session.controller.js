import UserValidator from "../validators/user.validator.js";
import PasswordRecoveryValidator from "../validators/pwdRecovery.validator.js";
import { admin } from '../utils/sessionUtils.js';
import { MongoErrorHandler } from "../utils/customErrors/mongoErrors.js";
import jwt from 'jsonwebtoken';

class SessionController{
    async login(req, res){
        try{
            const { email, password } = req.body;
            let user = {};
            
            if(email == admin.user && password == admin.password){
                user = {...admin}
                user.email = admin.user
            }else{
                user = await UserValidator.userLogin(email, password);  
            }          

            console.log(`${new Date()}: User ${user.email} has logged in`)

            const token = jwt.sign({email, first_name: user.first_name, last_name: user.last_name, role: user.role, user_id: user.id, cart: user.cart}, 'pageSecret', { expiresIn: '30m' });
            res.cookie('secretToken', token, {maxAge: 900000, httpOnly: true})
            res.status(200).json({status: 'SUCCESSFUL'})
        }catch(err){
            let error = MongoErrorHandler(err) || err;

            if(!err.status){
                console.log(err)
                return res.status(500).json({ error: 'UNHANDLED ERROR', message: err.message})
            }

            res.status(error.status).json({ error: error.name, message: error.message });
        }
    } 

    async register(req, res){
        try{
            const user = await UserValidator.registerUser(req.body);

            res.status(201).json({status: 'SUCCESS', user: user})
        }catch(err){
            let error = MongoErrorHandler(err) || err;

            if(!err.status){
                console.log(err)
                return res.status(500).json({ error: 'UNHANDLED ERROR', message: err.message})
            }

            res.status(error.status).json({ error: error.name, message: error.message });
        }
    }

    async handleLogout(req, res){
        if(req.user.role != 'admin'){
            const user = await UserValidator.logout(req.user);
        }
        
        res.clearCookie('secretToken');
        res.redirect('/login');
    }

    async passwordRecoveryRequest(req, res){
        try{
            const request = await PasswordRecoveryValidator.generateLink(req);
            return res.status(201).redirect('/emailSent')
        }catch(err){
            let error = MongoErrorHandler(err) || err;

            if(!err.status){
                return res.status(500).json({ error: 'UNHANDLED ERROR', message: err.message})
            }

            res.status(error.status).json({ error: error.name, message: error.message });
        }
    }

    async validateNewPassword(req, res){
        try{
            const request = await PasswordRecoveryValidator.validatePassword(req.body);
            return res.status(201).redirect('/newPasswordSuccess')
        }catch(err){
            let error = MongoErrorHandler(err) || err;

            if(!err.status){
                return res.status(500).json({ error: 'UNHANDLED ERROR', message: err.message})
            }

            res.status(error.status).json({ error: error.name, message: error.message });
        }
    }
}

export default new SessionController();