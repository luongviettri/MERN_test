const createAttributeArrayHandler = (attributes) => {
  const attrs = attributes.split(',').reduce((acc, item) => {
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
  return attrs;
};

module.exports = { createAttributeArrayHandler };
