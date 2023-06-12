type F = (...p: any[]) => any;

const debounce = (func: F, timeout = 200) => {
  let timer: NodeJS.Timeout;
  //@ts-ignore
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(self, args);
    }, timeout);
  };
};

export default debounce;
