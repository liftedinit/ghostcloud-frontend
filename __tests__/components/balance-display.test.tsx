/// <reference lib="dom" />

import { describe, it, expect, afterEach } from "bun:test"
import { render, screen, cleanup } from "@testing-library/react"
import {
  setupThemeMock,
  setupGhostcloudMock,
  setMockFetchBalance,
} from "../setup/mocks"
import "@testing-library/jest-dom"

setupThemeMock()
setupGhostcloudMock()

describe("BalanceDisplay", () => {
  afterEach(() => {
    cleanup()
  })

  it("renders correct elements", async () => {
    setMockFetchBalance({
      isLoading: false,
      data: {
        amount: "100",
        denom: "token",
      },
    })

    const { default: BalanceDisplay } = await import(
      "@/components/balance-display"
    )
    render(<BalanceDisplay />)
    expect(screen.getByText("Balance:")).toBeInTheDocument()
    expect(screen.getByText("100 token")).toBeInTheDocument()
  })
})
