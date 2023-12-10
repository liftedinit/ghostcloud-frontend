import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import Home from "../index"

describe("Home", () => {
  it("renders the home page", () => {
    render(<Home />)
    expect(
      screen.getByText("Decentralized Web Hosting for Humans"),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Get started" }),
    ).toBeInTheDocument()
  })
})
