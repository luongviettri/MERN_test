import EditProductPageComponent from './components/EditProductPageComponent';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { saveAttributeToCatDoc } from '../../redux/actions/categoryActions';
import { useDispatch } from 'react-redux';
import {
  uploadImagesApiRequest,
  uploadImagesCloudinaryApiRequest,
} from './utils/utils';
import { productService } from '../../services/productService';
import { trackPromise } from 'react-promise-tracker';
import catchAsync from '../../utils/catchAsync';

const fetchProduct = async (productId) => {
  const { data } = await trackPromise(productService.fetchProduct(productId));
  return data;
};

const updateProductApiRequest = catchAsync(async (productId, formInputs) => {
  const { data } = await trackPromise(
    productService.updateProduct(productId, formInputs)
  );
  return data;
});

const AdminEditProductPage = () => {
  const { categories } = useSelector((state) => state.getCategoriesReducer);

  const reduxDispatch = useDispatch();

  const imageDeleteHandler = async (imagePath, productId) => {
    let encodedImagePath = encodeURIComponent(imagePath);
    trackPromise(productService.deleteImage(encodedImagePath, productId));
  };

  return (
    <EditProductPageComponent
      categories={categories}
      fetchProduct={fetchProduct}
      updateProductApiRequest={updateProductApiRequest}
      reduxDispatch={reduxDispatch}
      saveAttributeToCatDoc={saveAttributeToCatDoc}
      imageDeleteHandler={imageDeleteHandler}
      uploadImagesApiRequest={uploadImagesApiRequest}
      uploadImagesCloudinaryApiRequest={uploadImagesCloudinaryApiRequest}
    />
  );
};

export default AdminEditProductPage;
