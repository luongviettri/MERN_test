const {
  filterComparison,
  createAttributeArrayHandler,
} = require('./apiFeatureHandler');

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  //! price -- rating -- category -- atts -- sort

  filter() {
    //todo:1A) Filtering

    //! filtersUrl = "&price=60&rating=1,2,3&category=a,b,c,d&attrs=color-red-blue,size-1TB-2TB";

    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]); //! xóa trường nào có trong mảng này vì chỉ thực hiện nhiệm vụ lọc

    //todo:1B) Advanced filtering (<, >,<=, >= )
    //* url sẽ như này: price[lte]=priceValue--> chuyển thành có $lte mới sử dụng được

    let newQueryObject = filterComparison(queryObj);

    //todo :1C)xử lý tìm mảng

    //*  nếu có rating thì chuyển rating sang dạng mảng
    if (newQueryObject.rating) {
      //! vì app có chọn nhiều rating nên ko thể chỉ dùng > <
      const rating = newQueryObject.rating.split(',');
      newQueryObject = { ...newQueryObject, rating: rating };
    }

    //* nếu có category thì chuyển sang dạng mảng
    if (newQueryObject.category) {
      const categories = newQueryObject.category.split(',').map((item) => {
        return new RegExp(`^${item}`); //! dùng để search tất cả các category bắt đầu = condition cần tìm
      });
      newQueryObject = { ...newQueryObject, category: categories };
    }

    //* xử lý tìm attribute khá phức tạp chỗ này
    if (newQueryObject.attrs) {
      const attrs = createAttributeArrayHandler(newQueryObject.attrs);

      delete newQueryObject.attrs; //! phải delete atts cũ đi vì atts đã tách riêng ra

      newQueryObject = {
        $and: [newQueryObject, ...attrs], //! chỗ này phải dùng cách xài mảng vì nếu xài object thì sẽ đụng trường hợp tạo nhiều object có key là attrs ---> js chỉ giữ lại key cuối cùng ---> sai
      };
    }
    this.query = this.query.find(newQueryObject);

    return this;
  }

  sort() {
    //todo:2) Sorting

    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split('_');
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
      console.log('fields: ', fields);
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
