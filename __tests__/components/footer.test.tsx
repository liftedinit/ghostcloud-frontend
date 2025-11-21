/// <reference lib="dom" />

import { describe, it, expect, afterEach } from "bun:test"
import { render, screen, cleanup } from "@testing-library/react"
import { setupNextImageMock } from "../setup/mocks"

setupNextImageMock()

describe("Footer", () => {
  afterEach(() => {
    cleanup()
  })

  it("renders links", async () => {
    const { default: Footer } = await import("@/components/footer")
    render(<Footer />)

    expect(screen.getByText("Home")).toBeInTheDocument()
    expect(screen.getByText("Terms Of Service")).toBeInTheDocument()
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument()
    expect(screen.getByText("Discord")).toBeInTheDocument()
  })
})
