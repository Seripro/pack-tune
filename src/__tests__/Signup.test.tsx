import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Signup } from "../pages/Signup";
import { Provider } from "../components/ui/provider";
import { supabase } from "../utils/supabase";
import type { Mock } from "vitest";

beforeEach(() => {
  render(
    <Provider>
      <MemoryRouter initialEntries={["/signup"]}>
        <Routes>
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
});

vi.mock("../utils/supabase", () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
    },
  },
}));

describe("Signup", () => {
  it("タイトルがある", async () => {
    const title = await screen.findByRole("heading");
    expect(title).toHaveTextContent("新規登録");
  });
  it("新規登録ボタンがある", async () => {
    const button = await screen.findByRole("button");
    expect(button).toBeInTheDocument();
  });
  it("新規登録成功時、メッセージが表示される", async () => {
    (supabase.auth.signUp as Mock).mockResolvedValue({
      error: null,
    });
    const button = await screen.findByRole("button");
    fireEvent.click(button);
    const message = await screen.findByText(
      "確認メールを送信しました。メールボックスを確認してください。",
    );
    expect(message).toBeInTheDocument();
  });
  it("新規登録失敗時、エラーメッセージが表示される", async () => {
    (supabase.auth.signUp as Mock).mockResolvedValue({
      error: { message: "エラーが発生しました" },
    });
    const button = await screen.findByRole("button");
    fireEvent.click(button);
    const message = await screen.findByText("エラー: エラーが発生しました");
    expect(message).toBeInTheDocument();
  });
});
