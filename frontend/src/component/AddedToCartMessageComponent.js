import { Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AddedToCartMessageComponent = ({ showCartMessage, setShowCartMessage }) => {
  const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    }

  return (
    <Alert
      show={showCartMessage}
      variant="success"
      onClose={() => setShowCartMessage(false)}
      dismissible
    >
      <Alert.Heading>Sản phẩm đã được thêm vào giỏ hàng của bạn!</Alert.Heading>
      <p>
        <Button variant="success" onClick={goBack}>Quay lại</Button>{" "}
        <Link to="/cart">
          <Button variant="danger">Giỏ hàng</Button>
        </Link>
      </p>
    </Alert>
  );
};

export default AddedToCartMessageComponent;

