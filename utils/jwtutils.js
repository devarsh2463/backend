import jwt from "jsonwebtoken";
import secretKey from "../config/jwtConfig.js";


export const generateToken = (user) => {

    const userId = user._id
        ? user._id.toString()
        : user.id;


    const token = jwt.sign(

        {
            id: userId,

            email: user.email,

            role: user.role || "user"
        },

        secretKey,

        {
            expiresIn: "1h"
        }

    );


    return token;
};