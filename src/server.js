const express = require('express');
const productManager = require('./app');
const srv = express();
const port = 3000;

srv.use(express.json());
srv.use(express.urlencoded({ extended:true }));

let app = productManager.ProductManager('../files/productos.json');

srv.get("/productos", async(req, res) => {
    let limite = req.query.limite;
    let productos = await app.getProductos();
    res.send({productos:productos.slice(0, limite)
    });
});

srv.get("/productos/:pid", async(req, res) => {
    let id = parseInt(req.parametro.pid);
    let producto = await app.getProductsById(id);
    if(producto){
        res.send(producto);
    }else{
        res.send({error: 'El producto no existe'});
    }
});

srv.listen(port, () => {
    console.log(`server escuchando en el puerto ${port}`);
});