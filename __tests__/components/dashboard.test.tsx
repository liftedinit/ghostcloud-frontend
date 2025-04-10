// @ts-nocheck
import { render, screen, fireEvent } from "@testing-library/react"
import Dashboard from "../../components/dashboard"
import useWeb3AuthStore from "../../store/web3-auth"
import { useFetchMetas } from "../../lib/ghostcloud"

jest.mock("../../lib/ghostcloud", () => ({
  useCreateDeployment: jest.fn(),
  useFetchMetas: jest.fn(),
  useUpdateDeployment: jest.fn(),
  useRemoveDeployment: jest.fn(),
}))
jest.mock("../../store/web3-auth", () => jest.fn())
jest.mock("../../hooks/useAuthHandlers", () => {
  return jest.fn().mockReturnValue({
    handleLogin: jest.fn(),
    handleLogout: jest.fn(),
  })
})

jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useTheme: () => ({
    colors: {
      white: "#FFFFFF",
      gray: {
        500: "#A0AEC0",
      },
    },
  }),
}))

describe("Dashboard", () => {
  beforeEach(() => {
    useWeb3AuthStore.mockReturnValue({
      getAddress: () => Promise.resolve(null),
    })
  })
  it("renders spinner if loading", () => {
    useFetchMetas.mockReturnValue([
      {
        data: { meta: [] },
        isLoading: true,
        refetch: jest.fn(),
      },
      0,
      0,
      jest.fn(), // handlePageClick
    ])
    const { container } = render(<Dashboard />)
    expect(container.querySelector(".chakra-spinner")).toBeInTheDocument()
  })
  it("renders creact deployment button if logged in", () => {
    useFetchMetas.mockReturnValue([
      {
        data: { meta: [] },
        isLoading: false,
        refetch: jest.fn(),
      },
      0,
      0,
      jest.fn(), // handlePageClick
    ])
    render(<Dashboard />)
    const btn = screen.getByText("Create Deployment")
    expect(btn).toBeInTheDocument()
    fireEvent.click(btn)
    expect(screen.getByText("File (Max 5MB)")).toBeInTheDocument()
  })
  it("renders list of deployments", () => {
    useFetchMetas.mockReturnValue([
      {
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
        isLoading: false,
        refetch: jest.fn(),
      },
      0,
      0,
      jest.fn(), // handlePageClick
    ])
    render(<Dashboard />)
    expect(screen.getByText("test_name")).toBeInTheDocument()
    expect(screen.getByText("test_description")).toBeInTheDocument()
    expect(screen.getByText("test.com")).toBeInTheDocument()
  })

  describe("Pagination", () => {
    it("renders pagination if pageCount is greater than 1", () => {
      useFetchMetas.mockReturnValue([
        {
          data: {
            meta: [],
          },
          isLoading: false,
          refetch: jest.fn(),
        },
        1,
        2,
        jest.fn(),
      ])
      render(<Dashboard />)
      const prevBtn = screen.getByTestId("previous-button")
      const nextBtn = screen.getByTestId("next-button")
      expect(prevBtn).toBeInTheDocument()
      expect(nextBtn).toBeInTheDocument()
      expect(prevBtn).toHaveAttribute("disabled")
      expect(nextBtn).not.toHaveAttribute("disabled")
      expect(screen.getByTestId("page-info")).toHaveTextContent("1 / 2")
    })
    it("does not render pagination if pageCount is 1", () => {
      useFetchMetas.mockReturnValue([
        {
          data: {
            meta: [],
          },
          isLoading: false,
          refetch: jest.fn(),
        },
        1,
        1,
        jest.fn(),
      ])
      render(<Dashboard />)
      expect(screen.queryByTestId("previous-button")).not.toBeInTheDocument()
      expect(screen.queryByTestId("next-button")).not.toBeInTheDocument()
      expect(screen.queryByTestId("page-info")).not.toBeInTheDocument()
    })
    it("previous button is disabled on first page", () => {
      useFetchMetas.mockReturnValue([
        {
          data: {
            meta: [],
          },
          isLoading: false,
          refetch: jest.fn(),
        },
        1,
        2,
        jest.fn(),
      ])
      render(<Dashboard />)
      expect(screen.getByTestId("previous-button")).toHaveAttribute("disabled")
    })
    it("next button is disabled on last page", () => {
      useFetchMetas.mockReturnValue([
        {
          data: {
            meta: [],
          },
          isLoading: false,
          refetch: jest.fn(),
        },
        2,
        2,
        jest.fn(),
      ])
      render(<Dashboard />)
      expect(screen.getByTestId("next-button")).toHaveAttribute("disabled")
    })
  })
})
