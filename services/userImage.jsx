export const getUserImage = (imagePath) => {
  if (imagePath) {
    return { url: imagePath };
  }
  return require("../assets/images/defaultUser.png");
};
