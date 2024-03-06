import {
  Row,
  Col,
  Container,
  Image,
  ListGroup,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { Rating } from "react-simple-star-rating";
import AddedToCartMessageComponent from "../../component/AddedToCartMessageComponent";

import ImageZoom from "js-image-zoom";
import { useEffect, useState, useRef } from "react";

import { useParams } from "react-router-dom";

const formatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});
const ProductDetailsPageComponent = ({
  addToCartReduxAction,
  reduxDispatch,
  getProductDetails,
  userInfo,
  writeReviewApiRequest,
}) => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [showCartMessage, setShowCartMessage] = useState(false);
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [productReviewed, setProductReviewed] = useState(false);

  const messagesEndRef = useRef(null);

  const addToCartHandler = () => {
    reduxDispatch(addToCartReduxAction(id, quantity));
    setShowCartMessage(true);
  };

  useEffect(() => {
    if (productReviewed) {
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }, [productReviewed]);

  useEffect(() => {
    if (product.images) {
      var options = {
        // width: 400,
        // zoomWidth: 500,
        // fillContainer: true,
        // zoomPosition: "bottom",
        scale: 2,
        offset: { vertical: 0, horizontal: 0 },
      };

      product.images.map(
        (image, id) =>
          new ImageZoom(document.getElementById(`imageId${id + 1}`), options)
      );
    }
  });

  useEffect(() => {
    getProductDetails(id)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((er) =>
        setError(
          er.response.data.message ? er.response.data.message : er.response.data
        )
      );
  }, [id, productReviewed]);

  const sendReviewHandler = (e) => {
    e.preventDefault();
    const form = e.currentTarget.elements;
    const formInputs = {
      comment: form.comment.value,
      rating: form.rating.value,
    };
    if (e.currentTarget.checkValidity() === true) {
      writeReviewApiRequest(product._id, formInputs)
        .then((data) => {
          if (data === "review created") {
            setProductReviewed("You successfuly reviewed the page!");
          }
        })
        .catch((er) =>
          setProductReviewed(
            er.response.data.message
              ? er.response.data.message
              : er.response.data
          )
        );
    }
  };

  return (
    <Container>
      <AddedToCartMessageComponent
        showCartMessage={showCartMessage}
        setShowCartMessage={setShowCartMessage}
      />
      <Row className="mt-5">
        {loading ? (
          <h2>Chi tiết sản phẩm ...</h2>
        ) : error ? (
          <h2>{error}</h2>
        ) : (
          <>
            <Col style={{ zIndex: 1 }} md={4}>
              {product.images
                ? product.images.map((image, id) => (
                    <div key={id}>
                      <div key={id} id={`imageId${id + 1}`}>
                        <Image
                          crossOrigin="anonymous"
                          fluid
                          src={`${image.path ?? null}`}
                        />
                      </div>
                      <br />
                    </div>
                  ))
                : null}
            </Col>
            <Col md={8}>
              <Row>
                <Col md={8}>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <h1>{product.name}</h1>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Rating
                        readonly
                        size={20}
                        initialValue={product.rating}
                      />{" "}
                      ({product.reviewsNumber})
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Giá{" "}
                      <span className="fw-bold">
                        {formatter.format(product.price)}
                      </span>
                    </ListGroup.Item>
                    <ListGroup.Item>{product.description}</ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col md={4}>
                  <ListGroup>
                    <ListGroup.Item>
                      Trạng thái: {product.count > 0 ? "Còn hàng" : "Hết hàng"}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Giá:{" "}
                      <span className="fw-bold">
                        {formatter.format(product.price)}
                      </span>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Số lượng:
                      <Form.Select
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        size="lg"
                        aria-label="Default select example"
                      >
                        {[...Array(product.count).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Select>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Button onClick={addToCartHandler} variant="danger">
                        Thêm vào giỏ hàng
                      </Button>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
              <Row>
                <Col className="mt-5">
                  <h5>Nhận Xét</h5>
                  <ListGroup variant="flush">
                    {product.reviews &&
                      product.reviews.map((review, idx) => (
                        <ListGroup.Item key={idx}>
                          {review.user.name} <br />
                          <Rating
                            readonly
                            size={20}
                            initialValue={review.rating}
                          />
                          <br />
                          {review.createdAt.substring(0, 10)} <br />
                          {review.comment}
                        </ListGroup.Item>
                      ))}
                    <div ref={messagesEndRef} />
                  </ListGroup>
                </Col>
              </Row>
              <hr />
              {!userInfo.name && (
                <Alert variant="danger">Đăng nhập trước để viết đánh giá</Alert>
              )}

              <Form onSubmit={sendReviewHandler}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Viết đánh giá</Form.Label>
                  <Form.Control
                    name="comment"
                    required
                    as="textarea"
                    disabled={!userInfo.name}
                    rows={3}
                  />
                </Form.Group>
                <Form.Select
                  name="rating"
                  required
                  disabled={!userInfo.name}
                  aria-label="Default select example"
                >
                  <option value="">Đánh giá của bạn</option>
                  <option value="5">5 (Rất tốt)</option>
                  <option value="4">4 (Tốt)</option>
                  <option value="3">3 (Trung bình)</option>
                  <option value="2">2 (Tệ)</option>
                  <option value="1">1 (Quá tệ)</option>
                </Form.Select>
                <Button
                  disabled={!userInfo.name}
                  type="submit"
                  className="mb-3 mt-3"
                  variant="primary"
                >
                  Submit
                </Button>{" "}
                {productReviewed}
              </Form>
            </Col>
          </>
        )}
      </Row>
    </Container>
  );
};

export default ProductDetailsPageComponent;
