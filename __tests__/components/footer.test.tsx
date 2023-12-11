import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import Footer from "../../components/footer"

describe("Footer", () => {
  it("renders links", () => {
    render(<Footer />)
    expect(screen.getByText("Home")).toBeInTheDocument()
    expect(screen.getByText("Terms Of Service")).toBeInTheDocument()
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument()
  })
})
