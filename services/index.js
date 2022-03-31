const errors = {
  badResponse: (statusCode) => ({
    message: 'Bad server response',
    statusCode,
  }),
  emptyResult: {
    message: 'Empty result',
  },
  networkError: {
    message: 'Network error',
  },
};

const createError = (error) => ({ error });

export { createError, errors };
