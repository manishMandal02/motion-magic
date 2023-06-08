const toTwoDigitsNum = (num: number) => {
  return num.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
};

export { toTwoDigitsNum };
