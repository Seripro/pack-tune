import { cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom';
import { afterEach } from 'vitest'

export const user = userEvent.setup();

afterEach(() => {
  cleanup();
});
