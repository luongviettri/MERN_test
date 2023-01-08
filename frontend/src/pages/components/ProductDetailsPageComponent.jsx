import {
  Row,
  Col,
  Container,
  Image,
  ListGroup,
  Form,
  Button,
  Alert,
} from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating';
import AddedToCartMessageComponent from '../../components/AddedToCartMessageComponent';

import ImageZoom from 'js-image-zoom';
import { useEffect, useState, useRef } from 'react';
import MetaComponent from '../../components/MetaComponent';

import { useParams } from 'react-router-dom';
import catchAsync from '../../utils/catchAsync';
import { productService } from '../../services/productService';
import { trackPromise } from 'react-promise-tracker';
import SkeletonProductDetail from '../../assets/skeletons/SkeletonProductDetail';

const ProductDetailsPageComponent = ({
  addToCartAction,
  dispatch,
  userInfo,
}) => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  // const [showCartMessage, setShowCartMessage] = useState(false);
  const [product, setProduct] = useState({});
  const [productReviewed, setProductReviewed] = useState(false);

  const messagesEndRef = useRef(null);

  const addToCartHandler = () => {
    dispatch(addToCartAction(id, quantity));
    // setShowCartMessage(true);
  };

  useEffect(() => {
    if (productReviewed) {
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
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

  const handleGetProductDetail = catchAsync(async (id) => {
    const { data: productDetail } = await trackPromise(
      productService.getProductDetail(id)
    );
    setProduct(productDetail);
  });

  const handleWriteReview = catchAsync(async (productID, formInputs) => {
    const { data } = await trackPromise(
      productService.writeReview(productID, formInputs)
    );
    if (data === 'review created') {
      setProductReviewed('You successfuly reviewed the page!');
    }
  });

  useEffect(() => {
    handleGetProductDetail(id);
  }, [id, productReviewed]);

  const sendReviewHandler = (e) => {
    e.preventDefault();
    const form = e.currentTarget.elements;
    const formInputs = {
      comment: form.comment.value,
      rating: form.rating.value,
    };
    if (e.currentTarget.checkValidity() === true) {
      handleWriteReview(product._id, formInputs);
    }
  };

  const renderSkeleton = () => {
    return <SkeletonProductDetail />;
  };
  function isEmpty(obj) {
    for (var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }

    return JSON.stringify(obj) === JSON.stringify({});
  }
  console.log(isEmpty(product));
  return (
    <>
      <MetaComponent title={product.name} description={product.description} />
      <Container>
        <Row className="mt-5">
          {!isEmpty(product) && (
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
                        />{' '}
                        ({product.reviewsNumber})
                      </ListGroup.Item>
                      <ListGroup.Item>
                        Price <span className="fw-bold">${product.price}</span>
                      </ListGroup.Item>
                      <ListGroup.Item>{product.description}</ListGroup.Item>
                    </ListGroup>
                  </Col>
                  <Col md={4}>
                    <ListGroup>
                      <ListGroup.Item>
                        Status:{' '}
                        {product.count > 0 ? 'in stock' : 'out of stock'}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        Price: <span className="fw-bold">${product.price}</span>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        Quantity:
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
                          Add to cart
                        </Button>
                      </ListGroup.Item>
                    </ListGroup>
                  </Col>
                </Row>
                <Row>
                  <Col className="mt-5">
                    <h5>REVIEWS</h5>
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
                  <Alert variant="danger">Login first to write a review</Alert>
                )}

                <Form onSubmit={sendReviewHandler}>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Write a review</Form.Label>
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
                    <option value="">Your rating</option>
                    <option value="5">5 (very good)</option>
                    <option value="4">4 (good)</option>
                    <option value="3">3 (average)</option>
                    <option value="2">2 (bad)</option>
                    <option value="1">1 (awful)</option>
                  </Form.Select>
                  <Button
                    disabled={!userInfo.name}
                    type="submit"
                    className="mb-3 mt-3"
                    variant="primary"
                  >
                    Submit
                  </Button>{' '}
                  {productReviewed}
                </Form>
              </Col>
            </>
          )}
          {isEmpty(product) && renderSkeleton()}
        </Row>
      </Container>
    </>
  );
};

export default ProductDetailsPageComponent;
