const db = require("../database");

const createOrder = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { total_amount, address } = req.body;

    if (!user_id) throw "User Id is required";
    if (!total_amount || total_amount <= 0) throw "Total amount is required";
    if (!address) throw "Address is required";

    // Get cart for user
    const [cart] = await db.query(`SELECT id FROM carts WHERE user_id = ?`, [
      user_id,
    ]);
    if (cart.length === 0) throw "No cart found";

    const cart_id = cart[0].id;

    // Get cart items
    const [items] = await db.query(
      `SELECT product_id, quantity FROM cart_items WHERE cart_id = ?`,
      [cart_id]
    );
    if (items.length === 0) throw "Cart is empty";

    // Create order
    const [order] = await db.query(
      `INSERT INTO orders (user_id, total_amount, status, address, created_at, updated_at) VALUES (?, ?, 'Success', ?, NOW(), NOW())`,
      [user_id, total_amount, address]
    );

    const order_id = order.insertId;

    // Add items to order_items
    for (const item of items) {
      // fetch product detail
      const [result] = await db.query("SELECT * from products WHERE id = ?", [
        item.product_id,
      ]);
      const product = result[0];

      await db.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price, created_at, updated_at)
         VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [order_id, item.product_id, item.quantity, product.price]
      );
    }

    // Clear cart
    await db.query(`DELETE FROM cart_items WHERE cart_id = ?`, [cart_id]);

    res.json({ status: 200, message: "Order created" });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(400).json({ status: 400, error });
  }
};

const getOrdersByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) throw "User ID is required";

    // get orders by id
    const [orderDetails] = await db.query(
      `Select * from orders where user_id = ? order by created_at desc`,
      [user_id]
    );

    res.json({ status: 200, message: "Success", data: orderDetails });
  } catch (error) {
    console.error("Get Orders Error:", error);
    res.status(400).json({ status: 400, error });
  }
};

const getStats = async (req, res) => {
  try {
    console.log(1);
    // Get total categories
    const [categories] = await db.query(
      `SELECT COUNT(*) AS total FROM categories`
    );
    const totalCategories = categories[0].total;
    console.log(2);
    // Get total products
    const [products] = await db.query(`SELECT COUNT(*) AS total FROM products`);
    const totalProducts = products[0].total;

    // Get total orders
    const [orders] = await db.query(`SELECT COUNT(*) AS total FROM orders`);
    const totalOrders = orders[0].total;
    console.log(3);
    // Get orders per day (grouped by date)
    const [ordersPerDayRaw] = await db.query(`
      SELECT DATE(created_at) AS date, SUM(total_amount) AS amount
      FROM orders
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at)
    `);

    const ordersPerDayData = ordersPerDayRaw.map((row) => ({
      date: row.date,
      amount: Number(row.amount),
    }));
    console.log(4);
    const result = {
      totalCategories,
      totalProducts,
      totalOrders,
      ordersPerDayData,
    };
    console.log(5);
    res.json({ status: 200, message: "Success", data: result });
  } catch (error) {
    console.error("Get Stats Error:", error);
    res.status(400).json({ status: 400, error });
  }
};

module.exports = {
  createOrder,
  getOrdersByUser,
  getStats,
};
