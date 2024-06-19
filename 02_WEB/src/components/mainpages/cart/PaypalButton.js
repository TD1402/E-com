import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default class PaypalButton extends React.Component {
  render() {
    const onSuccess = (details, data) => {
      // Xử lý khi thanh toán thành công
      console.log("The payment was succeeded!", details);
      this.props.tranSuccess(details);
    };

    const onCancel = (data) => {
      // Xử lý khi người dùng hủy thanh toán
      console.log("The payment was cancelled!", data);
    };

    const onError = (err) => {
      // Xử lý khi có lỗi xảy ra trong quá trình thanh toán
      console.log("Error!", err);
    };

    let env = "sandbox"; // Bạn có thể đặt ở đây thành 'production' cho môi trường sản phẩm
    let currency = "USD"; // Hoặc bạn có thể đặt giá trị này từ props hoặc state của bạn
    let total = this.props.total; // Giống như trên, đây là tổng số tiền (dựa trên loại tiền tệ) cần thanh toán bằng cách sử dụng thanh toán express PayPal
    // Tài liệu về mã tiền của PayPal: https://developer.paypal.com/docs/classic/api/currency_codes/
    const totalInUSD = (total / 23).toFixed(2);
    const options = {
      "client-id":
        "AR83cyvMkvUJAe4x-ajPu4LQlcMOyJhMePsJyJwQDUQFrnQdHHJtakPMx1-3P6BEojFjJtG-CXsD9HQ9", // Thay YOUR-CLIENT-ID bằng client ID của ứng dụng PayPal của bạn
      currency: currency,
    };
    return (
      <PayPalScriptProvider options={options}>
        <PayPalButtons
          style={{ layout: "horizontal" }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: totalInUSD,
                    currency_code: currency,
                  },
                },
              ],
            });
          }}
          onApprove={(data, actions) => {
            return actions.order.capture().then(function (details) {
              onSuccess(details, data);
            });
          }}
          onCancel={onCancel}
          onError={onError}
        />
      </PayPalScriptProvider>
    );
  }
}
