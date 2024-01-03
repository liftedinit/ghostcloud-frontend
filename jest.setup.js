// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom"

jest.mock("./store/web3-auth", () => ({
  __esModule: true, // this property makes it work as a module
  default: jest.fn(() => ({
    provider: null,
    web3auth: null,
    setProvider: jest.fn(),
    setWeb3Auth: jest.fn(),
    isConnected: jest.fn(),
    getPrivateKey: jest.fn(),
    getAddress: jest.fn(),
    logout: jest.fn(),
    // ... any other methods or properties
  })),
}))
jest.mock("react-query", () => ({
  useQuery: jest.fn(),
  useQueryClient: jest.fn(),
  useMutation: jest.fn(),
}))

jest.mock("./hooks/payment/handle-payment", () =>
  jest.fn().mockReturnValue({
    handlePayment: jest.fn(),
  }),
)

export const handleLogin = jest.fn()
jest.mock("./hooks/auth/handle-login", () => ({
  useHandleLogin: () => ({
    mutate: handleLogin,
  }),
}))
export const handleLogout = jest.fn()
jest.mock("./hooks/auth/handle-logout", () => ({
  useHandleLogout: () => ({
    mutate: handleLogout,
  }),
}))
