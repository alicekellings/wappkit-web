export function serializeError(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    const serialized: Record<string, unknown> = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };

    const errorWithCause = error as Error & { cause?: unknown };
    if (errorWithCause.cause !== undefined) {
      serialized.cause = serializeError(errorWithCause.cause);
    }

    return serialized;
  }

  return {
    value: error,
  };
}

export function getSafeUrlOrigin(value: string) {
  try {
    return new URL(value).origin;
  } catch {
    return "invalid-url";
  }
}
