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

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

const formatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
const UserCartDetailsPageComponent = ({
  cartItems,
  itemsCount,
  cartSubtotal,
  userInfo,
  addToCart,
  removeFromCart,
  reduxDispatch,
  getUser,
  createOrder,
}) => {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [userAddress, setUserAddress] = useState(false);
  const [missingAddress, setMissingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("pp");

  const navigate = useNavigate();

  const changeCount = (productID, count) => {
    reduxDispatch(addToCart(productID, count));
  };

  const removeFromCartHandler = (productID, quantity, price) => {
    if (window.confirm("Are you sure?")) {
      reduxDispatch(removeFromCart(productID, quantity, price));
    }
  };

  useEffect(() => {
    getUser()
      .then((data) => {
        if (
          !data.address ||
          !data.city ||
          !data.country ||
          !data.zipCode ||
          !data.state ||
          !data.phoneNumber
        ) {
          setButtonDisabled(true);
          setMissingAddress(
            " Để đặt hàng, hãy điền vào hồ sơ của bạn địa chỉ chính xác, thành phố, v.v."
          );
        } else {
          setUserAddress({
            address: data.address,
            city: data.city,
            country: data.country,
            zipCode: data.zipCode,
            state: data.state,
            phoneNumber: data.phoneNumber,
          });
          setMissingAddress(false);
        }
      })
      .catch((er) =>
        console.log(
          er.response.data.message ? er.response.data.message : er.response.data
        )
      );
  }, [userInfo._id]);

  const orderHandler = () => {
    const orderData = {
      orderTotal: {
        itemsCount: itemsCount,
        cartSubtotal: cartSubtotal,
      },
      cartItems: cartItems.map((item) => {
        return {
          productID: item.productID,
          name: item.name,
          price: item.price,
          image: { path: item.image ? item.image.path ?? null : null },
          quantity: item.quantity,
          count: item.count,
        };
      }),
      paymentMethod: paymentMethod,
    };
    createOrder(orderData)
      .then((data) => {
        if (data) {
          navigate("/user/order-details/" + data._id);
        }
      })
      .catch((err) => console.log(err));
  };

  const choosePayment = (e) => {
    setPaymentMethod(e.target.value);
  };

  return (
    <Container fluid>
      <Row className="mt-4">
        <h1>Chi tiết giỏ hàng</h1>
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
              <Form.Select onChange={choosePayment}>
                <option value="pp">PayPal</option>
                <option value="cod">
                  Thanh toán khi nhận hàng (giao hàng có thể bị chậm trễ)
                </option>
              </Form.Select>
            </Col>
            <Row>
              <Col>
                <Alert className="mt-3" variant="danger">
                  Chưa giao
                  {missingAddress}
                </Alert>
              </Col>
              <Col>
                <Alert className="mt-3" variant="success">
                  Chưa thanh toán
                </Alert>
              </Col>
            </Row>
          </Row>
          <br />
          <h2>Đặt hàng các mặt hàng</h2>
          <ListGroup variant="flush">
            {cartItems.map((item, idx) => (
              <CartItemComponent
                item={item}
                key={idx}
                removeFromCartHandler={removeFromCartHandler}
                changeCount={changeCount}
              />
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
              Tổng giá: <span className="fw-bold">{formatter.format(cartSubtotal)}</span>
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
                  Đặt hàng
                </Button>
              </div>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default UserCartDetailsPageComponent;
