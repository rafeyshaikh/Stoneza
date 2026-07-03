import { NextResponse } from "next/server";

const DEFAULT_SUCCESS_STATUS = 200;
const DEFAULT_ERROR_STATUS = 500;

const isValidHttpStatus = (code) => {
  return Number.isInteger(code) && code >= 100 && code <= 599;
};

export const response = (
  success,
  statusCode,
  message,
  data = {},
  options = {}
) => {
  const normalizedSuccess = Boolean(success);
  const normalizedStatusCode = isValidHttpStatus(statusCode)
    ? statusCode
    : normalizedSuccess
      ? DEFAULT_SUCCESS_STATUS
      : DEFAULT_ERROR_STATUS;

  const payload = {
    success: normalizedSuccess,
    message:
      message || (normalizedSuccess ? "Request successful" : "Request failed"),
    data,
    timestamp: new Date().toISOString(),
  };

  if (options.meta) {
    payload.meta = options.meta;
  }

  if (options.errors) {
    payload.errors = options.errors;
  }

  return NextResponse.json(
    payload,
    {
      status: normalizedStatusCode,
      headers: options.headers,
    }
  );
};