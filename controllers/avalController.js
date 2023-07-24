import {conectarDB, desconectarDB} from "../config/db.js";

const mostrarAvalEspecifico = async (req, res) => {
  const { id_cliente } = req.params;

  try {
    const cxn = await conectarDB();
    cxn.query(
      "SELECT * FROM avales WHERE id_cliente = ?",
      [id_cliente],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ mensaje: "Error en el servidor" });
        } else {
          res.status(200).json(result);
        }
      }
    );
    desconectarDB();
  } catch (e) {
    console.log(e);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export { mostrarAvalEspecifico };
