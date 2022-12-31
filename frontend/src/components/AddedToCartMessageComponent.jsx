import { Alert, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const AddedToCartMessageComponent = ({
  showCartMessage,
  setShowCartMessage,
}) => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  return (
    <Alert
      show={showCartMessage}
      variant="success"
      onClose={() => setShowCartMessage(false)}
      dismissible
    >
      <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
      <p>
        <Button variant="success" onClick={goBack}>
          Go back
        </Button>{' '}
        <Link to="/cart">
          <Button variant="danger">Go to cart</Button>
        </Link>
      </p>
    </Alert>
  );
};

export default AddedToCartMessageComponent;
