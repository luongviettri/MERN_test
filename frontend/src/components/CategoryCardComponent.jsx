import { Card, Button, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useMediaQuery } from 'react-responsive';
const CategoryCardComponent = ({ category, idx }) => {
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1224px)',
  });
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });

  const renderComponentInDeskTopOrLaptop = () => {
    return (
      <>
        <div
          style={{
            height: '22rem',
          }}
        >
          <Card.Img
            crossOrigin="anonymous"
            variant="top"
            src={category.image ?? 'https://picsum.photos/200'}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          />
        </div>

        <Card.Body>
          <Card.Title>{category.name}</Card.Title>
          <Card.Text>{category.description}</Card.Text>
          <Button variant="primary">Go to the Category</Button>
        </Card.Body>
      </>
    );
  };

  const renderComponentInMobileOrTablet = () => {
    return (
      <Card.Body
        style={{
          backgroundImage: `url(${category.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          // minHeight: '20rem',
        }}
      >
        <Card.Title style={{ color: 'white', marginTop: '10rem' }}>
          {category.name}
        </Card.Title>
        {/* <Card.Text style={{ color: 'white' }}>{category.description}</Card.Text> */}
        <Button variant="primary">Go to the Category</Button>
      </Card.Body>
    );
  };

  return (
    <Col>
      <LinkContainer to={`/product-list/category/${category.name}`}>
        <Card
          border="light"
          className="hover-shadow neumorphirsm"
          role="button"
        >
          {isDesktopOrLaptop && renderComponentInDeskTopOrLaptop()}
          {isTabletOrMobile && renderComponentInMobileOrTablet()}
        </Card>
      </LinkContainer>
    </Col>
  );
};

export default CategoryCardComponent;
