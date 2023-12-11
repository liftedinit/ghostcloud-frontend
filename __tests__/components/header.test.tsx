import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import Header from "../../components/header"

jest.mock("../../hooks/useAuthHandlers", () => {
  return jest.fn().mockReturnValue({
    handleLogin: jest.fn(),
    handleLogout: jest.fn(),
  })
})

describe("Header", () => {
  it("renders correct components", () => {
    render(<Header />)
    expect(screen.getByAltText("Header Logo")).toBeInTheDocument()
    expect(screen.getByTestId("menu")).toBeInTheDocument()
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument()
  })
})
