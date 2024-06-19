const paypal = require("paypal-rest-sdk");
const Orders = require("../../models/order/orderModel");
const axios = require("axios");

async function generateAccessToken() {
  try {
    const response = await axios({
      url: process.env.PAYPAL_BASE_URL + "/v1/oauth2/token",
      method: "post",
      data: "grant_type=client_credentials",
      auth: {
        username: process.env.PAYPAL_CLIENT_ID,
        password: process.env.PAYPAL_SECRET,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const accessToken = response.data.access_token;
    console.log(accessToken);

    return accessToken;
  } catch (error) {
    console.error(
      "Error generating access token:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to generate access token");
  }
}

module.exports = generateAccessToken;

const paypalCtrl = {
  payment: async (res, amount, address, order_id) => {
    try {
      console.log("oke payment step1 ");
      const payment = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          cancel_url: "https://datn-aywu.onrender.com/api/paypal/cancel",
          return_url: "https://datn-aywu.onrender.com/api/paypal/success",
        },
        transactions: [
          {
            item_list: {
              items: [
                {
                  name: order_id,
                  sku: "001",
                  price: amount,
                  currency: "USD",
                  quantity: 1,
                },
              ],
            },
            amount: {
              currency: "USD",
              total: amount,
            },
            description: "This is the payment description.",
          },
        ],
      };
      await paypal.payment.create(payment, function (error, payment) {
        if (error) {
          console.log(error);
          res.status(500).json({ status: "error" }); // Trả về status: error nếu có lỗi khi tạo thanh toán
        } else {
          for (let i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel === "approval_url") {
              res.json({ url: payment.links[i].href });
            }
          }
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: "error" }); // Trả về status: error nếu có lỗi trong try-catch
    }
  },
  success: async (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const execute_payment_json = {
      payer_id: payerId,
    };

    await paypal.payment.execute(
      paymentId,
      execute_payment_json,
      async function (error, payment) {
        if (error) {
          console.log(error.response);
          res.status(401).json({ status: "error" }); // Trả về status: error nếu có lỗi khi thực hiện thanh toán
        } else {
          try {
            const order_id = payment.transactions[0].item_list.items[0].name;
            await Orders.findByIdAndUpdate(
              { _id: order_id },
              { status: "Paid" }
            );
            res.redirect("https://datn-kappa.vercel.app/success");
          } catch (err) {
            console.log(err);
            res.status(401).json({ status: "error" }); // Trả về status: error nếu có lỗi khi cập nhật trạng thái đơn hàng
          }
        }
      }
    );
  },

  cancel: async (req, res) => {
    res.status(406).json({ status: "cancelled" }); // Trả về status: cancelled nếu người dùng hủy thanh toán
  },

  test: async (req, res) => {
    generateAccessToken();
  },
};

module.exports = paypalCtrl;
