import {
  Row,
  Col,
  Container,
  Form,
  Button,
  CloseButton,
  Table,
  Alert,
  Image,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import React, { useState, useEffect, Fragment, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const onHover = {
  cursor: 'pointer',
  position: 'absolute',
  left: '5px',
  top: '-10px',
  transform: 'scale(2.7)',
};

export default function EditProductPageComponent({
  categories,
  fetchProduct,
  updateProductApiRequest,
}) {
  const [attributesFromDb, setAttributesFromDb] = useState([]);
  const [attributesTable, setAttributesTable] = useState([]); //! dùng cái này cho bảng

  const attrVal = useRef(null);
  const attrKey = useRef(null);

  const [validated, setValidated] = useState(false);
  const [product, setProduct] = useState({});
  const [updateProductResponseState, setUpdateProductResponseState] = useState({
    message: '',
    error: '',
  });
  const [categoryChoosen, setCategoryChoosen] = useState('Choose category');

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    fetchProduct(id)
      .then((product) => setProduct(product))
      .catch((er) => console.log(er));
  }, [id]);
  //! useEffect này để set attributes lên page
  useEffect(() => {
    let categoryOfEditedProduct = categories.find((item) => {
      //! trả về nguyên 1 item category
      return item.name === product.category;
    });

    if (categoryOfEditedProduct) {
      //! chỉ lấy kí tự kí tự main, ví dụ computers/laptops/dell--> chỉ lấy computers
      const mainCategoryOfEditedProduct =
        categoryOfEditedProduct.name.split('/')[0];
      //! lấy về các attribute của main Category để hiển thị lên page
      const mainCategoryOfEditedProductAllData = categories.find(
        (categoryOfEditedProduct) =>
          categoryOfEditedProduct.name === mainCategoryOfEditedProduct
      );
      //! cài hiển thị lên page = state
      if (
        mainCategoryOfEditedProductAllData &&
        mainCategoryOfEditedProductAllData.attrs.length > 0
      ) {
        setAttributesFromDb(mainCategoryOfEditedProductAllData.attrs);
      }
    }
    setCategoryChoosen(product.category);
    setAttributesTable(product.attrs);
  }, [product]);

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget.elements;

    const formInputs = {
      name: form.name.value,
      description: form.description.value,
      count: form.count.value,
      price: form.price.value,
      category: form.category.value,
      attributesTable: attributesTable,
    };

    if (event.currentTarget.checkValidity() === true) {
      updateProductApiRequest(id, formInputs)
        .then((data) => {
          if (data.message === 'product updated') navigate('/admin/products');
        })
        .catch((er) =>
          setUpdateProductResponseState({
            error: er.response.data.message
              ? er.response.data.message
              : er.response.data,
          })
        );
    }

    setValidated(true);
  };
  //! hàm xử lý lấy values của từng key
  const setValuesForAttrFromDbSelectForm = (e) => {
    if (e.target.value !== 'Choose attribute') {
      //! ở trên đã lấy ra được keys của attributes, giờ sẽ lấy ra values của từng key, lặp để chọn ra key cụ thể
      let selectedAttr = attributesFromDb.find(
        (item) => item.key === e.target.value
      );
      //! tham chiếu đến useRef attrVal
      let valuesForAttrKeys = attrVal.current;

      //! kiểm tra ví dụ color có các value như xanh, đỏ, vàng --> thì xử lý in ra
      if (selectedAttr && selectedAttr.value.length > 0) {
        //2: nếu như bên attribute value có các options của key trước đó rồi thì phải xóa các values này đi

        while (valuesForAttrKeys.options.length) {
          valuesForAttrKeys.remove(0);
        }
        //2: sau đó tạo các thẻ options = câu lệnh js
        //3: tạo thẻ choose attribute value trước
        //3: tạo các value còn lại sau

        valuesForAttrKeys.options.add(new Option('Choose attribute value'));
        selectedAttr.value.map((item) => {
          valuesForAttrKeys.add(new Option(item));
          return '';
        });
      }
    }
  };
  //! hàm xử lý đồng nhất giữa category và phần attributes bên dưới--> có 3 cấp---> category---> attributes key---> attributes value
  const changeCategory = (e) => {
    const highLevelCategory = e.target.value.split('/')[0];
    const highLevelCategoryAllData = categories.find(
      (cat) => cat.name === highLevelCategory
    );
    if (highLevelCategoryAllData && highLevelCategoryAllData.attrs) {
      setAttributesFromDb(highLevelCategoryAllData.attrs);
    } else {
      setAttributesFromDb([]);
    }
    setCategoryChoosen(e.target.value); //2: chỗ này để lấy giá trị nếu category = choose category----> cài giá trị để disable nút tự tạo attribute
  };
  //! hàm dùng để tự động thêm attribute (key,value) từ category vào attribute của product
  const attributeValueSelected = (e) => {
    if (e.target.value !== 'Choose attribute value') {
      setAttributesTableWrapper(attrKey.current.value, e.target.value);
    }
  };

  const setAttributesTableWrapper = (key, val) => {
    //! setAttributesTable là 1 setter của useState===> cần optimize tách riêng hàm ra cho dễ maintain code

    setAttributesTable((attr) => {
      //2: nếu product đã có tồn tại attributes thì phải phân tích attribute.key có trùng với attribute.key đang được đưa vào hay ko, nếu có thì thay thế, ko thì tạo mới

      if (attr.length !== 0) {
        var keyExistsInOldTable = false;
        //3: tạo mảng

        let modifiedTable = attr.map((item) => {
          //todo: nếu attribute.key đã tồn tại thì sẽ thay thế

          if (item.key === key) {
            keyExistsInOldTable = true;
            item.value = val;
            return item;
          } else {
            //todo: nếu attribute.key ko tồn tại thì trả về như cũ

            return item;
          }
        });
        //3: đến đây mới check để return vào setter của react State
        if (keyExistsInOldTable) return [...modifiedTable];
        else return [...modifiedTable, { key: key, value: val }];
      } else {
        //2: nếu product chưa tồn tại attributes thì đơn giản thêm vào thôi

        return [{ key: key, value: val }];
      }
    });
  };

  const deleteAttribute = (key) => {
    setAttributesTable((table) => table.filter((item) => item.key !== key));
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={1}>
          <Link to="/admin/products" className="btn btn-info my-3">
            Go Back
          </Link>
        </Col>
        <Col md={6}>
          <h1>Edit product</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                required
                type="text"
                defaultValue={product.name}
              />
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="description"
                required
                as="textarea"
                rows={3}
                defaultValue={product.description}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCount">
              <Form.Label>Count in stock</Form.Label>
              <Form.Control
                name="count"
                required
                type="number"
                defaultValue={product.count}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                name="price"
                required
                type="text"
                defaultValue={product.price}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCategory">
              <Form.Label>Category</Form.Label>
              <Form.Select
                required
                name="category"
                aria-label="Default select example"
                onChange={changeCategory}
              >
                <option value="Choose category">Choose category</option>
                {categories.map((category, idx) => {
                  return product.category === category.name ? (
                    <option selected key={idx} value={category.name}>
                      {category.name}
                    </option>
                  ) : (
                    <option key={idx} value={category.name}>
                      {category.name}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>

            {attributesFromDb.length > 0 && (
              <Row className="mt-5">
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formBasicAttributes">
                    <Form.Label>Choose atrribute and set value</Form.Label>
                    <Form.Select
                      name="atrrKey"
                      aria-label="Default select example"
                      ref={attrKey}
                      onChange={setValuesForAttrFromDbSelectForm}
                    >
                      <option>Choose attribute</option>
                      {attributesFromDb.map((item, idx) => (
                        <Fragment key={idx}>
                          <option value={item.key}>{item.key}</option>
                        </Fragment>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group
                    className="mb-3"
                    controlId="formBasicAttributeValue"
                  >
                    <Form.Label>Attribute value</Form.Label>
                    <Form.Select
                      name="atrrVal"
                      aria-label="Default select example"
                      ref={attrVal}
                      onChange={attributeValueSelected}
                    >
                      <option>Choose attribute value</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            )}

            <Row>
              {attributesTable && attributesTable.length > 0 && (
                <Table hover>
                  <thead>
                    <tr>
                      <th>Attribute</th>
                      <th>Value</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attributesTable.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.key}</td>
                        <td>{item.value}</td>
                        <td>
                          <CloseButton
                            onClick={() => deleteAttribute(item.key)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formBasicNewAttribute">
                  <Form.Label>Create new attribute</Form.Label>
                  <Form.Control
                    disabled={categoryChoosen === 'Choose category'}
                    placeholder="first choose or create category"
                    name="newAttrKey"
                    type="text"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group
                  className="mb-3"
                  controlId="formBasicNewAttributeValue"
                >
                  <Form.Label>Attribute value</Form.Label>
                  <Form.Control
                    disabled={categoryChoosen === 'Choose category'}
                    placeholder="first choose or create category"
                    required={true}
                    name="newAttrValue"
                    type="text"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Alert variant="primary">
              After typing attribute key and value press enterr on one of the
              field
            </Alert>

            <Form.Group controlId="formFileMultiple" className="mb-3 mt-3">
              <Form.Label>Images</Form.Label>
              <Row>
                {product.images &&
                  product.images.map((image, idx) => (
                    <Col key={idx} style={{ position: 'relative' }} xs={3}>
                      <Image
                        crossOrigin="anonymous"
                        src={image.path ?? null}
                        fluid
                      />
                      <i style={onHover} className="bi bi-x text-danger"></i>
                    </Col>
                  ))}
              </Row>
              <Form.Control required type="file" multiple />
            </Form.Group>
            <Button variant="primary" type="submit">
              UPDATE
            </Button>
            {updateProductResponseState.error ?? ''}
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
