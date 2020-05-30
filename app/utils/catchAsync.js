// Async Error Handling sent to Global Error Handling middleware
module.exports = (funcAsync) => {
  return (req, res, next) => {
    funcAsync(req, res, next).catch(next);
  };
};
