const db = require("../database");

const getCategory = async(req, res) => {
    try {
        const [result] = await db.query("SELECT * FROM categories");
        res.json({ status: 200, message: "Success", data: result });

    } catch (error) {
        console.log("Something went wrong", error);
        res.json({status:400, error})
    }
}

const addCategory = async(req,res) => {
    try {
        console.log(1)
        const {name, description} = req.body;
        console.log(2)
        
        if (!name || !name.trim()) throw "Name is required";
        console.log(3)

        const [result] = await db.query("INSERT INTO categories (name, description) VALUES (?,?)",[name, description]);
        console.log(4)
        res.json({ status: 200, message: "Successfully added", data: result });

    } catch (error) {
        console.error("Something went wrong:", error);
        res.json({ status: 400, error });
    }
}

const getProductsByCategoryId = async (req, res) => {
    try {
        const { categoryId } = req.params;

        if (!categoryId) throw "Category ID is required";

        const [result] = await db.query("SELECT * FROM products WHERE category_id = ?",[categoryId]);

        res.json({ status: 200, message: "Success", data: result });
    } catch (error) {
        console.error("Something went wrong:", error);
        res.json({ status: 400, error });
    }
};

module.exports = {
    getCategory , addCategory, getProductsByCategoryId
}