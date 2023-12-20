// @ts-nocheck
import { render, screen, fireEvent } from "@testing-library/react"
import Menu from "../../components/menu"
import useWeb3AuthStore from "../../store/web3-auth"
import useAuthHandlers from "../../hooks/useAuthHandlers"

jest.mock("../../store/web3-auth", () => jest.fn())
jest.mock("../../hooks/useAuthHandlers", () =>
  jest.fn().mockReturnValue({
    handleLogin: jest.fn(),
    handleLogout: jest.fn(),
  }),
)
jest.mock("../../hooks/usePaymentHandler", () =>
  jest.fn().mockReturnValue({
    handlePayment: jest.fn(),
  }),
)

describe("Menu", () => {
  it("renders Login button when provider is not available", () => {
    useWeb3AuthStore.mockReturnValue({
      provider: null,
    })
    render(<Menu />)
    expect(screen.getByText("Login")).toBeInTheDocument()
  })

  it("renders Dashboard and Logout buttons when provider is available", () => {
    useWeb3AuthStore.mockReturnValue({
      provider: {},
    })
    render(<Menu />)
    expect(screen.getByText("Dashboard")).toBeInTheDocument()
    expect(screen.getByText("Logout")).toBeInTheDocument()
  })

  it("calls handleLogin when Login button is clicked", () => {
    useWeb3AuthStore.mockReturnValue({
      provider: null,
    })
    const handleLogin = jest.fn()
    useAuthHandlers.mockReturnValue({
      handleLogin,
      handleLogout: jest.fn(),
    })
    render(<Menu />)
    fireEvent.click(screen.getByText("Login"))
    expect(handleLogin).toHaveBeenCalled()
  })

  it("calls handleLogout when Logout button is clicked", () => {
    useWeb3AuthStore.mockReturnValue({
      provider: "mockProvider",
    })
    const handleLogout = jest.fn()
    useAuthHandlers.mockReturnValue({
      handleLogin: jest.fn(),
      handleLogout,
    })
    render(<Menu />)
    fireEvent.click(screen.getByText("Logout"))
    expect(handleLogout).toHaveBeenCalled()
  })
})
