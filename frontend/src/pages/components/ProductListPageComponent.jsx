import { Row, Col, Container, ListGroup, Button } from 'react-bootstrap';
import PaginationComponent from '../../components/PaginationComponent';
import ProductForListComponent from '../../components/ProductForListComponent';
import SortOptionsComponent from '../../components/SortOptionsComponent';
import PriceFilterComponent from '../../components/filterQueryResultOptions/PriceFilterComponent';
import RatingFilterComponent from '../../components/filterQueryResultOptions/RatingFilterComponent';
import CategoryFilterComponent from '../../components/filterQueryResultOptions/CategoryFilterComponent';
import AttributesFilterComponent from '../../components/filterQueryResultOptions/AttributesFilterComponent';
import { useMediaQuery } from 'react-responsive';
import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';

import catchAsync from '../../utils/catchAsync';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import EmptyListAnimation from '../../lotties/EmptyListAnimation';
import SkeletonProduct from '../../assets/skeletons/SkeletonProduct';
import SkeletonProductDetail from '../../assets/skeletons/SkeletonProductList';
import SkeletonProductList from '../../assets/skeletons/SkeletonProductList';
const ProductListPageComponent = ({ getProducts, categories }) => {
  const [products, setProducts] = useState([]);
  const [attrsFilter, setAttrsFilter] = useState([]); // collect category attributes from db and show on the webpage
  const [attrsFromFilter, setAttrsFromFilter] = useState([]); // collect user filters for category attributes
  const [showResetFiltersButton, setShowResetFiltersButton] = useState(false);
  const [filters, setFilters] = useState({}); // collect all filters
  const [price, setPrice] = useState(500);
  const [ratingsFromFilter, setRatingsFromFilter] = useState({});
  const [categoriesFromFilter, setCategoriesFromFilter] = useState({});
  const [sortOption, setSortOption] = useState('');
  const [paginationLinksNumber, setPaginationLinksNumber] = useState(null);
  const [pageNum, setPageNum] = useState(null);
  const { promiseInProgress } = usePromiseTracker();
  const { categoryName } = useParams() || '';
  const { pageNumParam } = useParams() || 1;
  const { searchQuery } = useParams() || '';
  const location = useLocation();
  const navigate = useNavigate();
  const isBiggerThanMobile = useMediaQuery({ query: '(min-width: 576px)' });
  const isMobile = useMediaQuery({ query: '(max-width: 575px)' });
  useEffect(() => {
    if (categoryName) {
      let categoryAllData = categories.find(
        (item) => item.name === categoryName.replace(/,/g, '/')
      );
      if (categoryAllData) {
        let mainCategory = categoryAllData.name.split('/')[0];
        let index = categories.findIndex((item) => item.name === mainCategory);
        setAttrsFilter(categories[index].attrs);
      }
    } else {
      setAttrsFilter([]);
    }
  }, [categoryName, categories]);

  useEffect(() => {
    if (Object.entries(categoriesFromFilter).length > 0) {
      setAttrsFilter([]);
      var cat = [];
      var count;
      Object.entries(categoriesFromFilter).forEach(([category, checked]) => {
        if (checked) {
          var name = category.split('/')[0];
          cat.push(name);
          count = cat.filter((x) => x === name).length;
          if (count === 1) {
            var index = categories.findIndex((item) => item.name === name);
            setAttrsFilter((attrs) => [...attrs, ...categories[index].attrs]);
          }
        }
      });
    }
  }, [categoriesFromFilter, categories]);

  useEffect(() => {
    handleGetProductsQuery(
      categoryName,
      pageNumParam,
      searchQuery,
      filters,
      sortOption
    );
  }, [categoryName, pageNumParam, searchQuery, filters, sortOption]);

  const handleGetProductsQuery = catchAsync(async () => {
    const { data: products } = await trackPromise(
      productService.getProductsQuery(
        categoryName,
        pageNumParam,
        searchQuery,
        filters,
        sortOption
      )
    );
    setProducts(products.products);
    setPaginationLinksNumber(products.paginationLinksNumber);
    setPageNum(products.pageNum);
  });

  const handleFilters = () => {
    navigate(location.pathname.replace(/\/[0-9]+$/, ''));
    setShowResetFiltersButton(true);
    setFilters({
      price: price,
      rating: ratingsFromFilter,
      category: categoriesFromFilter,
      attrs: attrsFromFilter,
    });
  };

  const resetFilters = () => {
    setShowResetFiltersButton(false);
    setFilters({});
    window.location.href = '/product-list';
  };

  const renderSearchBarDesktopOrLaptop = () => {
    return (
      <Col md={3}>
        <ListGroup variant="flush">
          <ListGroup.Item className="mb-3 mt-3">
            <SortOptionsComponent setSortOption={setSortOption} />
          </ListGroup.Item>
          <ListGroup.Item>
            FILTER: <br />
            <PriceFilterComponent price={price} setPrice={setPrice} />
          </ListGroup.Item>
          <ListGroup.Item>
            <RatingFilterComponent
              setRatingsFromFilter={setRatingsFromFilter}
            />
          </ListGroup.Item>
          {!location.pathname.match(/\/category/) && (
            <ListGroup.Item>
              <CategoryFilterComponent
                setCategoriesFromFilter={setCategoriesFromFilter}
              />
            </ListGroup.Item>
          )}
          <ListGroup.Item>
            <AttributesFilterComponent
              attrsFilter={attrsFilter}
              setAttrsFromFilter={setAttrsFromFilter}
            />
          </ListGroup.Item>
          <ListGroup.Item>
            <Button variant="primary" onClick={handleFilters}>
              Filter
            </Button>{' '}
            {showResetFiltersButton && (
              <Button onClick={resetFilters} variant="danger">
                Reset filters
              </Button>
            )}
          </ListGroup.Item>
        </ListGroup>
      </Col>
    );
  };

  const renderSearchBarMobileorTablet = () => {
    return <div></div>;
  };

  const renderEmptyList = () => {
    return <EmptyListAnimation />;
  };

  const renderSkeleton = () => {
    const myArray = [1, 2, 3, 4];
    return myArray.map((_, index) => {
      return <SkeletonProductList key={`index ${index}`} />;
    });
  };

  return (
    <Container fluid>
      <Row>
        {isBiggerThanMobile && renderSearchBarDesktopOrLaptop()}
        {isMobile && renderSearchBarMobileorTablet()}
        <Col>
          {products.length > 0
            ? products.map((product) => (
                <ProductForListComponent
                  key={product._id}
                  images={product.images}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  rating={product.rating}
                  reviewsNumber={product.reviewsNumber}
                  productId={product._id}
                />
              ))
            : promiseInProgress
            ? renderSkeleton()
            : renderEmptyList()}

          {paginationLinksNumber > 1 ? (
            <PaginationComponent
              categoryName={categoryName}
              searchQuery={searchQuery}
              paginationLinksNumber={paginationLinksNumber}
              pageNum={pageNum}
            />
          ) : null}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductListPageComponent;
