import {
  Container,
  Row,
  Col,
  Form,
  Alert,
  ListGroup,
  Button,
} from "react-bootstrap";
import CartItemComponent from "../../../component/CartItemComponent";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

const formatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});
const UserOrderDetailsPageComponent = ({
  userInfo,
  getUser,
  getOrder,
  loadPayPalScript,
}) => {
  const [userAddress, setUserAddress] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [orderButtonMessage, setOrderButtonMessage] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [isDelivered, setIsDelivered] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const paypalContainer = useRef();

  const { id } = useParams();

  useEffect(() => {
    getUser()
      .then((data) => {
        setUserAddress({
          address: data.address,
          city: data.city,
          country: data.country,
          zipCode: data.zipCode,
          state: data.state,
          phoneNumber: data.phoneNumber,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    getOrder(id)
      .then((data) => {
        setPaymentMethod(data.paymentMethod);
        setCartItems(data.cartItems);
        setCartSubtotal(data.orderTotal.cartSubtotal);
        data.isDelivered
          ? setIsDelivered(data.deliveredAt)
          : setIsDelivered(false);
        data.isPaid ? setIsPaid(data.paidAt) : setIsPaid(false);
        if (data.isPaid) {
          setOrderButtonMessage("Đơn hàng của bạn đã hoàn tất");
          setButtonDisabled(true);
        } else {
          if (data.paymentMethod === "pp") {
            setOrderButtonMessage("Thanh toán cho đơn đặt hàng của bạn");
          } else if (data.paymentMethod === "cod") {
            setButtonDisabled(true);
            setOrderButtonMessage("Chờ đơn đặt hàng của bạn. Bạn thanh toán khi giao hàng");
          }
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const orderHandler = () => {
    setButtonDisabled(true);
    if (paymentMethod === "pp") {
      setOrderButtonMessage(
        "Để thanh toán cho đơn hàng của bạn hãy nhấp vào một trong các nút bên dưới"
      );
      if (!isPaid) {
        loadPayPalScript(cartSubtotal, cartItems, id, updateStateAfterOrder);
      }
    } else {
      setOrderButtonMessage("Đơn đặt hàng của bạn đã được đặt. Cảm ơn");
    }
  };

  const updateStateAfterOrder = (paidAt) => {
    setOrderButtonMessage("Cảm ơn bạn đã thanh toán!");
    setIsPaid(paidAt);
    setButtonDisabled(true);
    paypalContainer.current.style = "display: none";
  };

  return (
    <Container fluid>
      <Row className="mt-4">
        <h1>Chi tiết đặt hàng</h1>
        <Col md={8}>
          <br />
          <Row>
            <Col md={6}>
              <h2>Thanh toán</h2>
              <b>Tên</b>: {userInfo.name} {userInfo.lastName} <br />
              <b>Địa chỉ</b>: {userAddress.address} {userAddress.city}{" "}
              {userAddress.state} {userAddress.zipCode} <br />
              <b>Số điện thoại</b>: {userAddress.phoneNumber}
            </Col>
            <Col md={6}>
              <h2>Phương thức thanh toán</h2>
              <Form.Select value={paymentMethod} disabled={true}>
                <option value="pp">PayPal</option>
                <option value="cod">
                  Thanh toán khi nhận hàng (giao hàng có thể bị chậm trễ)
                </option>
              </Form.Select>
            </Col>
            <Row>
              <Col>
                <Alert
                  className="mt-3"
                  variant={isDelivered ? "success" : "danger"}
                >
                  {isDelivered ? (
                    <>Đã giao hàng {isDelivered}</>
                  ) : (
                    <>Chưa giao</>
                  )}
                </Alert>
              </Col>
              <Col>
                <Alert className="mt-3" variant={isPaid ? "success" : "danger"}>
                  {isPaid ? <>Đã thanh toán {isPaid}</> : <>Chưa thanh toán</>}
                </Alert>
              </Col>
            </Row>
          </Row>
          <br />
          <h2>Đặt hàng các mặt hàng</h2>
          <ListGroup variant="flush">
            {cartItems.map((item, idx) => (
              <CartItemComponent item={item} key={idx} orderCreated={true} />
            ))}
          </ListGroup>
        </Col>
        <Col md={4}>
          <ListGroup>
            <ListGroup.Item>
              <h3>Tổng đặt hàng</h3>
            </ListGroup.Item>
            <ListGroup.Item>
            Giá mặt hàng (sau thuế):{" "}
              <span className="fw-bold">{formatter.format(cartSubtotal)}</span>
            </ListGroup.Item>
            <ListGroup.Item>
              Phí vận chuyển: <span className="fw-bold">Bao gồm</span>
            </ListGroup.Item>
            <ListGroup.Item>
              Thuế: <span className="fw-bold">Bao gồm</span>
            </ListGroup.Item>
            <ListGroup.Item className="text-danger">
              Tổng giá:{" "}
              <span className="fw-bold">{formatter.format(cartSubtotal)}</span>
            </ListGroup.Item>
            <ListGroup.Item>
              <div className="d-grid gap-2">
                <Button
                  size="lg"
                  onClick={orderHandler}
                  variant="danger"
                  type="button"
                  disabled={buttonDisabled}
                >
                  {orderButtonMessage}
                </Button>
              </div>
              <div style={{ position: "relative", zIndex: 1 }}>
                <div ref={paypalContainer} id="paypal-container-element"></div>
              </div>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default UserOrderDetailsPageComponent;
