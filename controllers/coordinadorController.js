import { conectarDB, desconectarDB } from "../config/db.js";
import generarIDUnica from "../helpers/generarID.js";
import generarContrasena from "../helpers/generarContrasena.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "cvmfinan@gmail.com",
    pass: "fsftfemcxysexlpy",
  },
});

const mostrarCoordinadores = async (req, res) => {
  try {
    const cxn = await conectarDB();
    cxn.query(
      "SELECT * FROM coordinadores where rango = 'C'",
      (err, result) => {
        res.status(200).json(result);
      }
    );
    desconectarDB();
  } catch (e) {
    console.log(e);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

const login = async (req, res) => {
  const { id_coordinador, contrasena } = req.body;
  try {
    const cxn = await conectarDB();
    cxn.query(
      "SELECT * FROM coordinadores WHERE id_coordinador = ?",
      [id_coordinador],
      async (err, result) => {
        if (result.length > 0) {
          const contrasenaCorrecta = await bcrypt.compare(
            contrasena,
            result[0].contrasena
          );
          if (contrasenaCorrecta) {
            res
              .status(200)
              .json({
                mensaje: "Coordinador loggeado correctamente",
                coordinador: result[0],
              });
          } else {
            res.status(401).json({ mensaje: "Contraseña incorrecta" });
          }
        } else {
          res.status(404).json({ mensaje: "Coordinador no encontrado" });
        }
      }
    );
    desconectarDB();
  } catch (e) {
    console.log(e);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

const recuperarContrasena = async (req, res) => {
  try {
    const cxn = await conectarDB();
    const { correo } = req.body;
    cxn.query(
      "SELECT * FROM coordinadores WHERE correo = ?",
      [correo],
      async (err, result) => {
        const nuevaContrasena = generarContrasena();
        const nuevaContrasenaEncriptada = await bcrypt.hash(
          nuevaContrasena,
          10
        );
        cxn.query("UPDATE coordinadores SET contrasena = ? WHERE correo = ?", [
          nuevaContrasenaEncriptada,
          correo,
        ]);
        if (result.length > 0) {
          res
            .status(200)
            .json({
              mensaje: "Coordinador encontrado",
              coordinador: result[0],
              nuevaContrasena,
            });
        } else {
          res.status(404).json({ mensaje: "Coordinador no encontrado" });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

const registrarCoordinador = async (req, res) => {
  const { nombre, apellidoP, apellidoM, correoElectronico, telefono, rango } =
    req.body;
  const nombreCompleto = nombre + " " + apellidoP + " " + apellidoM;
  const idCoordinador = generarIDUnica();
  const contrasena = generarContrasena();
  const contrasenaEncriptada = await bcrypt.hash(contrasena, 10);

  const mailOptions = {
    from: "cvmfinan@gmail.com",
    to: correoElectronico,
    subject: "#Credenciales de inicio a la plataforma#",
    text:
      "Bienvenida  #" +
      nombreCompleto +
      "#\nSu ID es: " +
      idCoordinador +
      "\nSu contraseña es: " +
      contrasena,
  };

  try {
    const cxn = await conectarDB();
    const existeCorreo = await new Promise((resolve, reject) => {
      cxn.query(
        "SELECT * FROM coordinadores WHERE correo = ?",
        [correoElectronico],
        (err, result) => {
          if (err) reject(err);
          resolve(result.length > 0);
        }
      );
    });
    if (existeCorreo) {
      res.status(400).json({ mensaje: "El correo ya existe" });
    } else {
      cxn.query(
        "INSERT INTO coordinadores (id_coordinador, contrasena, nombres, apellido_paterno, apellido_materno, telefono, correo, rango) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          idCoordinador,
          contrasenaEncriptada,
          nombre,
          apellidoP,
          apellidoM,
          telefono,
          correoElectronico,
          rango,
        ]
      );
      //si hay un error en el correo, entonces
      res
        .status(200)
        .json({ mensaje: "Coordinador registrado correctamente", contrasena });
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log("Error..." + error);
        } else {
          console.log("Correo enviado: " + info.response);
        }
      });
    }
    desconectarDB();
  } catch (e) {
    console.log(e);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

const actualizarContrasena = async (req, res) => {
  const { id_coordinador, contrasenaActual, nuevaContrasena } = req.body;
  try {
    const cxn = await conectarDB();
    cxn.query(
      "SELECT * FROM coordinadores WHERE id_coordinador = ?",
      [id_coordinador],
      async (err, result) => {
        if (result.length > 0) {
          const contrasenaCorrecta = await bcrypt.compare(
            contrasenaActual,
            result[0].contrasena
          );
          if (contrasenaCorrecta) {
            const nuevaContrasenaEncriptada = await bcrypt.hash(
              nuevaContrasena,
              10
            );
            cxn.query(
              "UPDATE coordinadores SET contrasena = ? WHERE id_coordinador = ?",
              [nuevaContrasenaEncriptada, id_coordinador]
            );
            res
              .status(200)
              .json({ mensaje: "Contraseña actualizada correctamente" });
          } else {
            res.status(401).json({ mensaje: "Contraseña incorrecta" });
          }
        } else {
          res.status(404).json({ mensaje: "Coordinador no encontrado" });
        }
      }
    );
  } catch (e) {
    console.log(e);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

const eliminarCoordinador = async (req, res) => {
  const { id_coordinador } = req.params;
  try {
    const cxn = await conectarDB();
    cxn.query("DELETE FROM coordinadores WHERE id_coordinador = ?", [
      id_coordinador,
    ]);
    res.status(200).json({ mensaje: "Coordinador eliminado correctamente" });
    desconectarDB();
  } catch (e) {
    console.log(e);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export {
  mostrarCoordinadores,
  login,
  registrarCoordinador,
  actualizarContrasena,
  recuperarContrasena,
  eliminarCoordinador,
};
