import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 86400, // 24 hours
    });

    return res.status(200).json({
      message: "Login Successful",
      token,
    });
  } catch (err) {
    console.log(err);
    return res.status(503).json({
      message: "Error Logging In",
    });
  }
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 8);

  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    //default todo
    const defaultTodo = "Hello :) Welcome to your todo list!";
    await prisma.todo.create({
      data: {
        task: defaultTodo,
        user_id: user.id,
      },
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 86400, // 24 hours
    });

    return res.status(201).json({
      message: "User Registered Successfully",
      token,
    });
  } catch (err) {
    console.log(err);
    return res.status(503).json({
      message: "Error Registering User",
    });
  }
});

export default router;
