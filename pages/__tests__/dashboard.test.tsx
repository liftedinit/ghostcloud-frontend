// @ts-nocheck
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import Dashboard from "../dashboard"
import useWeb3AuthStore from "../../store/web3-auth"

jest.mock("../../store/web3-auth", () => jest.fn())
jest.mock("../../hooks/useAuthHandlers", () =>
  jest.fn().mockReturnValue({
    handleLogin: jest.fn(),
    handleLogout: jest.fn(),
  }),
)

describe("Dashoard", () => {
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
