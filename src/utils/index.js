export const controllableDelay = function (ms) {
  let timerId = null;
  let p = new Promise((resolve, _) => {
    timerId = setTimeout(resolve, ms);
  });
  return [timerId, p];
};

export const delay = function (ms) {
  return new Promise((resolve, _) => {
    setTimeout(resolve, ms);
  });
};
