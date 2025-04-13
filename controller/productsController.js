const db = require("../database");

const addProduct = async(req, res) => {
    try {
        const {name, description, price, categoryId, url} = req.body

        if(!name || !name.trim()) throw "Name is required";
        if(!price) throw "price is required";
        if(!categoryId) throw "Categories Id is required";
        if(!url) throw "URL is required";

        const [result] = await db.query("INSERT INTO products (name, description, price, category_id, image_url) VALUES (?, ?, ?, ?, ?)", [name, description, price, categoryId, url]);
        res.json({ status: 200, message: "Successfully added", data: result });

    } catch (error) {
        console.error("Something went wrong:", error);
        res.json({ status: 400, error });
    }
}

const getProductById = async (req, res) => {
    try{
        const {id} = req.params;

        if(!id) {
            throw "Id is required";
        }

        const [result] = await db.query("SELECT * from products WHERE id = ?",[id]);

        res.json({ status: 200, message: "Success", data: result });
    } catch (error) {
        console.error("Something went wrong:", error);
        res.json({ status: 400, error });
    }
}


module.exports = {
    addProduct, getProductById
}