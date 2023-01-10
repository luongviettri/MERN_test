class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  //! price-- rating -- category--atts--sort

  filter() {
    //todo:1A) Filtering

    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]); //! xóa trường nào có trong mảng này

    console.log('queryObj: ', queryObj);
    //todo:1B) Advanced filtering (<, >,<=, >= )

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  price() {
    console.log('vo price');
    // if (req.query.price) {
    //   queryCondition = true;
    //   priceQueryCondition = { price: { $lte: Number(req.query.price) } }; //! tên property và điều kiện ( operator: chỉ định hành động )
    // }

    if (this.queryString.price) {
      const priceCondition = this.queryString;
      console.log('priceCondition: ', priceCondition);
      this.query = this.query.find(priceCondition);
    }
  }

  sort() {
    //todo:2) Sorting

    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    //todo:3) Field limiting (giới hạn các field có trong collection)

    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields); //! sẽ project( phép chiếu) và lấy ra các field(trường)
    } else {
      this.query = this.query.select('-__v'); //! thêm dấu - làm prefix thì sẽ sẽ ko hiển thị ra khi gửi về user
    }
    return this;
  }

  paginate() {
    //todo:4) Pagination
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIFeatures;
