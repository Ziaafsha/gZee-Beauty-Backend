const db = require("../database");

const createOrder = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) throw "User Id is required";

    // Get cart for user
    const [cart] = await db.query(`SELECT id FROM carts WHERE user_id = ?`,[user_id]);
    if (cart.length === 0) throw "No cart found";

    const cart_id = cart[0].id;

    // Get cart items
    const [items] = await db.query(`SELECT product_id, quantity FROM cart_items WHERE cart_id = ?`,[cart_id]);
    if (items.length === 0) throw "Cart is empty";

    // Create order
    const [order] = await db.query(`INSERT INTO orders (user_id, status, created_at, updated_at) VALUES (?, 'Pending', NOW(), NOW())`,[user_id]);
      
    const order_id = order.insertId;

    // Add items to order_items
    for (const item of items) {
      await db.query(
        `INSERT INTO order_items (order_id, product_id, quantity, created_at, updated_at)
         VALUES (?, ?, ?, NOW(), NOW())`,
        [order_id, item.product_id, item.quantity]
      );
    }

    // Clear cart
    await db.query(`DELETE FROM cart_items WHERE cart_id = ?`, [cart_id]);

    res.json({ status: 200, message: "Order created"});
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(400).json({ status: 400, error });
  }
};

const getOrdersByUser = async (req, res) => {
    try {
      const { user_id } = req.params;
  
      if (!user_id) throw "User ID is required";
  
      const [orders] = await db.query(
        `SELECT orders.id, orders.status, orders.created_at, products.name, products.price, order_items.quantity FROM orders 
         JOIN order_items ON orders.id = order_items.order_id JOIN products ON order_items.product_id = products.id
         WHERE orders.user_id = ? ORDER BY orders.created_at DESC`,[user_id]);
  
      res.json({ status: 200, orders });
    } catch (error) {
      console.error("Get Orders Error:", error);
      res.status(400).json({ status: 400, error });
    }
  };
  
  

module.exports = {
    createOrder, getOrdersByUser
}