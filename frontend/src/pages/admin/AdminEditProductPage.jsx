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

const fetchProduct = async (productId) => {
  const { data } = await trackPromise(productService.fetchProduct(productId));
  return data;
};

const updateProductApiRequest = async (productId, formInputs) => {
  const { data } = await trackPromise(
    productService.updateProduct(productId, formInputs)
  );
  return data;
};

const AdminEditProductPage = () => {
  const { categories } = useSelector((state) => state.getCategories);

  const reduxDispatch = useDispatch();

  const imageDeleteHandler = async (imagePath, productId) => {
    let encoded = encodeURIComponent(imagePath);
    if (process.env.NODE_ENV === 'production') {
      //todo: tí nữa change to !==
      await axios.delete(`/api/products/admin/image/${encoded}/${productId}`);
    } else {
      await axios.delete(
        `/api/products/admin/image/${encoded}/${productId}?cloudinary=true`
      );
    }
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
