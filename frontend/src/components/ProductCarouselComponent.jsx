import { Carousel } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import MediaQuery from 'react-responsive';
const ProductCarouselComponent = ({ bestSellers }) => {
  const cursorP = {
    cursor: 'pointer',
  };

  return bestSellers.length > 0 ? (
    <Carousel>
      {bestSellers.map((item, idx) => (
        <Carousel.Item key={idx}>
          <img
            crossOrigin="anonymous"
            className="d-block w-100"
            style={{ height: '300px', objectFit: 'cover' }}
            src={item.images ? item.images[0].path : null}
            alt="First slide"
          />
          <Carousel.Caption>
            <LinkContainer style={cursorP} to={`/product-details/${item._id}`}>
              <h3
              // style={{
              //   fontSize: '1000vw',
              // }}
              >
                Bestseller in {item.category} Category
              </h3>
            </LinkContainer>
            <MediaQuery minWidth={720}>
              <p>{item.description}</p>
            </MediaQuery>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  ) : null;
};

export default ProductCarouselComponent;
