//! hàm xử lý đồng nhất giữa category và phần attributes bên dưới--> có 3 cấp---> category---> attributes key---> attributes value
export const changeCategory = (
  e,
  categories,
  setAttributesFromDb,
  setCategoryChoosen
) => {
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

//! hàm xử lý lấy values của từng key
export const setValuesForAttrFromDbSelectForm = (
  e,
  attrVal,
  attributesFromDb
) => {
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

export const setAttributesTableWrapper = (key, val, setAttributesTable) => {
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
