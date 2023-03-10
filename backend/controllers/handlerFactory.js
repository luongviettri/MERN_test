const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeature');

exports.deleteOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document doc with that ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
};
exports.updateOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    //! tham số thứ 3 để trả về object vừa được chỉnh sửa và khi runValidators= true nghĩa là khi client update Object này thì phải check lại validator, nếu không set = true thì khi update code sẽ ko check lại validator và dẫn đến sai valid

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
};
exports.createOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
};
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    //! sẽ có trường hợp tour ko tìm thấy==> tour = null, nhưng tour = null ko phải lỗi==>ko nhảy vô phần catch==>  phải bắt lỗi
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //! to allow for nested GET reviews on product (hack)
    let filter = {};

    if (req.params.productID) filter = { product: req.params.productID };

    //! EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .rating()
      .category()
      .attributes()
      .limitFields()
      .paginate()
      .sort();

    //! params (RẤT cần tách ra url riêng )

    // const doc = await features.query.explain();
    const doc = await features.query;
    // console.log('doc: ', doc);
    //! SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length, //! chỉ make sense khi nào data trả về client là 1 array
      data: {
        data: doc,
      },
    });
  });
