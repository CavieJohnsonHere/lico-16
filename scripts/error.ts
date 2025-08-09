type Error<T> =
  | {
      isErrored: false;
      content: T;
    }
  | {
      isErrored: true;
      error: string;
    };

export function panic(error: string): {
  isErrored: true;
  error: string;
} {
  return { isErrored: true, error };
}

export function fine<T>(content: T): {
  isErrored: false;
  content: T;
} {
  return { isErrored: false, content };
}

export function done(): {
  isErrored: false;
  content: void;
} {
  return {isErrored: false, content: undefined}
}