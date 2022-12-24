const Category = require('../models/CategoryModel');

const getCategories = async (req, res, next) => {
  try {
    //! orFail dùng để xử lí nhảy vào catch khi ko tìm thấy category
    const categories = await Category.find({}).sort({ name: 'asc' }).orFail();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

const newCategory = async (req, res, next) => {
  try {
    //! đầu tiên check có dữ liệu ko, sau đó check có tồn tại rồi hay ko, sau đó mới tạo
    const { category } = req.body;
    if (!category) {
      //   throw new Error('Category input is required');
      res.status(400).send('Vui long nhap category');
    }

    const categoryExists = await Category.findOne({ name: category });
    if (categoryExists) {
      res.status(400).send('Category da ton tai');
    } else {
      const categoryCreated = await Category.create({
        name: category,
      });
      res.status(201).send({ categoryCreated: categoryCreated });
    }
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    if (req.params.category !== 'Choose category') {
      //! "choose category "la default trong client
      const categoryExists = await Category.findOne({
        name: decodeURIComponent(req.params.category),
      }).orFail();

      await categoryExists.remove();

      res.json({
        categoryDeleted: true,
      });
    }
  } catch (error) {
    next(error);
  }
};

const saveAttr = async (req, res, next) => {
  const { key, val, categoryChoosen } = req.body;

  if (!key || !val || !categoryChoosen) {
    return res.status(400).send('Thieu input');
  }

  try {
    const category = categoryChoosen.split('/')[0];
    const categoryExitsts = await Category.findOne({ name: category }).orFail(); //! orFail to handle error
    //! nếu như attrs có tồn tại---> check xem có key đó chưa ? ====> nếu có rồi thì thêm value mới vào mảng value của key đó || nếu chưa có thì thêm cặp key-value vào mảng
    //! nếu như attrs chưa có ==> thêm cặp key-value vào
    //todo:  nếu như attrs có tồn tại
    if (categoryExitsts.attrs.length > 0) {
      let keyDoesNotExistsInDatabase = true;

      // eslint-disable-next-line array-callback-return
      categoryExitsts.attrs.map((attribute, index) => {
        //*: check xem có key đó chưa
        if (attribute.key === key) {
          keyDoesNotExistsInDatabase = false;
          //! copy mảng mới
          let copyAttributeValues = [...categoryExitsts.attrs[index].value];
          copyAttributeValues.push(val);
          let newAttributeValues = [...new Set(copyAttributeValues)];
        }
        if (keyDoesNotExistsInDatabase) {
          categoryExitsts.attrs.push({ key: key, value: [val] });
        }
      });
    } else {
      //todo: nếu như attrs chưa có ==> thêm cặp key-value vào
      categoryExitsts.attrs.push({ key: key, value: [val] });
    }
    await categoryExitsts.save();
    const myCategory = await Category.find({}).sort({ name: 'asc' });

    return res.status(201).json({
      categoriesUpdated: myCategory,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, newCategory, deleteCategory, saveAttr };
