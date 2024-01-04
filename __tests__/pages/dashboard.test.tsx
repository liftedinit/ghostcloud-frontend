// @ts-nocheck
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import Dashboard from "../../pages/dashboard"
import useWeb3AuthStore from "../../store/web3-auth"

describe("Dashboard", () => {
  it("renders login message if not connected", () => {
    useWeb3AuthStore.mockReturnValue({
      // provider: null,
      isConnected: () => false,
    })
    render(<Dashboard />)
    expect(
      screen.getByText("Please login to view this page"),
    ).toBeInTheDocument()
  })
})
