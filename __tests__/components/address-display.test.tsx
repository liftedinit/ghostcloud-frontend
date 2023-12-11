// @ts-nocheck
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { useQuery } from "react-query"
import AddressDisplay from "../../components/address-display"

jest.mock("react-query", () => ({
  useQuery: jest.fn(),
}))
describe("AddressDisplay", () => {
  it("renders correct elements", () => {
    useQuery.mockReturnValue({
      isLoading: false,
      data: "1234567890",
    })
    render(<AddressDisplay />)
    expect(screen.getByText("Logged as")).toBeInTheDocument()
    expect(screen.queryByTestId("address")?.textContent).toContain("123")
  })
})
