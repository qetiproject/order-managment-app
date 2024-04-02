import express from "express";
import {
  getUsers,
  updateUser,
  deleteUser,
  createUser,
  getUserById,
} from "./users.service.js";

const UsersRouter = express.Router();

UsersRouter.get("/", async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

UsersRouter.post("/", async (req, res) => {
  try {
    const newUser = await createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

UsersRouter.get("/:userId", async (req, res) => {
  try {
    const user = await getUserById(req.params.userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

UsersRouter.put("/:userId", async (req, res) => {
  try {
    const updatedUser = await updateUser(req.params.userId, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

UsersRouter.delete("/:userId", async (req, res) => {
  try {
    const user = await deleteUser(req.params.userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default UsersRouter;
