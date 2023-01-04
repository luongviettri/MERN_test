module.exports = (fn) => {
  return (...params) => {
    fn(...params).catch((error) => {
      console.log(
        error.response.data.message
          ? error.response.data.message
          : error.response.data
      );
    });
  };
};
