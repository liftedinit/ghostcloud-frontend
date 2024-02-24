// @ts-nocheck
import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@testing-library/react"
import Dashboard from "../../pages/dashboard"
import useWeb3AuthStore from "../../store/web3-auth"

jest.mock("../../store/web3-auth", () => jest.fn())
describe("Dashboard", () => {
  it("renders login message if not connected", async () => {
    useWeb3AuthStore.mockReturnValue({
      // provider: null,
      isConnected: () => false,
    })
    render(<Dashboard />)
    await waitFor(() => {
      expect(
        screen.getByText("Please login to view this page"),
      ).toBeInTheDocument()
    })
  })
})
