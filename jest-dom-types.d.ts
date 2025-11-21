import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers"

declare module "bun:test" {
  interface Matchers<R = void>
    extends TestingLibraryMatchers<typeof expect.stringContaining, void> {}
  interface AsymmetricMatchers extends TestingLibraryMatchers {}
}
