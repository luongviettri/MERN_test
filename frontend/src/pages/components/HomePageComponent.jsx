import ProductCarouselComponent from '../../components/ProductCarouselComponent';
import CategoryCardComponent from '../../components/CategoryCardComponent';
import { Row, Container, Col } from 'react-bootstrap';

import { useEffect, useState } from 'react';
import MetaComponent from '../../components/MetaComponent';
import catchAsync from '../../utils/catchAsync';
import { productService } from '../../services/productService';
import { trackPromise } from 'react-promise-tracker';

const HomePageComponent = ({ categories }) => {
  const [mainCategories, setMainCategories] = useState([]);
  const [bestSellers, setBestsellers] = useState([]);

  const handleGetBestSeller = catchAsync(async () => {
    const { data } = await trackPromise(productService.getBestsellers());
    setBestsellers(data);
  });

  const handleMainCategory = (category) => {
    const MainCateogry = categories.filter((item) => {
      const mainItem = !item.name.includes('/');
      return mainItem;
    });
    setMainCategories(MainCateogry);
  };

  useEffect(() => {
    handleGetBestSeller();
    handleMainCategory();
  }, [categories]);

  return (
    <>
      <MetaComponent />
      <ProductCarouselComponent bestSellers={bestSellers} />
      <Container>
        <Row xs={1} md={2} className="g-4 mt-5 ">
          {mainCategories.map((category, idx) => (
            <CategoryCardComponent key={idx} category={category} idx={idx} />
          ))}
        </Row>
      </Container>
    </>
  );
};

export default HomePageComponent;
