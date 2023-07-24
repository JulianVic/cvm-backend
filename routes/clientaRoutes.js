import express from "express";
import { mostrarClientas,mostrarClientasModificar, mostrarEstadoCliente, registrarClienta, modificarClienta, eliminarClienta, mostrarEstadoClientes, registrarPago, mostrarEstado }  from "../controllers/clientaController.js";

const router = express.Router();

router.get("/:id_coordinador", mostrarClientas);
router.post("/mostrarClientaModificar", mostrarClientasModificar)
router.post("/registrarClienta", registrarClienta);
router.post("/mostrarEstadoCliente/", mostrarEstadoCliente);
router.get("/mostrarEstadoClientes/:id_coordinador", mostrarEstadoClientes);
router.put("/modificarClienta", modificarClienta);
router.delete("/eliminarClienta/:id_cliente", eliminarClienta);
router.put("/registrarPago", registrarPago);
router.post("/mostrarEstado", mostrarEstado);

export default router;