/// <reference lib="dom" />

import { describe, it, expect, afterEach } from "bun:test"
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react"
import { setupThemeMock, setupGhostcloudMock } from "../setup/mocks"

setupThemeMock()
setupGhostcloudMock()

describe("CreateDeploymentModal", () => {
  afterEach(() => {
    cleanup()
  })

  it("renders form elements", async () => {
    const { default: CreateDeploymentModal } = await import(
      "@/components/create-deployment"
    )
    const mockOnClose = () => {}

    render(<CreateDeploymentModal isOpen={true} onClose={mockOnClose} />)
    expect(screen.getByText("Create Deployment")).toBeInTheDocument()

    const description = screen.queryByTestId(
      "description",
    ) as HTMLTextAreaElement
    expect(description).toBeInTheDocument()
    fireEvent.change(description, { target: { value: "A description" } })
    await waitFor(() =>
      expect((description as HTMLTextAreaElement).value).toBe("A description"),
    )

    const domain = screen.queryByTestId("domain") as HTMLInputElement
    expect(domain).toBeInTheDocument()
    fireEvent.change(domain, { target: { value: "A domain" } })
    await waitFor(() =>
      expect((domain as HTMLInputElement).value).toBe("A domain"),
    )

    const memo = screen.queryByTestId("memo") as HTMLTextAreaElement
    expect(memo).toBeInTheDocument()
    fireEvent.change(memo, { target: { value: "A memo" } })
    await waitFor(() =>
      expect((memo as HTMLTextAreaElement).value).toBe("A memo"),
    )
  })
})
