export const debugLog = (...args) => {
  if (process.env.NODE_ENV !== 'production') {
    return console.log('[SlackChat]', ...args);
  }
};

export const arraysIdentical = (a, b) => JSON.stringify(a) === JSON.stringify(b);
