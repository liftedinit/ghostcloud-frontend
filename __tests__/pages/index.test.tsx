/// <reference lib="dom" />

import { describe, it, expect, afterEach } from "bun:test"
import { render, screen, cleanup } from "@testing-library/react"
import { setupAuthHandlersMock, setupNextImageMock } from "../setup/mocks"
import "@testing-library/jest-dom"

setupNextImageMock()
setupAuthHandlersMock()

describe("Home", () => {
  afterEach(() => {
    cleanup()
  })

  it("renders the home page", async () => {
    const { default: Home } = await import("@/pages/index")
    render(<Home />)

    expect(
      screen.getByText("Decentralized Web Hosting for Humans"),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Get started" }),
    ).toBeInTheDocument()
  })
})
