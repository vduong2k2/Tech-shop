import { Container, Row, Col, Alert, ListGroup, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import CartItemComponent from "../../component/CartItemComponent";

const formatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});
const CartPageComponent = ({
  addToCart,
  removeFromCart,
  cartItems,
  cartSubtotal,
  reduxDispatch,
}) => {
  const changeCount = (productID, count) => {
    reduxDispatch(addToCart(productID, count));
  };

  const removeFromCartHandler = (productID, quantity, price) => {
    if (window.confirm("Are you sure?")) {
      reduxDispatch(removeFromCart(productID, quantity, price));
    }
  };

  return (
    <Container fluid>
      <Row className="mt-4">
        <Col md={8}>
          <h1>Giở hàng của bạn</h1>
          {cartItems.length === 0 ? (
            <Alert variant="info">
              Không có sản phẩm trong giở hàng của bạn!
            </Alert>
          ) : (
            <ListGroup variant="flush">
              {cartItems.map((item, idx) => (
                <CartItemComponent
                  item={item}
                  key={idx}
                  changeCount={changeCount}
                  removeFromCartHandler={removeFromCartHandler}
                />
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <ListGroup>
            <ListGroup.Item>
              <h3>
                Tổng ({cartItems.length}{" "}
                {cartItems.length === 1 ? "Sản Phẩm" : "Sản Phẩm"})
              </h3>
            </ListGroup.Item>
            <ListGroup.Item>
              Giá:{" "}
              <span className="fw-bold">{formatter.format(cartSubtotal)}</span>
            </ListGroup.Item>
            <ListGroup.Item>
              <LinkContainer to="/user/cart-details">
                <Button disabled={cartSubtotal === 0} type="button">
                  Tiến hành thanh toán
                </Button>
              </LinkContainer>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPageComponent;
