import { Row, Col, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const formatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});
const UserOrdersPageComponent = ({ getOrders }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders()
      .then((orders) => setOrders(orders))
      .catch((er) => console.log(er));
  }, []);

  return (
    <Row className="m-5">
      <Col md={12}>
        <h1>Đơn hàng của tôi</h1>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Người dùng</th>
              <th>Ngày đặt hàng</th>
              <th>Tổng tiền</th>
              <th>Đã giao hàng</th>
              <th>Chi tiết đặt hàng</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>You</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{formatter.format(order.orderTotal.cartSubtotal)}</td>
                <td>
                  {order.isDelivered ? (
                    <i className="bi bi-check-lg text-success"></i>
                  ) : (
                    <i className="bi bi-x-lg text-danger"></i>
                  )}
                </td>
                <td>
                  <Link to={`/user/order-details/${order._id}`}>Đặt hàng</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default UserOrdersPageComponent;
