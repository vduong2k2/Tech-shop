import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";

const UserProfilePageComponent = ({
  updateUserApiRequest,
  fetchUser,
  userInfoFromRedux,
  setReduxUserState,
  reduxDispatch,
  localStorage,
  sessionStorage,
}) => {
  const [validated, setValidated] = useState(false);
  const [updateUserResponseState, setUpdateUserResponseState] = useState({
    success: "",
    error: "",
  });
  const [passwordsMatchState, setPasswordsMatchState] = useState(true);
  const [user, setUser] = useState({});
  const userInfo = userInfoFromRedux;

  useEffect(() => {
    fetchUser(userInfo._id)
      .then((data) => setUser(data))
      .catch((er) => console.log(er));
  }, [userInfo._id]);

  const onChange = () => {
    const password = document.querySelector("input[name=password]");
    const confirmPassword = document.querySelector(
      "input[name=confirmPassword]"
    );
    if (confirmPassword.value === password.value) {
      setPasswordsMatchState(true);
    } else {
      setPasswordsMatchState(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget.elements;

    const name = form.name.value;
    const lastName = form.lastName.value;
    const phoneNumber = form.phoneNumber.value;
    const address = form.address.value;
    const country = form.country.value;
    const zipCode = form.zipCode.value;
    const city = form.city.value;
    const state = form.state.value;
    const password = form.password.value;

    if (
      event.currentTarget.checkValidity() === true &&
      form.password.value === form.confirmPassword.value
    ) {
      updateUserApiRequest(
        name,
        lastName,
        phoneNumber,
        address,
        country,
        zipCode,
        city,
        state,
        password
      )
        .then((data) => {
          setUpdateUserResponseState({ success: data.success, error: "" });
          reduxDispatch(
            setReduxUserState({
              doNotLogout: userInfo.doNotLogout,
              ...data.userUpdated,
            })
          );
          if (userInfo.doNotLogout)
            localStorage.setItem(
              "userInfo",
              JSON.stringify({ doNotLogout: true, ...data.userUpdated })
            );
          else
            sessionStorage.setItem(
              "userInfo",
              JSON.stringify({ doNotLogout: false, ...data.userUpdated })
            );
        })
        .catch((er) =>
          setUpdateUserResponseState({
            error: er.response.data.message
              ? er.response.data.message
              : er.response.data,
          })
        );
    }

    setValidated(true);
  };
  return (
    <Container>
      <Row className="mt-5 justify-content-md-center">
        <Col md={6}>
          <h1>Thay đổi hồ sơ của bạn</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="validationCustom01">
              <Form.Label>Tên của bạn</Form.Label>
              <Form.Control
                required
                type="text"
                defaultValue={user.name}
                name="name"
              />
              <Form.Control.Feedback type="invalid">
                Nhập tên
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicLastName">
              <Form.Label>Tên đệm của bạn</Form.Label>
              <Form.Control
                required
                type="text"
                defaultValue={user.lastName}
                name="lastName"
              />
              <Form.Control.Feedback type="invalid">
                Nhập tên đệm của bạn
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                disabled
                value={
                  user.email +
                  "   (Nếu bạn muốn thay đổi email, hãy xóa tài khoản và tạo tài khoản mới với địa chỉ email mới)"
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPhone">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập số điện thoại của bạn"
                defaultValue={user.phoneNumber}
                name="phoneNumber"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicAddress">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên đường và số nhà của bạn"
                defaultValue={user.address}
                name="address"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCountry">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập quốc gia của bạn"
                defaultValue={user.country}
                name="country"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicZip">
              <Form.Label>Zip Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập mã zip của bạn"
                defaultValue={user.zipCode}
                name="zipCode"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCity">
              <Form.Label>Thành phố</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập thành phố của bạn"
                defaultValue={user.city}
                name="city"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicState">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your state"
                defaultValue={user.state}
                name="state"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                name="password"
                required
                type="password"
                placeholder="Password"
                minLength={6}
                onChange={onChange}
                isInvalid={!passwordsMatchState}
              />
              <Form.Control.Feedback type="invalid">
                Vui lòng nhập mật khẩu hợp lệ
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Mật khẩu phải có ít nhất 6 ký tự
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPasswordRepeat">
              <Form.Label>Nhập lại mật khẩu</Form.Label>
              <Form.Control
                name="confirmPassword"
                required
                type="password"
                placeholder="Nhập lại mật khẩu"
                minLength={6}
                onChange={onChange}
                isInvalid={!passwordsMatchState}
              />
              <Form.Control.Feedback type="invalid">
                Cả hai mật khẩu phải khớp nhau
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit">
              Cập nhật
            </Button>
            <Alert
              show={
                updateUserResponseState && updateUserResponseState.error !== ""
              }
              variant="danger"
            >
              Đã xảy ra lỗi
            </Alert>
            <Alert
              show={
                updateUserResponseState &&
                updateUserResponseState.success === "user updated"
              }
              variant="info"
            >
              Người dùng đã được cập nhật
            </Alert>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfilePageComponent;
