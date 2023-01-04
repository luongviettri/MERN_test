import React from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import catchAsync from '../../utils/catchAsync';
import { authenService } from '../../services/authenService';
import { saveUserInformation } from '../../utils/authenUtils';
import { trackPromise } from 'react-promise-tracker';

export default function LoginPageComponent({ dispatch, loginAction }) {
  const [validated, setValidated] = useState(false);
  const [loginUserResponseState, setLoginUserResponseState] = useState({
    success: '',
    error: '',
    loading: false,
  });

  const handleLoginUser = catchAsync(async (email, password, doNotLogout) => {
    //! gửi thông tin lên backend yêu cầu login
    const { data } = await trackPromise(
      authenService.login(email, password, doNotLogout)
    );
    //! lưu dữ liệu user lên browser
    saveUserInformation(data);
    //! set lại các giá trị loading và success
    setLoginUserResponseState({
      ...loginUserResponseState,
      loading: false,
      success: data.success,
    });
    //! gửi thông tin lên redux để lưu lại dữ liệu sử dụng sau này
    if (data.userLoggedIn) {
      dispatch(loginAction(data.userLoggedIn));
    }
    //! sau đó load lại web
    if (data.success === 'user logged in' && !data.userLoggedIn.isAdmin) {
      window.location.href = '/user';
    } else {
      window.location.href = '/admin/orders';
    }
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget.elements;

    const email = form.email.value;
    const password = form.password.value;
    const doNotLogout = form.doNotLogout.checked;
    if (event.currentTarget.checkValidity() === true && email && password) {
      setLoginUserResponseState({ ...loginUserResponseState, loading: true });
      handleLoginUser(email, password, doNotLogout);
    }

    setValidated(true);
  };
  return (
    <Container>
      <Row className="mt-5 justify-content-md-center">
        <Col md={6}>
          <h1>Login</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                name="email"
                required
                type="email"
                placeholder="Enter email"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                required
                type="password"
                placeholder="Password"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check
                name="doNotLogout"
                type="checkbox"
                label="Do not logout"
              />
            </Form.Group>

            <Row className="pb-2">
              <Col>
                Don't you have an account?
                <Link to={'/register'}> Register </Link>
              </Col>
            </Row>

            <Button variant="primary" type="submit">
              {/* {loginUserResponseState &&
              loginUserResponseState.loading === true ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                ''
              )} */}
              Login
            </Button>
            <Alert
              show={
                loginUserResponseState &&
                loginUserResponseState.error === 'wrong credentials'
              }
              variant="danger"
            >
              Wrong credentials
            </Alert>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
