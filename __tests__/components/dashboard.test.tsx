// @ts-nocheck
import { render, screen, fireEvent } from "@testing-library/react"
import { useQuery } from "react-query"
import Dashboard from "../../components/dashboard"
import useWeb3AuthStore from "../../store/web3-auth"

jest.mock("react-query", () => ({
  useQuery: jest.fn(),
  useQueryClient: jest.fn(),
  useMutation: jest.fn(),
}))
jest.mock("../../store/web3-auth", () => jest.fn())
jest.mock("../../hooks/useAuthHandlers", () => {
  return jest.fn().mockReturnValue({
    handleLogin: jest.fn(),
    handleLogout: jest.fn(),
  })
})

describe("Dashboard", () => {
  beforeEach(() => {
    useWeb3AuthStore.mockReturnValue({
      getAddress: () => Promise.resolve(null),
    })
  })
  it("renders spinner if loading", () => {
    useQuery.mockReturnValue({
      isLoading: true,
    })
    const { container } = render(<Dashboard />)
    expect(container.querySelector(".chakra-spinner")).toBeInTheDocument()
  })
  it("renders error if no data", () => {
    useQuery.mockReturnValue({
      isLoading: false,
      data: null,
    })
    render(<Dashboard />)
    expect(
      screen.getByText("Error fetching deployments. Is the backend online?"),
    ).toBeInTheDocument()
  })
  it("renders creact deployment button if logged in", () => {
    useQuery.mockReturnValue({
      isLoading: false,
      data: {
        meta: [],
      },
    })
    render(<Dashboard />)
    const btn = screen.getByText("Create Deployment")
    expect(btn).toBeInTheDocument()
    fireEvent.click(btn)
    expect(screen.getByText("File (Max 5MB)")).toBeInTheDocument()
  })
  it("renders list of deployments", () => {
    useQuery.mockReturnValue({
      isLoading: false,
      data: {
        meta: [
          {
            creator: "1234",
            name: "test_name",
            description: "test_description",
            domain: "test.com",
          },
        ],
      },
    })
    render(<Dashboard />)
    expect(screen.getByText("test_name")).toBeInTheDocument()
    expect(screen.getByText("test_description")).toBeInTheDocument()
    expect(screen.getByText("test.com")).toBeInTheDocument()
  })
})
