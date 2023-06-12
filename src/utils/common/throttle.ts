type F = (...p: any[]) => any;

const throttle = (func: F, delay = 200) => {
  let timeoutId: NodeJS.Timeout | null = null;

  //@ts-ignore
  return function (...args) {
    if (timeoutId) {
      return;
    }
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
};

export default throttle;
