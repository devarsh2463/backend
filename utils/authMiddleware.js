import jwt from "jsonwebtoken";
import secretKey from "../Config/jwtConfig.js";


const authMiddleware = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;


        if (!authHeader) {

            return res.status(401).json({

                status: 0,

                message: "Authorization token required"

            });
        }


        if (!authHeader.startsWith("Bearer ")) {

            return res.status(401).json({

                status: 0,

                message: "Invalid authorization format"

            });
        }


        const token = authHeader.split(" ")[1];


        if (!token) {

            return res.status(401).json({

                status: 0,

                message: "Token missing"

            });
        }


        const decoded = jwt.verify(
            token,
            secretKey
        );


        console.log("DECODED JWT:", decoded);


        req.user = decoded;


        next();


    } catch (error) {

        console.error("JWT ERROR:", error.message);


        return res.status(401).json({

            status: 0,

            message: "Invalid or expired token"

        });
    }
};


export default authMiddleware;