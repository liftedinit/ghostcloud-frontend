/// <reference lib="dom" />

import { describe, it, expect, beforeEach, afterEach } from "bun:test"
import { render, screen, fireEvent, cleanup } from "@testing-library/react"
import {
  mockHandleLogin,
  mockHandleLogout,
  setupAuthHandlersMock,
  setupWeb3AuthStoreMock,
  setMockProvider,
} from "../setup/mocks"

setupAuthHandlersMock()
setupWeb3AuthStoreMock()

describe("Menu", () => {
  beforeEach(() => {
    mockHandleLogin.mockClear()
    mockHandleLogout.mockClear()
    setMockProvider(null)
  })

  afterEach(() => {
    cleanup()
  })

  it("renders Login button when provider is not available", async () => {
    const { default: Menu } = await import("@/components/menu")
    render(<Menu />)

    expect(screen.getByText("Login")).toBeInTheDocument()
  })

  it("renders Dashboard and Logout buttons when provider is available", async () => {
    setMockProvider({})
    const { default: Menu } = await import("@/components/menu")
    render(<Menu />)
    expect(screen.getByText("Dashboard")).toBeInTheDocument()
    expect(screen.getByText("Logout")).toBeInTheDocument()
  })

  it("calls handleLogin when Login button is clicked", async () => {
    const { default: Menu } = await import("@/components/menu")
    render(<Menu />)
    fireEvent.click(screen.getByText("Login"))
    expect(mockHandleLogin).toHaveBeenCalled()
  })

  it("calls handleLogout when Logout button is clicked", async () => {
    setMockProvider("mockProvider")
    const { default: Menu } = await import("@/components/menu")
    render(<Menu />)
    fireEvent.click(screen.getByText("Logout"))
    expect(mockHandleLogout).toHaveBeenCalled()
  })
})
