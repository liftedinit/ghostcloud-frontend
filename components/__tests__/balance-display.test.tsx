// @ts-nocheck
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import BalanaceDisplay from "../balance-display"
import { useQuery } from "react-query"

jest.mock("react-query", () => ({
  useQuery: jest.fn(),
}))

describe("BalanaceDisplay", () => {
  it("renders correct elements", () => {
    useQuery.mockReturnValue({
      isLoading: false,
      data: {
        amount: "100",
        denom: "token",
      },
    })
    render(<BalanaceDisplay />)
    expect(screen.getByText("Balance:")).toBeInTheDocument()
    expect(screen.getByText("100 token")).toBeInTheDocument()
  })
})
