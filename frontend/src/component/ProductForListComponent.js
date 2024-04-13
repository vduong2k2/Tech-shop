import { Card, Button, Row, Col } from "react-bootstrap";
import { Rating } from "react-simple-star-rating";
import { LinkContainer } from "react-router-bootstrap";

const formatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const ProductForListComponent = ({
  productId,
  name,
  description,
  price,
  images,
  rating,
  reviewsNumber,
}) => {
  return (
    <Card style={{ marginBottom: "30px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
      <Row>
        <Col lg={5} md={12} sm={12}>
          <Card.Img
            crossOrigin="anonymous"
            variant="top"
            src={images[0] ? images[0].path : ""}
            style={{ height: "100%", objectFit: "cover" }}
          />
        </Col>
        <Col lg={7} md={12} sm={12}>
          <Card.Body>
            <Card.Title>{name}</Card.Title>
            <Card.Text>{description}</Card.Text>
            <Row>
              <Col xs={6}>
                <Card.Text>
                  <Rating readonly size={20} initialValue={rating} /> ({reviewsNumber})
                </Card.Text>
              </Col>
              <Col xs={6} className="text-right">
                <Card.Text className="h4">{formatter.format(price)}</Card.Text>
              </Col>
            </Row>
            <Row>
              <Col>
                <LinkContainer to={`/product-details/${productId}`}>
                  <Button variant="danger" block>Xem Sản Phẩm</Button>
                </LinkContainer>
              </Col>
            </Row>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default ProductForListComponent;