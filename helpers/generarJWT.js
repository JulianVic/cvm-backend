
import jwt from "jsonwebtoken";

const generarJTW = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "72h",
    });
};

export default generarJTW;