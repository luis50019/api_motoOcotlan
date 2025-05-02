class ErrorAuth extends Error {
  errorsMessages = [];
  statusCode;
  constructor(message, statusCode, errorsMessages) {
    super(message);
    this.name = "ErrorAuth";
    this.statusCode = statusCode;
    this.errorsMessages = errorsMessages;
  }
  getErrorsMessages() {
    const errosInfo = [];

    for (let i = 0; i < this.errorsMessages.length; i++) {
      errosInfo.push({
        path: this.errorsMessages[i].path?.[0] ?? "unknown",
        message: this.errorsMessages[i].message || "Error desconocido",
      });
    }

    return errosInfo;
  }
}

export default ErrorAuth;
