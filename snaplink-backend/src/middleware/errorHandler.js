export function errorHandler(err, req, res, next) {
  console.error("Error:", err.message);
  
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  
  if (err.name === "NotFoundError") {
    return res.status(404).json({ error: err.message });
  }
  
  if (err.name === "ConflictError") {
    return res.status(409).json({ error: err.message });
  }
  
  res.status(500).json({ error: "Internal server error" });
}

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConflictError";
  }
}
