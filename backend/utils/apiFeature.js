class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //todo:1A) Filtering

    //! filtersUrl = "&price=60&rating=1,2,3&category=a,b,c,d&attrs=color-red-blue,size-1TB-2TB";

    const queryObj = { ...this.queryString };
    const excludedFields = [
      'pageNum',
      'sort',
      'limit',
      'fields',
      'rating',
      'category',
      'attrs',
    ];
    excludedFields.forEach((el) => delete queryObj[el]); //! xóa trường nào có trong mảng này vì chỉ thực hiện nhiệm vụ lọc

    //todo:1B) Advanced filtering (<, >,<=, >= )
    //* url sẽ như này: price[lte]=priceValue--> chuyển thành có $lte mới sử dụng được

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    const newQueryObject = JSON.parse(queryStr);

    this.query = this.query.find(newQueryObject);

    return this;
  }

  rating() {
    console.log('------------vao rating-------------');
    if (this.queryString.rating) {
      console.log('------------ rating-------------');
      //! vì app có chọn nhiều rating nên ko thể chỉ dùng > <
      const rating = this.queryString.rating.split(',');
      console.log('rating: ', rating);
      this.query = this.query.find({ rating: rating });
    }
    return this;
  }

  category() {
    if (this.queryString.category) {
      const categories = this.queryString.category.split(',').map((item) => {
        return new RegExp(`^${item}`); //! dùng để search tất cả các category bắt đầu = condition cần tìm
      });

      this.query = this.query.find({ category: categories });
    }
    return this;
  }

  attributes() {
    if (this.queryString.attrs) {
      const attrs = this.queryString.attrs.split(',').reduce((acc, item) => {
        const a = item.split('-');
        const values = [...a];
        values.shift(); // removes first item
        const a1 = {
          attrs: { $elemMatch: { key: a[0], value: { $in: values } } },
        };
        acc.push(a1);
        // console.dir(acc, { depth: null });
        // ! mỗi lần lặp sẽ tạo dc object {attrs : {key và value của sản phẩm}}
        //! ==> cuối cùng tạo thành một mảng các object có dạng {attrs : {key và value của sản phẩm}}--> lấy mảng này đi query
        return acc;
      }, []);
      this.query = this.query.find({ $and: [...attrs] });
      // return attrs;
    }
    return this;
  }

  sort() {
    //todo:2) Sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split('_');
      console.log('------------sort---------------', sortBy);
      const [sortKey, sortValue] = sortBy;
      const sortObject = { [sortKey]: Number(sortValue) };
      console.log('sortObject: ', sortObject);
      this.query = this.query.sort(sortObject);
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
    const pageNumber = Number(this.queryString.pageNum) || 1;
    const limit = Number(this.queryString.limit) || 3;
    const skip = limit * (pageNumber - 1);

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIFeatures;
