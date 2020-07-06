export const getDistance = function (x1, y1, x2, y2) {
  let xs = x2 - x1,
    ys = y2 - y1;
  xs *= xs;
  ys *= ys;
  return Math.sqrt(xs + ys);
};

export const normalise = (val, max, min) => (val - min) / (max - min);
