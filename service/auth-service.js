import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT, USER_TYPE } from "../constant/index.js";
import User, { validateRegister, validateLogin } from "../models/User.js";


export const registerService = async (data) => {
    try {
        const session = await User.startSession();
        session.startTransaction({
            readConcern: { level: "snapshot"},
            writeConcern: { w : 1},
        });

        const { error } = validateRegister.validate(data);
        if(error){
            throw new Error(`Invalid Request ${error.message}`);
        }

        // check for duplicate email and phonenumber before registeration.
        const {email, phoneNumber} = data;
        const duplicatePhone = await User.findOne({ phoneNumber }).exec();
        if (duplicatePhone) {
            throw new Error(`Error! Record already exist for phone ${phoneNumber}`);
        }
        const duplicateEmail = await User.findOne({ email }).exec();
        if (duplicateEmail) {
            throw new Error(`Error! Record already exist for email ${email}`);
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hashSync(data.password, salt);
        data.password = hashedPass;
    
        /* Create a new user */
        const newuser = await new User(data);
    
        /* Save User and Return */
        const response  = await newuser.save();
        if(!response){
            throw new Error(`Error! User not registered`)
        }
        return response;
    }catch(err){
        throw new Error(`Error creating User record. ${err.message}`);
    }
}

export const loginService = async (data) => {
    try{
        const { error } = validateLogin.validate(data);
        if(error) throw new Error(`Invalid Request ${ error.message }`);

        const {email, password} = data;

        const user = await User.findOne({ email: email }).exec();
        if(!user){
            throw new Error(`Invalid email or password`);
        }
        
        // if (!bcrypt.compareSync(password, `${user.password}`)) {
        //     throw new Error("Wrong password.");
        // }
        if (
            password !== user.password &&
            !bcrypt.compareSync(password, `${user.password}`)
          ) {
            throw new Error("Wrong password.");
          }

        const payload = { id: `${user._id}`, time: new Date(), userType: user.userType };
        const token = jwt.sign(payload, JWT.jwtSecret, {
            expiresIn: JWT.tokenExpireTime,
        });

        if(!token) throw new Error(`Error occurred generating token`);

        return { user, token };
    }catch(err){
        throw new Error(`Error Login. ${err.message}`);
    }
}