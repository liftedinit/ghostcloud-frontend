import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import Home from "../index"

describe("home", () => {
  it("renders the hero section", () => {
    render(<Home />)
    expect(
      screen.getByText("Decentralized Web Hosting for Humans"),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Get started" }),
    ).toBeInTheDocument()
  })
})
