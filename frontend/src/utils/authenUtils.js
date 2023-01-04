export const saveUserInformation = (data) => {
  //! lưu dữ liệu lên localStorage

  //2: nếu client tick vào do not logout thì sẽ lưu ở local storage

  if (data.userLoggedIn.doNotLogout) {
    localStorage.setItem('userInfo', JSON.stringify(data.userLoggedIn));
  } else {
    //2: ko tick thì sẽ lưu ở session storage <---> khi tắt browser thì user data sẽ mất

    sessionStorage.setItem('userInfo', JSON.stringify(data.userLoggedIn));
  }
};
