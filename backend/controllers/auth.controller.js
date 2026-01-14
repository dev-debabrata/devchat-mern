import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { ENV } from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js";


// Signup Authentication
export const signup = async (req, res) => {
    try {
        let { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        email = email.toLowerCase().trim();

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters",
            });
        }

        // Gmail-only validation
        if (!email.endsWith("@gmail.com")) {
            return res.status(400).json({
                message: "Only Gmail addresses are allowed",
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
        });

        // set auth cookie
        generateToken(newUser._id, res);

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });

        // send welcome email (non-blocking)
        sendWelcomeEmail(
            newUser.email,
            newUser.fullName,
            ENV.CLIENT_URL
        ).catch(err =>
            console.error("Failed to send welcome email:", err.message)
        );

    } catch (error) {
        console.error("Error in signup controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Login Authentication
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid username" });
        // never tell the client which one is incorrect: password or email

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid password" });

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.error("Error in login controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



// Logout Authentication
export const logout = (_, res) => {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
};



// Profile Update
export const updateProfile = async (req, res) => {
    try {
        const { profilePic, fullName, about } = req.body;
        const userId = req.user._id;

        const updateData = {};

        // Update name
        if (fullName) updateData.fullName = fullName;

        // Update about
        if (about) updateData.about = about;


        //  DELETE image
        if (profilePic === null) {
            updateData.profilePic = null;
        }

        // Update profile picture if provided
        if (profilePic) {
            const uploadResponse = await cloudinary.uploader.upload(profilePic, {
                folder: "chat-app/profiles",
            });
            updateData.profilePic = uploadResponse.secure_url;
        }

        // If nothing to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "Nothing to update" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select("-password");

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error in update profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};




// export const signup = async (req, res) => {
//     const { fullName, email, password } = req.body;

//     try {
//         if (!fullName || !email || !password) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         if (password.length < 6) {
//             return res.status(400).json({ message: "Password must be at least 6 characters" });
//         }

//         // check if emailis valid: regex
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) {
//             return res.status(400).json({ message: "Invalid email format" });
//         }

//         const user = await User.findOne({ email });
//         if (user) return res.status(400).json({ message: "Email already exists" });

//         // 123456 => $dnjasdkasj_?dmsakmk
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         const newUser = new User({
//             fullName,
//             email,
//             password: hashedPassword,
//         });

//         if (newUser) {
//             // before CR:
//             // generateToken(newUser._id, res);
//             // await newUser.save();

//             // after CR:
//             // Persist user first, then issue auth cookie
//             const savedUser = await newUser.save();
//             generateToken(savedUser._id, res);

//             res.status(201).json({
//                 _id: newUser._id,
//                 fullName: newUser.fullName,
//                 email: newUser.email,
//                 profilePic: newUser.profilePic,
//             });

//             try {
//                 await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL);
//             } catch (error) {
//                 console.error("Failed to send welcome email:", error);
//             }
//         } else {
//             res.status(400).json({ message: "Invalid user data" });
//         }
//     } catch (error) {
//         console.log("Error in signup controller:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };



// export const updateProfile = async (req, res) => {
//     try {
//         const { profilePic } = req.body;
//         if (!profilePic) return res.status(400).json({ message: "Profile pic is required" });

//         const userId = req.user._id;

//         const uploadResponse = await cloudinary.uploader.upload(profilePic);

//         const updatedUser = await User.findByIdAndUpdate(
//             userId,
//             { profilePic: uploadResponse.secure_url },
//             { new: true }
//         );

//         res.status(200).json(updatedUser);
//     } catch (error) {
//         console.log("Error in update profile:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };


