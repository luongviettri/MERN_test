const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const recordsPerPage = require('../config/pagination');
const Product = require('../models/ProductModel');
const imageValidate = require('../utils/imageValidate');
const factory = require('./handlerFactory');

const getProducts = async (req, res, next) => {
  try {
    //! query
    let query = {};
    let queryCondition = false;
    let priceQueryCondition = {};
    let ratingQueryCondition = {};
    let categoryQueryCondition = {};

    if (req.query.price) {
      console.log('req.query: ', req.query);
      queryCondition = true;
      priceQueryCondition = { price: { $lte: Number(req.query.price) } }; //! tên property và điều kiện ( operator: chỉ định hành động )
    }

    if (req.query.rating) {
      queryCondition = true;
      ratingQueryCondition = { rating: { $in: req.query.rating.split(',') } };
    }
    //todo: xử lý search ở main Page (ko liên quan đến mấy query kia vì lấy query trên param)
    const categoryName = req.params.categoryName || '';
    if (categoryName) {
      queryCondition = true;
      const condition = categoryName.replace(/,/g, '/');

      const regEx = new RegExp(`^${condition}`); //! dùng để search tất cả các category bắt đầu = condition cần tìm
      categoryQueryCondition = { category: regEx };
    }
    //todo----------------------------------------------------------------------------------------
    //todo: xử lý search ở productList page
    if (req.query.category) {
      queryCondition = true;
      // eslint-disable-next-line array-callback-return
      const arrayQuery = req.query.category.split(',').map((item) => {
        if (item) return new RegExp(`^${item}`);
      });

      categoryQueryCondition = {
        category: { $in: arrayQuery },
      };
    }
    //todo----------------------------------------------------------------------------------------

    //todo: xử lý query attributes
    // let attrsQueryCondition = [];

    // if (req.query.attrs) {
    //   console.log('qdowijdqoi');
    //   //? attrs=RAM-1TB-2TB-4TB,color-blue-red---> định dạng của query dc gửi lên
    //   attrsQueryCondition = req.query.attrs
    //     .split(',')
    //     .reduce((accumulate, particularAttribute) => {
    //       if (particularAttribute) {
    //         const querryAttributeArray = particularAttribute.split('-');
    //         let values = [...querryAttributeArray];
    //         values.shift(); // ! loại bỏ first element
    //         const objectQuery = {
    //           attrs: {
    //             $elemMatch: {
    //               key: querryAttributeArray[0],
    //               value: { $in: values },
    //             },
    //           },
    //         };
    //         accumulate.push(objectQuery);

    //         return accumulate;
    //       }
    //       return accumulate;
    //     }, []);

    //   queryCondition = true;
    // }

    //-----------------------------------------------------
    let attrsQueryCondition = [];
    if (req.query.attrs) {
      // attrs=RAM-1TB-2TB-4TB,color-blue-red
      // [ 'RAM-1TB-4TB', 'color-blue', '' ]
      attrsQueryCondition = req.query.attrs.split(',').reduce((acc, item) => {
        if (item) {
          const a = item.split('-');
          const values = [...a];
          values.shift(); // removes first item
          const a1 = {
            attrs: { $elemMatch: { key: a[0], value: { $in: values } } },
          };
          acc.push(a1);
          // console.dir(acc, { depth: null })
          return acc;
        }
        return acc;
      }, []);
      queryCondition = true;
    }

    //! pagenation

    const pageNum = Number(req.query.pageNum) || 1; //todo: page cần hiển thị, default = 1
    const skipProducts = recordsPerPage * (pageNum - 1); //todo: tính số products need to skip

    //!------------------------------------------------------------------------

    //! sort
    const sortOption = req.query.sort || '';
    let sort = {};
    //todo: nếu có sort thì sẽ có dạng  key_value--> tách ra bằng split---> gán lại thành 1 object
    if (sortOption) {
      const sortOpt = sortOption.split('_');
      const [sortKey, sortValue] = sortOpt; //todo: destructoring array
      sort = { [sortKey]: Number(sortValue) }; //todo: key động và convert Number
    }
    //todo: searchQuery
    const searchQuery = req.params.searchQuery || '';
    let searchQueryCondition = {};
    let select = {}; //! dùng để exclude hoặc include fields muốn hiển thị ra, Trường hợp này là include field score để đo mức độ match results
    if (searchQuery) {
      queryCondition = true;
      searchQueryCondition = { $text: { $search: searchQuery } };
      select = {
        score: { $meta: 'textScore' },
      };
      sort = { score: { $meta: 'textScore' } };
    }

    //todo----------------------------------------------------------------------------------------
    if (queryCondition) {
      query = {
        $and: [
          priceQueryCondition,
          ratingQueryCondition,
          categoryQueryCondition,
          searchQueryCondition,
          ...attrsQueryCondition,
        ],
      };
    }

    //!--------------------------------------------------------------------------

    //!-----------------------------------------------------------------------------
    const totalProducts = await Product.countDocuments(query); //todo: tổng số products

    const products = await Product.find(query)
      .select(select)
      .skip(skipProducts)
      .sort(sort)
      .limit(recordsPerPage);
    res.json({
      productsLength: products.length,
      products,
      pageNum,
      paginationLinksNumber: Math.ceil(totalProducts / recordsPerPage), //todo: ví dụ 10 sản phẩm, 3 sản phẩm mỗi page--> cần 4page
    });
  } catch (error) {
    next(error);
  }
};

const getProductsRefactor = factory.getAll(Product);

const getProductById = async (req, res, next) => {
  try {
    const productID = req.params.id;
    const product = await Product.findById(productID)
      .populate('reviews')
      .orFail();
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const getBestsellers = async (req, res, next) => {
  try {
    const products = await Product.aggregate([
      { $sort: { category: 1, sales: -1 } }, //todo: 1, -1 ~ ascendant and descendant
      {
        $group: { _id: '$category', doc_with_max_sales: { $first: '$$ROOT' } }, //! root=-> chỉ đến toàn bộ document  https://stackoverflow.com/questions/61804268/what-is-root-in-mongodb-aggregate-and-how-it-works  ---> first root--> document đầu tiên (vì đã sắp xếp nên doc đầu tiên có sale lớn nhất)
      },
      {
        $replaceWith: '$doc_with_max_sales', //! The $replaceWith  is an alias for $replaceRoot, With $replaceWith, you can promote an embedded document to the top-level,----> kết quả trả về 2 object ( vì mình group ở trên), 1 object là categoryID: game hoặc computer hoặc tablet...., 1 object là kết quả tìm được, thì replaceWith này sẽ làm nhiệm vụ bỏ đi phần _id: category và sẽ chuyển doc_with_max_sales lên top level cho mình  ---->      https://www.mongodb.com/docs/manual/reference/operator/aggregation/replaceWith/
      },
      {
        $match: { sales: { $gt: 0 } }, //! to make sure sales > 0
      },
      { $project: { _id: 1, name: 1, images: 1, category: 1, description: 1 } }, //! chỉ lấy ra trường cần thiết, 1 ở đây nghĩa là lấy ra correspond property
      { $limit: 3 },
    ]);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const adminGetProducts = async (req, res, next) => {
  try {
    const products = await Product.find({})
      .sort({ category: 1 })
      .select('name price category');
    return res.json(products);
  } catch (error) {
    next(error);
  }
};

const adminDeleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).orFail();
    await product.remove();
    res.json({ message: 'product removed' });
  } catch (error) {
    next(error);
  }
};

const adminCreateProduct = async (req, res, next) => {
  try {
    const product = new Product();
    const { name, description, count, price, category, attributesTable } =
      req.body;
    product.name = name;
    product.description = description;
    product.count = count;
    product.price = price;
    product.category = category;
    if (attributesTable.length > 0) {
      attributesTable.map((item) => {
        return product.attrs.push(item);
      });
    }
    await product.save();
    res.json({
      message: 'product created',
      productId: product._id,
    });
  } catch (error) {
    next(error);
  }
};

const adminUpdateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).orFail();
    const { name, description, count, price, category, attributesTable } =
      req.body;
    product.name = name || product.name;
    product.description = description || product.description;
    product.count = count || product.count;
    product.price = price || product.price;
    product.category = category || product.category;

    if (attributesTable.length > 0) {
      product.attrs = [];
      attributesTable.map((item) => {
        return product.attrs.push(item);
      });
    } else {
      product.attrs = [];
    }
    await product.save();
    res.json({
      message: 'product updated',
    });
  } catch (error) {
    next(error);
  }
};

const adminUpload = async (req, res, next) => {
  //* nếu môi trường production thì lưu link ảnh cloudinary, nếu là dev thì lưu ảnh trên local disk

  //2: nếu môi trường production---> lưu link ảnh của cloudinary lên database
  if (req.query.cloudinary === 'true') {
    try {
      let product = await Product.findById(req.query.productId).orFail();
      console.log('product: ', product);
      product.images.push({ path: req.body.url });
      await product.save();
    } catch (err) {
      next(err);
    }
    return;
  }
  //2: nếu môi trường development ---> lưu link ảnh vào local disk
  try {
    if (!req.files || !!req.files.images === false) {
      return res.status(400).send('No files were uploaded.');
    }

    const validateResult = imageValidate(req.files.images);
    if (validateResult.error) {
      return res.status(400).send(validateResult.error);
    }
    //! xử lý lưu ảnh từ client vào biến imagesTable, ảnh có thể là 1 object ảnh hoặc 1 mảng nhiều ảnh
    let imagesTable = [];
    if (Array.isArray(req.files.images)) {
      imagesTable = req.files.images;
    } else {
      imagesTable.push(req.files.images);
    }
    //! tạo đường dẫn đến folder lưu ảnh ở bên phía front-end
    const uploadDirectory = path.resolve(
      __dirname,
      '../../frontend',
      'public',
      'images',
      'products'
    );
    //! tìm đến product muốn thêm ảnh để add tên ảnh vào database
    let product = await Product.findById(req.query.productId).orFail();

    // eslint-disable-next-line no-restricted-syntax
    for (let image of imagesTable) {
      //* path.extname(image.name)---> hiển thị phần đuôi file như png, jpg,...
      //* uuidv4()---> tạo ra chuỗi string ngẫu nhiên để đặt tên cho ảnh( ảnh nên được đặt tên randomly trên server để tránh code hack từ client )

      let fileName = uuidv4() + path.extname(image.name);

      //! xử lý thêm ảnh vào database
      product.images.push({ path: `/images/products/${fileName}` });

      //! định nghĩa cả 1 file ảnh: folder nào/tên + định dạng gì để move qua folder front-end
      let uploadPath = `${uploadDirectory}/${fileName}`;

      //! sau đó move ảnh đến front-end với folder đã dc đặt trước
      // eslint-disable-next-line prefer-arrow-callback
      image.mv(uploadPath, function (err) {
        if (err) {
          return res.status(500).send(err);
        }
      });
    }
    await product.save();

    return res.send('Files uploaded!');
  } catch (error) {
    next(error);
  }
};

const adminDeleteProductImage = async (req, res, next) => {
  //! path từ client gửi lên ban đầu sẽ có dạng /abc/def --> trùng với dấu / của route---> client sẽ phải encode----> lên server ta phải decode nó
  const imagePath = decodeURIComponent(req.params.imagePath);
  if (req.query.cloudinary === 'true') {
    try {
      await Product.findOneAndUpdate(
        { _id: req.params.productId },
        { $pull: { images: { path: imagePath } } }
      ).orFail();
      return res.end();
    } catch (er) {
      next(er);
    }
    return;
  }

  try {
    //! tạo abosolute path = hàm resolve
    const finalPath = path.resolve('../frontend/public') + imagePath;

    //! để xóa ảnh, ngoài xử lí xóa trên database thì phải xóa trên folder front-end--> có 2 thao tác

    //todo: xóa ở folder, dùng hàm build-in của fs module---> https://www.geeksforgeeks.org/node-js-fs-unlink-method/

    fs.unlink(finalPath, (err) => {
      if (err) {
        res.status(500).send(err);
      }
    });

    //todo: xóa ở database

    //* The $pull operator removes from an existing array all instances of a value or values that match a specified condition.

    //*: $pull ở trường hợp này ---> tìm đến product--> mảng images---> đến image nào có path trùng với path được gửi lên từ client---> xóa

    await Product.findOneAndUpdate(
      { _id: req.params.productId },
      { $pull: { images: { path: imagePath } } }
    ).orFail();

    return res.end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getBestsellers,
  adminGetProducts,
  adminDeleteProduct,
  adminCreateProduct,
  adminUpdateProduct,
  adminUpload,
  adminDeleteProductImage,
  getProductsRefactor,
};
