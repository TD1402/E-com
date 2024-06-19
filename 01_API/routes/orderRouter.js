const router = require("express").Router();
const { updateOrder } = require("../controllers/order/orderCtrl");
const orderCtrl = require("../controllers/order/orderCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const authMe = require("../middleware/authMe");

router
  .route("/orders")
  .get(orderCtrl.getOrdersbyID)
  .post(orderCtrl.createOrder)
  .put(auth, orderCtrl.updateOrderDetail)
  .delete(auth, orderCtrl.removeOrderItem);

router.route("/orders/admin").get(auth, authAdmin, orderCtrl.getAllOrders);

router.route("/orders/:id").put(orderCtrl.updateOrder);
router.route("/orders/payment").get(orderCtrl.getOrders);
router
  .route("/cart")
  .get(auth, orderCtrl.getCart)
  .put(auth, orderCtrl.addTypeToOrder);

router
  .route("/history")
  .get(auth, orderCtrl.getMyOrder)
  .put(orderCtrl.getOrdersByTime);

router.route("/cart/checkout").post(auth, orderCtrl.checkoutOrder);

router
  .route("/delivery/:id")
  .get(orderCtrl.getDelivery)
  .put(auth, orderCtrl.updateDelivery);

module.exports = router;
