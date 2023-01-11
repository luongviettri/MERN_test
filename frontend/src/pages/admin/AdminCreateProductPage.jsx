import CreateProductPageComponent from './components/CreateProductPageComponent';
import axios from 'axios';
import {
  uploadImagesApiRequest,
  uploadImagesCloudinaryApiRequest,
} from './utils/utils';
import { useSelector } from 'react-redux';
import {
  newCategory,
  deleteCategory,
  saveAttributeToCatDoc,
} from '../../redux/actions/categoryActions';
import { useDispatch } from 'react-redux';
import { productService } from '../../services/productService';
import { trackPromise } from 'react-promise-tracker';

const createProductApiRequest = async (formInputs) => {
  const { data } = await trackPromise(productService.createProduct(formInputs));

  return data;
};

const AdminCreateProductPage = () => {
  const { categories } = useSelector((state) => state.getCategoriesReducer);
  const dispatch = useDispatch();
  return (
    <CreateProductPageComponent
      createProductApiRequest={createProductApiRequest}
      uploadImagesApiRequest={uploadImagesApiRequest}
      uploadImagesCloudinaryApiRequest={uploadImagesCloudinaryApiRequest}
      categories={categories}
      reduxDispatch={dispatch}
      newCategory={newCategory}
      deleteCategory={deleteCategory}
      saveAttributeToCatDoc={saveAttributeToCatDoc}
    />
  );
};

export default AdminCreateProductPage;
