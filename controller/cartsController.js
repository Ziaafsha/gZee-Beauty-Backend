const db = require("../database");

const getCartByUser = async (req, res) => {
  try {
    console.log(1);
    const { user_id } = req.params;

    if (!user_id) throw "User Id is required";
    console.log(2);

    // GET THE USER CART
    const [userCart] = await db.query(
      "SELECT id FROM carts WHERE user_id = ?",
      [user_id]
    );

    if (userCart.length === 0) {
      return res.status(404).json({ status: 404, message: "Cart not found" });
    }

    const cart_id = userCart[0].id;

    const [items] = await db.query(
      `SELECT cart_items.id, cart_items.quantity, products.id, products.name, products.price, 
                                      products.image_url FROM cart_items JOIN products ON cart_items.product_id
                                      = products.id WHERE cart_items.cart_id = ?`,
      [cart_id]
    );

    res.json({
      status: 200,
      message: "Success",
      data: { cart_id, user_id, items },
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(400).json({ status: 400, error });
  }
};

const addToCart = async (req, res) => {
  try {
    // GET INFO FROM USERS
    const { user_id, product_id, quantity } = req.body;

    //VALIDATION
    if (!user_id || !quantity) throw "User Id and Quantity are required";

    if (!product_id) throw "Product Id is Required";

    //CREATE CART FOR USER
    let [cart] = await db.query("SELECT id FROM carts WHERE user_id = ?", [
      user_id,
    ]);

    let cart_id;

    if (cart.length === 0) {
      const [newCart] = await db.query(
        "INSERT INTO carts (user_id, created_at) VALUES (?, NOW())",
        [user_id]
      );
      cart_id = newCart.insertId;
    } else {
      cart_id = cart[0].id;
    }

    const [items] = await db.query(
      "SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?",
      [cart_id, product_id]
    );

    if (items.length > 0) {
      const newQty = items[0].quantity + quantity;
      await db.query("UPDATE cart_items SET quantity = ? WHERE id = ?", [
        newQty,
        items[0].id,
      ]);
    } else {
      await db.query(
        `INSERT INTO cart_items (cart_id, product_id, quantity)
                        VALUES (?, ?, ?)`,
        [cart_id, product_id, quantity]
      );
    }

    res.json({ status: 200, message: "Product added to cart" });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(400).json({ status: 400, error });
  }
};

const removeFromCart = async (req, res) => {
  try {
    // GET INFO FROM USER
    const { user_id, product_id } = req.body;

    // VALIDATION
    if (!user_id) throw "User Id is required";
    if (!product_id) throw "Product Id is Required";

    // GET CART ID FOR USER
    const [cart] = await db.query(`SELECT id FROM carts WHERE user_id = ?`, [
      user_id,
    ]);

    if (cart.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "Cart not found for user" });
    }

    const cart_id = cart[0].id;

    // DELETE THE ITEM FROM CART ITEM
    const [result] = await db.query(
      `DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?`,
      [cart_id, product_id]
    );

    if (result.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "Item not found in cart" });
    }

    res.json({ status: 200, message: "Item removed from cart" });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(400).json({ status: 400, error });
  }
};

module.exports = {
  getCartByUser,
  addToCart,
  removeFromCart,
};
