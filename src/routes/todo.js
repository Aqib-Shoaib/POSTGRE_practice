import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const todos = await prisma.todo.findMany({
    where: {
      user_id: req.user.id,
    },
  });
  return res.status(200).json(todos);
});

router.post("/", async (req, res) => {
  const { task } = req.body;
  const newTodo = await prisma.todo.create({
    data: {
      user_id: req.user.id,
      task,
    },
  });

  return res.status(201).json({
    message: "Todo created successfully",
    data: newTodo,
  });
});

router.put("/:id", async (req, res) => {
  const { completed } = req.body;
  const { id } = req.params;
  // const { page } = req.query;

  const updatedTodo = await prisma.todo.update({
    where: {
      id: parseInt(id),
      user_id: req.user.id,
    },
    data: {
      completed: !!completed,
    },
  });
  return res.status(200).json({
    message: "Todo updated successfully",
    data: updatedTodo,
  });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  await prisma.todo.delete({
    where: {
      id: parseInt(id),
      user_id: req.user.id,
    },
  });
  return res.status(204).json({
    message: "Todo deleted successfully",
  });
});

export default router;
