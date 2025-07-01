import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  try {
    const getUser = db.prepare(`
        SELECT * FROM users WHERE username = ?
        `);
    const user = getUser.get(username);

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

router.post("/register", (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 8);

  try {
    const insertUser = db.prepare(`
        INSERT INTO users (username,password) VALUES (?,?)
        `);

    const result = insertUser.run(username, hashedPassword);

    //default todo
    const defaultTodo = "Hello :) Welcome to your todo list!";
    const insertTodo = db.prepare(`
        INSERT INTO todos (user_id, todo) VALUES (?,?)
        `);
    insertTodo.run(result.lastInsertRowid, defaultTodo);

    const token = jwt.sign(
      { id: result.lastInsertRowid },
      process.env.JWT_SECRET,
      {
        expiresIn: 86400, // 24 hours
      }
    );

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
