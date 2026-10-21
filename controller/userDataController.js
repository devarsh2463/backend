
import userData from '../config/model/user.js';
import bcrypt from 'bcrypt';
import { generateToken } from "../utils/jwtUtils.js";
import cloudinary from "../config/cloudinary.js";
import sendEmail from "../utils/sendEmail.js";

export const addUser = async (req,res) => {
    try {
        const password = await bcrypt.hash(req.body.password,10)
        const userDataval = {
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            address:req.body.address,
            password:password
        }
        const saveUserData = await userData.create(userDataval)
        res.status(200).json({message:"user added successflly",data:saveUserData})
    }catch(error) {
        res.status(500).json({errorMessage:error.message})
    }
}

export const getUser = async (req, res) => {
    try {

        const allUsers = await userData.find();

        console.log("Users in MongoDB:", allUsers);

        res.status(200).json({
            message: "users fetched successfully",
            data: allUsers
        });

    } catch (error) {

        res.status(500).json({
            errorMessage: error.message
        });
    }
};

export const getSingleUser = async (req,res) => {
    try {
        const userId = req.params.uid
        const singleUser = await userData.findById(userId)
        if(!singleUser) {
            return res.status(404).json({errorMessage:"User not found"})
        }
        res.status(200).json({message:"user fetched successfully",data:singleUser})
    }catch(error) {
        res.status(500).json({errorMessage:error.message})
    }
}

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.uid
        const deletedUser = await userData.findByIdAndDelete(userId)
        if (!deletedUser) {
            return res.status(404).json({ errorMessage: "User not found" })
        }
        res.status(200).json({ message: "user deleted successfully", data: deletedUser })
    } catch (error) {
        res.status(500).json({ errorMessage: error.message })
    }
}

export const updateUser = async (req, res) => {
    try {
        const id = req.params.uid
        const userDataval = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address
        }
        const updatedUser = await userData.findByIdAndUpdate(id, userDataval, { new: true, runValidators: true })
        if (!updatedUser) {
            return res.status(404).json({ errorMessage: "User not found" })
        }
        res.status(200).json({ message: "User updated successfully", data: updatedUser })
    } catch (error) {
        res.status(500).json({ errorMessage: error.message })
    }
}

export const loginuser = async (req, res) => {
    try {

        const { email, password } = req.body;

        // =====================================
        // SUPER ADMIN LOGIN
        // =====================================

        if (
            email.toLowerCase() === "admin@system.com" &&
            password === "adminpassword123"
        ) {

            const superAdmin = {
                id: "superadmin",
                email: "admin@system.com",
                role: "superadmin"
            };

            const token = generateToken(superAdmin);

            return res.status(200).json({
                status: 1,
                message: "Super Admin login successful",
                token: token,
                data: superAdmin
            });
        }


        // =====================================
        // NORMAL USER LOGIN
        // =====================================

        const user = await userData.findOne({
            email: email.toLowerCase()
        });

        if (!user) {

            return res.status(404).json({
                message: "User Not Found",
                status: 0
            });
        }


        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );


        if (!passwordMatch) {

            return res.status(401).json({
                message: "Invalid Password",
                status: 0
            });
        }


        const token = generateToken({
            _id: user._id,
            email: user.email,
            role: "user"
        });


        const userResponse = user.toObject();

        delete userResponse.password;


        return res.status(200).json({
            message: "Login successful",
            status: 1,
            token: token,
            data: userResponse
        });


    } catch (error) {

        console.error("Login Error:", error);

        return res.status(500).json({
            message: "Server error",
            status: 0,
            errorMessage: error.message
        });
    }
};
export const getMyProfile = async (req, res) => {

    try {

        console.log("JWT USER:", req.user);


        // =====================================
        // SUPER ADMIN
        // =====================================

        if (req.user && req.user.role === "superadmin") {

            return res.status(200).json({

                status: 1,

                message: "Super Admin profile fetched successfully",

                data: {

                    id: "superadmin",

                    email: "admin@system.com",

                    role: "superadmin",

                    name: "Super Admin"

                }

            });
        }


        // =====================================
        // NORMAL USER
        // =====================================

        if (!req.user || !req.user.id) {

            return res.status(401).json({

                status: 0,

                message: "Invalid authentication token"

            });
        }


        const user = await userData
            .findById(req.user.id)
            .select("-password");


        if (!user) {

            return res.status(404).json({

                status: 0,

                message: "User not found"

            });
        }


        return res.status(200).json({

            status: 1,

            message: "Profile fetched successfully",

            data: {

                ...user.toObject(),

                role: "user"

            }

        });


    } catch (error) {

        console.error("GET PROFILE ERROR:", error);

        return res.status(500).json({

            status: 0,

            message: "Server error",

            errorMessage: error.message

        });

    }
};

// UPLOAD IMAGE
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select an image",
      });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "backend_images",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      stream.end(req.file.buffer);
    });

    return res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Image upload failed",
      errorMessage: error.message,
    });
  }
};


export const sendTestEmail = async (req, res) => {
  try {
    const { to } = req.body;

    if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      return res.status(400).json({
        message: "Valid recipient email is required",
      });
    }

    const result = await sendEmail({
      to,
      subject: "My First Brevo Email",
      htmlContent: `
        <h2>Hello!</h2>
        <p>This is my first email sent using Brevo and Node.js.</p>
        <p>My backend email integration is working.</p>
      `,
    });

    return res.status(200).json({
      message: "Email request accepted by Brevo",
      messageId: result.messageId,
    });
  } catch (error) {
    console.error("Email error:", error.message);

    return res.status(500).json({
      message: "Email sending failed",
      error: error.message,
    });
  }
};
