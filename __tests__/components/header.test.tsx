/// <reference lib="dom" />

import { describe, it, expect, afterEach } from "bun:test"
import { render, screen, cleanup } from "@testing-library/react"
import {
  setupNextImageMock,
  setupAuthHandlersMock,
  setupWeb3AuthStoreMock,
} from "../setup/mocks"

setupNextImageMock()
setupAuthHandlersMock()
setupWeb3AuthStoreMock()

describe("Header", () => {
  afterEach(() => {
    cleanup()
  })

  it("renders correct components", async () => {
    const { default: Header } = await import("@/components/header")
    render(<Header />)

    expect(screen.getByAltText("Header Logo")).toBeInTheDocument()
    expect(screen.getByTestId("menu")).toBeInTheDocument()
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument()
  })
})
