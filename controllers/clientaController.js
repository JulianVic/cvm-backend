import {conectarDB, desconectarDB} from "../config/db.js";
import generarIDUnica from "../helpers/generarID.js";
  
    
const mostrarClientas = async (req, res) => {
  const { id_coordinador } = req.params;
  try {
    const cxn = await conectarDB();
    cxn.query(
      "SELECT * FROM clienta WHERE id_coordinador = ?",
      [id_coordinador],
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

const mostrarClientasModificar = async (req, res) =>{
  const {id_cliente}= req.body;
  try {
    const cxn = await conectarDB();
    cxn.query("SELECT * FROM clienta WHERE id_cliente = ?",
    [id_cliente],
    async (err, result)=>{
      if (result.length>0) {
        res.status(200).json(result);
      } else {
        res.status(400).json({mensaje: "No encontrado"})
      }
      
    }
    )
  } catch (error) {
    
    res.status(500).json({mensaje: "Error"})
  }
}
const registrarClienta = async (req, res) => {
    const {
      id_coordinador,
      nombreCliente,
      apellidoClienteP,
      apellidoClienteM,
      direccionCliente,
      telefonoCliente,
      credito,
      fecha,
      fechaLunes,
      nombreAval,
      apellidoAvalP,
      apellidoAvalM,
      direccionAval,
      telefonoAval,
    } = req.body;
  
    const idCliente = generarIDUnica();
    
    try {
      const cxn = await conectarDB();
  
      cxn.query(
        "INSERT INTO clienta (id_cliente, nombres, apellido_paterno, apellido_materno, calle, numero_exterior, codigo_postal, telefono, credito, id_coordinador, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?  )",
        [idCliente, nombreCliente, apellidoClienteP, apellidoClienteM, direccionCliente.calle, direccionCliente.numeroExterior, direccionCliente.codigoPostal, telefonoCliente, credito, id_coordinador, fecha]
      );
  
      cxn.query(
        "INSERT INTO avales (id_cliente, nombres, apellido_paterno, apellido_materno, calle, numero_exterior, codigo_postal, telefono) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [idCliente, nombreAval, apellidoAvalP, apellidoAvalM, direccionAval.calle, direccionAval.numeroExterior, direccionAval.codigoPostal, telefonoAval]
      );
      //hacer una variable que guarde la fecha del lunes más cercano pero que no sea menor a la fecha actual
      cxn.query(
        "INSERT INTO pagos (id_cliente, total_pago, pago, deuda_moratorio, ultimo_pago, proximo_pago, semana_pago) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [idCliente, 0, 0, 0, "--/--/----", fechaLunes, 0]
      );

      res.status(200).json({ mensaje: "Clienta registrada correctamente" });
      desconectarDB();
    } catch (e) {
      console.log(e);
      res.status(500).json({ mensaje: "Error en el servidor" });
    }
  };

  const mostrarEstadoCliente = async (req, res) => {
    const { id_cliente } = req.body;
  console.log(id_cliente)
    try {
      const cxn = await conectarDB();
      cxn.query(
        "SELECT * FROM pagos WHERE id_cliente = ?",
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

const mostrarEstadoClientes = async (req, res) => {
    const { id_coordinador } = req.params;
    try{
      const cxn = await conectarDB();
      //query que devolvera la tabla clientas y tabla pagos
      let query = "SELECT * FROM clienta natural join pagos WHERE id_coordinador = ?";
      cxn.query(
        query,
        [id_coordinador],
        (err, result) => {
          res.status(200).json(result);
        });
      desconectarDB();
    }catch(e){
      console.log(e);
    }
};

const modificarClienta = async (req, res) => {
    const {
      id_cliente,
      nombreCliente,
      apellidoClienteP,
      apellidoClienteM,
      direccionCliente,
      telefonoCliente,
      nombreAval,
      apellidoAvalP,
      apellidoAvalM,
      direccionAval,
      telefonoAval,
    } = req.body;
  
    try {
      const cxn = await conectarDB();
      cxn.query(
        "UPDATE clienta SET nombres = ?, apellido_paterno = ?, apellido_materno = ?, calle = ?, codigo_postal = ?, telefono = ? WHERE id_cliente = ?",
        [ nombreCliente, apellidoClienteP, apellidoClienteM, direccionCliente.calle, direccionCliente.codigoPostal, telefonoCliente, id_cliente]
      );
  
      cxn.query(
        "UPDATE avales SET nombres = ?, apellido_paterno = ?, apellido_materno = ?, calle = ?, codigo_postal = ?, telefono = ? WHERE id_cliente = ?",
        [nombreAval, apellidoAvalP, apellidoAvalM, direccionAval.calle, direccionAval.codigoPostal, telefonoAval, id_cliente]
      );
      res.status(200).json({ mensaje: "Clienta modificada correctamente" });
      desconectarDB();
    } catch (e) {
      console.log(e);
      res.status(500).json({ mensaje: "Error en el servidor" });
    }
};

const eliminarClienta = async (req, res) => {
    const { id_cliente } = req.params;

    try {
      const cxn = await conectarDB();
  
      cxn.query("DELETE FROM avales WHERE id_cliente = ?", [id_cliente]);
      cxn.query("DELETE FROM clienta WHERE id_cliente = ?", [id_cliente]);
  
      res.status(200).json({ mensaje: "Clienta eliminada correctamente" });
      desconectarDB();
    } catch (e) {
      console.log(e);
      res.status(500).json({ mensaje: "Error en el servidor" });
    }
}
const mostrarEstado= async (req, res) => {
  const { id_cliente } = req.body;
  try {
    const cxn = await conectarDB();
    cxn.query(
      "SELECT * FROM pagos NATURAL JOIN clienta WHERE id_cliente=?",
      id_cliente,
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ mensaje: "Error en el servidor" });
        } else {
          res.status(200).json({mensaje: "Cliente encontrado", cliente: result[0]});
        }
      }
    );
    desconectarDB();
  } catch (e) {
    console.log(e);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

const registrarPago = async (req, res) => {
  const { id_cliente, total_pago, pago, deuda_moratorio, ultimo_pago, proximo_pago, semana_pago  } = req.body;
  try {
    const cxn = await conectarDB();
    cxn.query(
      "UPDATE pagos SET total_pago = ?, pago = ?, deuda_moratorio = ?, ultimo_pago = ?, proximo_pago = ?, semana_pago = ? WHERE id_cliente = ?",
      [total_pago, pago, deuda_moratorio, ultimo_pago, proximo_pago, semana_pago, id_cliente]
    );
    res.status(200).json({ mensaje: "Pago registrado correctamente" });
    desconectarDB();
  } catch (e) {
    console.log(e);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export { mostrarClientas, registrarClienta, mostrarEstadoCliente,mostrarClientasModificar, modificarClienta, eliminarClienta, mostrarEstadoClientes, mostrarEstado, registrarPago };

