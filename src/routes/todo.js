import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", (req, res) => {
  const getTodos = db.prepare(`
        SELECT * FROM todos WHERE user_id = ?
        `);
  const todos = getTodos.all(req.user.id);
  return res.status(200).json(todos);
});

router.post("/", (req, res) => {
  const { task } = req.body;
  const insertTodo = db.prepare(`
        INSERT INTO todos (user_id, task) VALUES (?,?)
        `);
  const result = insertTodo.run(req.user.id, task);
  return res.status(201).json({
    message: "Todo created successfully",
    data: {
      task,
      completed: 0,
      id: result.lastInsertRowid,
    },
  });
});

router.put("/:id", (req, res) => {
  const { completed } = req.body;
  const { id } = req.params;
  const { page } = req.query;

  const updateQuery = db.prepare(`
        UPDATE todos SET completed = ? WHERE id = ?`);
  updateQuery.run(completed, id);
  return res.status(200).json({
    message: "Todo updated successfully",
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const deleteQuery = db.prepare(`
        DELETE FROM todos WHERE id = ? AND user_id = ?`);
  deleteQuery.run(id, req.user.id);
  return res.status(204).json({
    message: "Todo deleted successfully",
  });
});

export default router;
