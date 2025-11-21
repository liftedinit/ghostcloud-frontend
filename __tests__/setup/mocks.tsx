import { Mock, mock } from "bun:test"

export const mockHandleLogin = mock(async () => {})
export const mockHandleLogout = mock(async () => {})

export const setupAuthHandlersMock = () => {
  mock.module("@/hooks/useAuthHandlers", () => ({
    default: () => ({
      handleLogin: mockHandleLogin,
      handleLogout: mockHandleLogout,
    }),
  }))
}

export const setupNextImageMock = () => {
  mock.module("next/image", () => ({
    default: ({ src, alt, ...props }: any) => {
      return (
        <img
          src={typeof src === "string" ? src : src.src}
          alt={alt}
          {...props}
        />
      )
    },
  }))
}

let mockProvider: any = null
let mockIsConnected: () => boolean = () => false
let mockGetAddress: Mock<() => Promise<null | string>> = mock(async () => null)

export const setupWeb3AuthStoreMock = () => {
  mock.module("@/store/web3-auth", () => ({
    default: () => ({
      provider: mockProvider,
      isConnected: mockIsConnected,
      getAddress: mockGetAddress,
    }),
  }))
}

export const setMockProvider = (value: any) => {
  mockProvider = value
}

export const setMockIsConnected = (fn: () => boolean) => {
  mockIsConnected = fn
}

export const setMockGetAddress = (fn: () => Promise<string | null>) => {
  mockGetAddress = mock(fn)
}

const mockTheme = {
  colors: {
    white: "#FFFFFF",
    gray: {
      500: "#A0AEC0",
    },
  },
}
export const setupThemeMock = () => {
  mock.module("@chakra-ui/react", () => {
    const actual = require("@chakra-ui/react")
    return {
      ...actual,
      useTheme: () => mockTheme,
    }
  })
}

export const mockRefetch = mock(() => {})
export const mockHandlePageClick = mock(() => {})
export const mockCreateDeployment = mock(() => {})
export const mockUpdateDeployment = mock(() => {})
export const mockRemoveDeployment = mock(() => {})

let mockFetchMetasReturn: any = [
  {
    data: { meta: [] },
    isLoading: false,
    refetch: mockRefetch,
  },
  1,
  1,
  mockHandlePageClick,
]

let mockFetchBalanceReturn: any = {
  data: { amount: "0", denom: "token" },
  isLoading: false,
}

let mockFetchAddressReturn: any = {
  data: null,
  isLoading: false,
}

export const setupGhostcloudMock = () => {
  mock.module("@/lib/ghostcloud", () => ({
    useCreateDeployment: () => [mockCreateDeployment, false],
    useFetchMetas: mock(() => mockFetchMetasReturn),
    useUpdateDeployment: () => [mockUpdateDeployment, false],
    useRemoveDeployment: () => [mockRemoveDeployment, false],
    useFetchBalance: () => mockFetchBalanceReturn,
    useFetchAddress: () => mockFetchAddressReturn,
  }))
}

export const setMockFetchMetas = (returnValue: any) => {
  mockFetchMetasReturn = returnValue
}

export const setMockFetchBalance = (returnValue: any) => {
  mockFetchBalanceReturn = returnValue
}
export const setMockFetchAddress = (returnValue: any) => {
  mockFetchAddressReturn = returnValue
}
