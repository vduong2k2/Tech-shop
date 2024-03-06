import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
const RegisterPageComponent = ({
  registerUserApiRequest,
  reduxDispatch,
  setReduxUserState,
}) => {
  const [validated, setValidated] = useState(false);
  const [registerUserResponseState, setRegisterUserResponseState] = useState({
    success: "",
    error: "",
    loading: false,
  });
  const [passwordsMatchState, setPasswordsMatchState] = useState(true);

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
    const email = form.email.value;
    const name = form.name.value;
    const lastName = form.lastName.value;
    const password = form.password.value;
    if (
      event.currentTarget.checkValidity() === true &&
      email &&
      password &&
      name &&
      lastName &&
      form.password.value === form.confirmPassword.value
    ) {
      setRegisterUserResponseState({ loading: true });
      registerUserApiRequest(name, lastName, email, password)
        .then((data) => {
          setRegisterUserResponseState({
            success: data.success,
            loading: false,
          });
          reduxDispatch(setReduxUserState(data.userCreated));
        })
        .catch((er) =>
          setRegisterUserResponseState({
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
          <h1>Đăng ký tài khoản</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="validationCustom01">
              <Form.Label>Tên của bạn</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Nhập tên"
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
                placeholder="Nhập tên đệm"
                name="lastName"
              />
              <Form.Control.Feedback type="invalid">
                Nhập tên đệm
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                required
                type="email"
                placeholder="Địa chỉ email"
              />
              <Form.Control.Feedback type="invalid">
                Nhập địa chỉ email hợp lệ
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                name="password"
                required
                type="password"
                placeholder="Mật khẩu"
                minLength={6}
                onChange={onChange}
                isInvalid={!passwordsMatchState}
              />
              <Form.Control.Feedback type="invalid">
                Nhập mật khẩu hợp lệ
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Mật khẩu nên chứa ít nhất 6 ký tự
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
                Yêu cầu nhập đúng với mật khẩu ở trên
              </Form.Control.Feedback>
            </Form.Group>

            <Row className="pb-2">
              <Col>
                Bạn đã có tài khoản rồi?
                <Link to={"/login"}> Login </Link>
              </Col>
            </Row>

            <Button type="submit">
              {registerUserResponseState &&
              registerUserResponseState.loading === true ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                ""
              )}
              Đăng ký
            </Button>
            <Alert
              show={
                registerUserResponseState &&
                registerUserResponseState.error === "user exists"
              }
              variant="danger"
            >
              Email đã tồn tại
            </Alert>
            <Alert
              show={
                registerUserResponseState &&
                registerUserResponseState.success === "User created"
              }
              variant="info"
            >
              Đăng ký thành công!
            </Alert>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPageComponent;
