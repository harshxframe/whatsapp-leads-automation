export const getExpireDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 2);
  return date;
};



