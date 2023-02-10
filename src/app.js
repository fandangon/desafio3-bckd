const fs = require('fs');

class Productos{
    constructor(id, title, description, price, thumbnail, code, stock){
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

class ProductManager{
    constructor(path){
        this.path = path;
    }

    async getProductos(){
        let fileExists = fs.existsSync(this.path);
        if(fileExists){
            let dato = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(dato);
        } else {
            return [];
        }
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        let productos = await this.getProductos();
        let productoExiste = productos.findIndex((producto) => producto.code === code) !== -1;
        let aFieldIsEmpty = !(title && description && price && thumbnail && code && stock);
        if(productoExiste || aFieldIsEmpty){
            console.log(`El producto no fue añadido.\nErrors:${productoExiste ? "\nEl producto existe." : ""} ${aFieldIsEmpty ? "\nSe deben completar todos los campos." : ""}`);
        } else {
            let id = productos.lenght + 1;
            let newProduct = new Productos(id, title, description, price, thumbnail, code, stock);
            productos.push(newProduct);
            await fs.promises.writeFile(this.path, JSON.stringify(productos,null,2));
            console.log(`El producto ${title} se añadio con el ID ${id}`);
            }
        }

        async getProductById(id){
            let productos = await this.getProductos();
            let producto = productos.find((producto) => producto.id === id);
            if(producto) {
                return producto;
            }else{
                console.log("Producto no encontrado");
            }
        }

        async updateProduct(id, title, description, price, thumbnail, code, stock){
            let productos = await this.getProductos();
            let productIndex = productos.findIndex((producto) => producto.id ===id);
            let productoExiste = productIndex !== -1;
            if(productoExiste){
                productos[productIndex].title = title;
                productos[productIndex].description = description;
                productos[productIndex].price = price;
                productos[productIndex].thumbnail = thumbnail;
                productos[productIndex].code = code;
                productos[productIndex].stock = stock;
                await fs.promises.writeFile(this.path, JSON.stringify(productos,null,2));
                console.log(`El producto ${title} con ID ${id} se actualizo`);
            } else {
                console.log("Producto no encontrado");
            }
        }

        async deleteProduct(id) {
            let productos = await this.getProductos();
            let productIndex = productos.findIndex((producto) => producto.id === id);
            let productoExiste = productIndex !== -1;
            if(productoExiste) {
                productos[productIndex] = {};
                await fs.promises.writeFile(this.path, JSON.stringify(productos,null,2));
                console.log(`El producto con ID ${id} se ha borrado`);
            } else {
                console.log("Producto no encontrado");
            }
        }
    }

    exports.ProductManager = (path) => new ProductManager(path);

    let app = new ProductManager("../files/productos.json");

    /* Llamar Métodos */
    //app.getProductos().then(productos => console.log(productos));
    //app.addProduct("Jabon", "Prueba", 200, "Imagen", "code1", 30);
    //app.getProductos().then(productos => console.log(productos));
    //app.getProductById(1).then(producto => console.log(producto));
    //app.updateProduct(1, "Pan", "modificar", 250, "imagen", "code222", 30);
    //app.deleteProduct();
