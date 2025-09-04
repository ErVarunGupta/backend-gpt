import express from "express";
import User from "../models/AuthModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(400).json({
        message: "user already exist!",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    // console.log(user);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    return res.status(200).json({
      message: "User registered successfully!",
      success: true,
      User: user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error during signup: ",
      error: error,
      success: false,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found!",
        success: false,
      });
    }

    const decriptPassword = await bcrypt.compare(password, user.password);
    if (!decriptPassword) {
      return res.status(400).json({
        message: "Invalid credential!",
        success: false,
      });
    }

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).json({
      message: "User login successfull!",
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error during login",
      error: error.message,
      success: false,
    });
  }
});

router.get("/users/all", async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(400).json({
        message: "You are not authorize!",
        success: false,
      });
    }

    const users = await User.find();
    if (!users) {
      return res.status(404).json({
        message: "User not found!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Users fetched successfully!",
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error during fetching all users",
      error: error.message,
      success: false,
    });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const {userId} = req.params;
    if (!userId) {
      res.status(400).json({
        message: "invalid credential",
        success: false,
      });
    }

    const user = await User.findById(userId);
    console.log(user);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "User fetched successfully!",
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error during fetching user data",
      error: error.message,
      success: false,
    });
  }
});

router.put("/:userId", async (req, res) => {
  try {
    const {userId} = req.params;
    if (!userId) {
      res.status(400).json({
        message: "invalid credential",
        success: false,
      });
    }

    let user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        message: "User not found",
        success: false,
      });
    }


    const { username, email, password } = req.body;
    if (username && user.username !== username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          message: "Username already exist",
          success: false,
        });
      }
      user.username = username;
    }
    if (email && user.email !== email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          message: "Email already exist",
          success: false,
        });
      }
      user.email = email;
    }
    if (password && !password.trime().isEmpty()) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();
    res.status(200).json({
      message: "User updated successfully!",
      success: true,
      updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error during updating user",
      error: error.message,
      success: false,
    });
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    const {userId} = req.params;
    if (!userId) {
      res.status(400).json({
        message: "invalid credential",
        success: false,
      });
    }

    const deletedUser = await User.findByIdAndDelete( userId );
    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found!",
        success: false,
      });
    }

    res.status(200).json({
      message: "User deleted successfully!",
      success: true,
      deletedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error during deleting user",
      error: error.message,
      success: false,
    });
  }
});

export default router;
