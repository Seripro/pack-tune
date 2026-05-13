import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Provider } from "../components/ui/provider";
import { supabase } from "../utils/supabase";
import type { Mock } from "vitest";
import { Login } from "../pages/Login";

beforeEach(() => {
  render(
    <Provider>
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
});

vi.mock("../utils/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
    },
  },
}));

const mockedNavigator = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return {
    ...actual,
    useNavigate: () => mockedNavigator,
  };
});

describe("Login", () => {
  it("タイトルがある", async () => {
    const title = await screen.findByRole("heading");
    expect(title).toHaveTextContent("ログイン");
  });
  it("ログインボタンがある", async () => {
    const button = await screen.findByRole("button");
    expect(button).toHaveTextContent("ログイン");
  });
  it("新規登録画面へのリンクがある", async () => {
    const link = await screen.findByRole("link");
    expect(link).toHaveTextContent("新規登録はこちら");
  });
  it("ログイン成功時、/tripsに遷移する", async () => {
    (supabase.auth.signInWithPassword as Mock).mockResolvedValue({
      error: null,
    });
    const button = await screen.findByRole("button");
    fireEvent.click(button);
    await waitFor(() => {
      expect(mockedNavigator).toHaveBeenCalledWith("/trips");
    });
  });
  it("新規登録失敗時、エラーメッセージが表示される", async () => {
    (supabase.auth.signInWithPassword as Mock).mockResolvedValue({
      error: { message: "エラーが発生しました" },
    });
    const button = await screen.findByRole("button");
    fireEvent.click(button);
    const message = await screen.findByText("エラー: エラーが発生しました");
    expect(message).toBeInTheDocument();
  });
});
