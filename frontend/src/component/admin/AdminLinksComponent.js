import { Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import { logout } from "../../redux/actions/userActions";
import { useDispatch } from "react-redux";

const AdminLinksComponent = () => {
  const dispatch = useDispatch();
  return (
    <Navbar bg="light" variant="light">
      <Nav className="flex-column">
        <LinkContainer to="/admin/orders">
          <Nav.Link>Các đơn hàng</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/admin/products">
          <Nav.Link>Các sản phẩm</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/admin/users">
          <Nav.Link>Người dùng</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/admin/chats">
          <Nav.Link>Chats</Nav.Link>
        </LinkContainer>
        {/* <LinkContainer to="/admin/analytics">
          <Nav.Link>Analytics</Nav.Link>
        </LinkContainer> */}
        <Nav.Link onClick={() => dispatch(logout())}>Đăng xuất</Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default AdminLinksComponent;
