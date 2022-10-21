class ConflictError extends Error {
  constructor(message) {
    super();
    this.responseObject = { message };
    this.statusCode = 409;
  }
}

module.exports = ConflictError;
