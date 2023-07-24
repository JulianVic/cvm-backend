import express from "express";
import {mostrarCoordinadores, login, registrarCoordinador, actualizarContrasena, recuperarContrasena, eliminarCoordinador }  from "../controllers/coordinadorController.js";

const router = express.Router();

router.get("/", mostrarCoordinadores);
router.post("/login", login);
router.post("/recuperarContra", recuperarContrasena);
router.post("/registrarCoordinador", registrarCoordinador);
router.put("/actualizarContrasena", actualizarContrasena);
router.delete("/eliminarCoordinador/:id_coordinador", eliminarCoordinador);


export default router;