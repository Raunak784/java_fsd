import User from '../models/userModel.js';
import { validationResult, check } from 'express-validator';
import bcrypt from 'bcrypt';

// Register User
const registerUser = async (req, res) => {
    const { name, email, password, contactNumber,role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User already registered" });
        }

        user = new User({
            name,
            email,
            password,
            contactNumber,
            role: role || 'user'
        });

        // Save user to the database
        const savedUser = await user.save();
        res.status(201).json({ msg: "User registered successfully", userId: savedUser._id });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server error" });
    }
};


// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }

        const isMatch = await user.comparePassword(password); 

        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid password" });
        }

        const token = user.generateToken(); 
        res.json({
            msg: "User logged in successfully",
            token,
            userId: user._id,
            role: user.role
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server error" });
    }
};



const userlist = async (req, res) => {
    try {
        const users = await User.find();
        if (!users) {
            return res.status(404).json({ error: 'Users not found' });
        }
        res.json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server error" });
    }
}

// userProfile
const userProfile = async (req, res) => {
    try {
        // Here we use (req.user.id) that means which token have in header login through that id (we can also take id from params then need to change also routes )
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log(req._id, user)
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server error" });
    }
}

// Update user details
const userUpdate = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: 'Error updating user', error });
    }
};

// Delete user
const userDelete = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

export {
    registerUser,
    loginUser,
    userlist,
    userProfile,
    userUpdate,
    userDelete
} 