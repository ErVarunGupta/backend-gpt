import express from "express";
import Thread from "../models/ThreadModel.js";
import { GeminiConnection } from "../gemini/GeminiConnection.js";
import User from "../models/AuthModel.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/thread", async (req, res) => {
  try {
    const response = await Thread.find();
    if (response.length == 0) {
      return res.status(404).json({
        message: "Thread not found!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Threads fetched successfully!",
      success: true,
      response,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
});

router.get("/thread/:threadId", async (req, res) => {
  try {
    const { threadId } = req.params;
    const response = await Thread.find({ threadId });
    if (response.length == 0) {
      return res.status(404).json({
        message: "Thread not found!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Threads by id fetched successfully!",
      success: true,
      response,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
});

router.delete("/thread/:threadId", async (req, res) => {
  try {
    const { threadId } = req.params;
    const deletedThread = await Thread.findOneAndDelete({ threadId });
    if (!deletedThread) {
      return res.status(404).json({
        message: "Thread not found!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Thread deleted successfully!",
      success: true,
      deletedThread,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
});

router.post("/chat", async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(400).json({
        message: "Unauthorize!",
        success: false,
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    console.log(userId);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found!",
        success: false,
      });
    }

    const { threadId, message } = req.body;
    if (!threadId || !message) {
      return res.status(404).json({
        message: "threadId or message is empty",
        success: false,
      });
    }

    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      thread = new Thread({
        threadId,
        title: message,
        messages: [{ role: "user", content: message }],
      });
      user.threads.push(threadId);
      await user.save();
    } else {
      thread.messages.push({ role: "user", content: message });
    }
    const replyFromAI = await GeminiConnection(message);
    thread.messages.push({ role: "assistant", content: replyFromAI });

    thread.updatedAt = new Date();
    const newThread = await thread.save();

    res.status(200).json({
      Prompt: message,
      replyFromAI,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
});

export default router;
