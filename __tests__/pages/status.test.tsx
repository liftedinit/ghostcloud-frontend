// @ts-nocheck
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import Status from "../../pages/status"
import useWeb3AuthStore from "../../store/web3-auth"
import useOpenLoginSession from "../../hooks/useOpenLoginSession"
import { useFetchMetas } from "../../lib/ghostcloud"
import { useRouter } from "next/router"

jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useTheme: () => ({
    colors: {
      green: {
        400: "",
      },
      red: {
        400: "",
      },
    },
  }),
}))
jest.mock("react-query", () => ({
  useQuery: jest.fn(),
}))
jest.mock("../../hooks/useOpenLoginSession", () => jest.fn())
jest.mock("../../lib/ghostcloud", () => ({
  useFetchMetas: jest.fn(() => ({
    data: { meta: [] },
    isLoading: false,
    refetch: jest.fn(),
  })),
}))
jest.mock("../../store/web3-auth", () => jest.fn())
jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    route: "/status",
    pathname: "",
    query: {},
    asPath: "",
    push: jest.fn(),
  }),
}))

describe("Status", () => {
  it("should redirect to homepage if not connected", async () => {
    const pushMock = jest.fn()
    useRouter.mockReturnValue({ push: pushMock })
    useWeb3AuthStore.mockReturnValueOnce({
      isConnected: jest.fn().mockReturnValue(false),
    })
    useFetchMetas.mockReturnValueOnce([
      { data: { meta: [] }, isLoading: false, refetch: jest.fn() },
    ])
    render(<Status />)
    expect(pushMock).toHaveBeenCalledWith("/")
  })

  it("should show spinner if loading", async () => {
    useWeb3AuthStore.mockReturnValueOnce({
      isConnected: jest.fn().mockReturnValue(false),
    })
    useOpenLoginSession.mockReturnValueOnce(false)
    useFetchMetas.mockReturnValueOnce([
      { data: { meta: [] }, isLoading: true, refetch: jest.fn() },
    ])
    render(<Status />)
    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })

  it("should render service status", async () => {
    useWeb3AuthStore.mockReturnValueOnce({
      isConnected: jest.fn().mockReturnValue(true),
    })
    useOpenLoginSession.mockReturnValueOnce(true)
    useFetchMetas.mockReturnValueOnce([
      { data: { meta: [] }, isLoading: false, refetch: jest.fn() },
    ])
    render(<Status />)
    expect(screen.getByText("All Systems Operational")).toBeInTheDocument()
  })

  it("should render deployment status", async () => {
    useWeb3AuthStore.mockReturnValueOnce({
      isConnected: jest.fn().mockReturnValue(true),
    })
    useOpenLoginSession.mockReturnValueOnce(true)
    useFetchMetas.mockReturnValueOnce([
      {
        data: { meta: [{}], pagination: { total: 1 } },
        isLoading: false,
        refetch: jest.fn(),
      },
    ])
    render(<Status />)
    expect(screen.getByText("1 Deployment Active")).toBeInTheDocument()
  })
})
