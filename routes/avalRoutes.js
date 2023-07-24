import express from "express";
import { mostrarAvalEspecifico }  from "../controllers/avalController.js";

const router = express.Router();

router.post("/:id_cliente", mostrarAvalEspecifico);

export default router;