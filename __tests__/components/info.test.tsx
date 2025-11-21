/// <reference lib="dom" />

import { describe, it, expect, afterEach } from "bun:test"
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react"
import Info, { tips } from "@/components/info"
import { setupThemeMock } from "../setup/mocks"

setupThemeMock()

describe("Info", () => {
  afterEach(() => {
    cleanup()
  })

  for (const key of Object.keys(tips)) {
    it(`renders tooltip for ${key}`, async () => {
      render(<Info id={key as keyof typeof tips} />)
      const element = screen.getByTestId(`info-${key}`)
      expect(element).toBeInTheDocument()

      fireEvent.focus(element)
      await waitFor(() => {
        expect(
          screen.getByText(tips[key as keyof typeof tips]),
        ).toBeInTheDocument()
      })
    })
  }
})
