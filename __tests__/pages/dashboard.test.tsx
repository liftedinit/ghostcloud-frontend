/// <reference lib="dom" />

import { describe, it, expect, afterEach } from "bun:test"
import { render, screen, waitFor, cleanup } from "@testing-library/react"
import { setupWeb3AuthStoreMock } from "../setup/mocks"
import "@testing-library/jest-dom"

setupWeb3AuthStoreMock()

describe("Dashboard", () => {
  afterEach(() => {
    cleanup()
  })

  it("renders login message if not connected", async () => {
    const { default: Dashboard } = await import("@/pages/dashboard")
    render(<Dashboard />)
    await waitFor(() => {
      expect(
        screen.getByText("Please login to view this page"),
      ).toBeInTheDocument()
    })
  })
})
