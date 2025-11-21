/// <reference lib="dom" />

import { describe, it, expect, afterEach } from "bun:test"
import { render, screen, cleanup } from "@testing-library/react"
import {
  setupThemeMock,
  setupGhostcloudMock,
  setMockFetchAddress,
} from "../setup/mocks"
import "@testing-library/jest-dom"

setupThemeMock()
setupGhostcloudMock()

describe("AddressDisplay", () => {
  afterEach(() => {
    cleanup()
  })

  it("renders correct elements", async () => {
    setMockFetchAddress({
      isLoading: false,
      data: "1234567890",
    })

    const { default: AddressDisplay } = await import(
      "@/components/address-display"
    )
    render(<AddressDisplay />)
    expect(screen.getByText("Logged as")).toBeInTheDocument()
    expect(screen.getByTestId("address").textContent).toContain("123")
  })
})
