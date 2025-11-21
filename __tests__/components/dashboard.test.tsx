/// <reference lib="dom" />

import { describe, it, expect, beforeEach, afterEach } from "bun:test"
import { render, screen, fireEvent, cleanup } from "@testing-library/react"
import {
  setupAuthHandlersMock,
  setupWeb3AuthStoreMock,
  setupThemeMock,
  setupGhostcloudMock,
  setMockFetchMetas,
  mockRefetch,
  mockHandlePageClick,
} from "../setup/mocks"

setupAuthHandlersMock()
setupWeb3AuthStoreMock()
setupThemeMock()
setupGhostcloudMock()

describe("Dashboard", () => {
  beforeEach(() => {
    mockRefetch.mockClear()
    mockHandlePageClick.mockClear()
  })

  afterEach(() => {
    cleanup()
  })

  it("renders spinner if loading", async () => {
    setMockFetchMetas([
      {
        data: { meta: [] },
        isLoading: true,
        refetch: mockRefetch,
      },
      0,
      0,
      mockHandlePageClick,
    ])

    const { default: Dashboard } = await import("@/components/dashboard")
    const { container } = render(<Dashboard />)
    expect(container.querySelector(".chakra-spinner")).toBeInTheDocument()
  })

  it("renders create deployment button if logged in", async () => {
    setMockFetchMetas([
      {
        data: { meta: [] },
        isLoading: false,
        refetch: mockRefetch,
      },
      0,
      0,
      mockHandlePageClick,
    ])

    const { default: Dashboard } = await import("@/components/dashboard")
    render(<Dashboard />)
    const btn = screen.getByText("Create Deployment")
    expect(btn).toBeInTheDocument()
    fireEvent.click(btn)
    expect(screen.getByText("File (Max 5MB)")).toBeInTheDocument()
  })

  it("renders list of deployments", async () => {
    setMockFetchMetas([
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
        refetch: mockRefetch,
      },
      0,
      0,
      mockHandlePageClick,
    ])

    const { default: Dashboard } = await import("@/components/dashboard")
    render(<Dashboard />)
    expect(screen.getByText("test_name")).toBeInTheDocument()
    expect(screen.getByText("test_description")).toBeInTheDocument()
    expect(screen.getByText("test.com")).toBeInTheDocument()
  })

  describe("Pagination", () => {
    it("renders pagination if pageCount is greater than 1", async () => {
      setMockFetchMetas([
        {
          data: {
            meta: [],
          },
          isLoading: false,
          refetch: mockRefetch,
        },
        1,
        2,
        mockHandlePageClick,
      ])

      const { default: Dashboard } = await import("@/components/dashboard")
      render(<Dashboard />)
      const prevBtn = screen.getByTestId("previous-button")
      const nextBtn = screen.getByTestId("next-button")
      expect(prevBtn).toBeInTheDocument()
      expect(nextBtn).toBeInTheDocument()
      expect(prevBtn).toHaveAttribute("disabled")
      expect(nextBtn).not.toHaveAttribute("disabled")
      expect(screen.getByTestId("page-info")).toHaveTextContent("1 / 2")
    })

    it("does not render pagination if pageCount is 1", async () => {
      setMockFetchMetas([
        {
          data: {
            meta: [],
          },
          isLoading: false,
          refetch: mockRefetch,
        },
        1,
        1,
        mockHandlePageClick,
      ])

      const { default: Dashboard } = await import("@/components/dashboard")
      render(<Dashboard />)
      expect(screen.queryByTestId("previous-button")).not.toBeInTheDocument()
      expect(screen.queryByTestId("next-button")).not.toBeInTheDocument()
      expect(screen.queryByTestId("page-info")).not.toBeInTheDocument()
    })

    it("previous button is disabled on first page", async () => {
      setMockFetchMetas([
        {
          data: {
            meta: [],
          },
          isLoading: false,
          refetch: mockRefetch,
        },
        1,
        2,
        mockHandlePageClick,
      ])

      const { default: Dashboard } = await import("@/components/dashboard")
      render(<Dashboard />)
      expect(screen.getByTestId("previous-button")).toHaveAttribute("disabled")
    })

    it("next button is disabled on last page", async () => {
      setMockFetchMetas([
        {
          data: {
            meta: [],
          },
          isLoading: false,
          refetch: mockRefetch,
        },
        2,
        2,
        mockHandlePageClick,
      ])

      const { default: Dashboard } = await import("@/components/dashboard")
      render(<Dashboard />)
      expect(screen.getByTestId("next-button")).toHaveAttribute("disabled")
    })
  })
})
