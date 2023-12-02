import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import Menu from "../menu"

describe("Menu", () => {
  it("renders menu options correctly", () => {
    render(<Menu />)
    expect(screen.getByText("Login")).toBeInTheDocument()
  })
})
