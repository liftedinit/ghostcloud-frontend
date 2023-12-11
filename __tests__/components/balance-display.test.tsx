// @ts-nocheck
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { useQuery } from "react-query"
import BalanceDisplay from "../../components/balance-display"

jest.mock("react-query", () => ({
  useQuery: jest.fn(),
}))

describe("BalanceDisplay", () => {
  it("renders correct elements", () => {
    useQuery.mockReturnValue({
      isLoading: false,
      data: {
        amount: "100",
        denom: "token",
      },
    })
    render(<BalanceDisplay />)
    expect(screen.getByText("Balance:")).toBeInTheDocument()
    expect(screen.getByText("100 token")).toBeInTheDocument()
  })
})
