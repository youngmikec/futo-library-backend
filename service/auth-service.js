import bcrypt from "bcrypt";

import User, { validateRegister } from "../models/User.js";


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
        const hashedPass = await bcrypt.hash(data.password, salt);
    
        /* Create a new user */
        const newuser = await new User({
            userType: data.userType,
            userFullName: data.userFullName,
            regNumber: data.admissionId,
            employeeId: data.employeeId,
            age: data.age,
            dob: data.dob,
            gender: data.gender,
            address: data.address,
            mobileNumber: data.mobileNumber,
            email: data.email,
            password: hashedPass,
            isAdmin: data.isAdmin,
        });
    
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