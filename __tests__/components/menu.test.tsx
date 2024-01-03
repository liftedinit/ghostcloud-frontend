// @ts-nocheck
import { render, screen, fireEvent } from "@testing-library/react"
import Menu from "../../components/menu"
import { handleLogin, handleLogout } from "../../jest.setup"
import useWeb3AuthStore from "../../store/web3-auth"

describe("Menu", () => {
  beforeEach(() => {
    useWeb3AuthStore.mockReturnValue({ provider: null })
  })

  it("renders Login button when provider is not available", () => {
    render(<Menu />)
    expect(screen.getByText("Login")).toBeInTheDocument()
  })

  it("renders Dashboard and Logout buttons when provider is available", () => {
    useWeb3AuthStore.mockReturnValue({ provider: {} })
    render(<Menu />)
    expect(screen.getByText("Dashboard")).toBeInTheDocument()
    expect(screen.getByText("Logout")).toBeInTheDocument()
  })

  it("calls handleLogin when Login button is clicked", () => {
    render(<Menu />)
    fireEvent.click(screen.getByText("Login"))
    expect(handleLogin).toHaveBeenCalled()
  })

  it("calls handleLogout when Logout button is clicked", () => {
    useWeb3AuthStore.mockReturnValue({ provider: {} })
    render(<Menu />)
    fireEvent.click(screen.getByText("Logout"))
    expect(handleLogout).toHaveBeenCalled()
  })
})
