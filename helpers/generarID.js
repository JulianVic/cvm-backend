const generarIDUnica = () => {
    const min = 10000;
    const max = 99999;
    const id = Math.floor(Math.random() * (max - min)) + min;
    return id;
}

export default generarIDUnica;