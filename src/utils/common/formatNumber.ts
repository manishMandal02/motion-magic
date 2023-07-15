const toTwoDigitsNum = (num: number) => {
  return num.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
};

function roundedToFixed(num: number, digits: number) {
  var rounder = Math.pow(10, digits);
  return (Math.round(num * rounder) / rounder).toFixed(digits);
}

export { toTwoDigitsNum, roundedToFixed };
