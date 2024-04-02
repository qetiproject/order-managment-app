import express from "express";
import {
  getOrders,
  createOrder,
  deleteOrder,
  orderAssign,
  getOrderById,
} from "./orders.service.js";

const OrdersRouter = express.Router();

OrdersRouter.get("/", async (req, res) => {
  try {
    const { customer, logist, strongFilter } = req.query;
    const orders = await getOrders(customer, logist, strongFilter);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

OrdersRouter.post("/", async (req, res) => {
  try {
    const newOrder = await createOrder(req.body);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

OrdersRouter.get("/:orderId", async (req, res) => {
  try {
    const order = await getOrderById(req.params.orderId);
    res.status(200).json(order);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

OrdersRouter.put("/assign", async (req, res) => {
  try {
    const updatedOrder = await orderAssign(req.body.orderId, req.body.logistId);
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

OrdersRouter.delete("/:orderId", async (req, res) => {
  try {
    const deletedOrder = await deleteOrder(req.params.orderId);
    res.status(202).json(deletedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default OrdersRouter;
