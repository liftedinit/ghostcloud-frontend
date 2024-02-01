// @ts-nocheck
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import CreateDeploymentModal from "../../components/create-deployment"

jest.mock("react-query", () => ({
  useQuery: jest.fn(),
  useQueryClient: jest.fn(),
  useMutation: jest.fn(),
}))

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

describe("CreateDeploymentModal", () => {
  it("renders form elements", async () => {
    render(<CreateDeploymentModal isOpen={true} onClose={jest.fn()} />)
    expect(screen.getByText("Create Deployment")).toBeInTheDocument()

    const description = screen.queryByTestId("description")
    expect(description).toBeInTheDocument()
    fireEvent.change(description, { target: { value: "A description" } })
    await waitFor(() => expect(description.value).toBe("A description"))

    const domain = screen.queryByTestId("domain")
    expect(domain).toBeInTheDocument()
    fireEvent.change(domain, { target: { value: "A domain" } })
    await waitFor(() => expect(domain.value).toBe("A domain"))

    const memo = screen.queryByTestId("memo")
    expect(memo).toBeInTheDocument()
    fireEvent.change(memo, { target: { value: "A memo" } })
    await waitFor(() => expect(memo.value).toBe("A memo"))
  })
})
