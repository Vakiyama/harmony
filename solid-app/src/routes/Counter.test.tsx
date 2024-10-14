import { test, expect } from "vitest"
import { render } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"
import Counter from "./Counter"

const user = userEvent.setup()

test("increments value", async () => {
  const { getByRole } = render(() => <Counter />)
  const counter = getByRole('button')
  expect(counter).toHaveTextContent("1")
  await user.click(counter)
  expect(counter).toHaveTextContent("2")
})