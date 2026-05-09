import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Signup } from "../pages/Signup";

beforeEach(() => {
  render(
    <MemoryRouter initialEntries={["/signup"]}>
      <Routes>
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </MemoryRouter>,
  );
});

describe("Signup", () => {
  it("新規登録ボタンがある", async () => {
    const button = await screen.findByRole("button");
    expect(button).toBeInTheDocument();
  });
});
