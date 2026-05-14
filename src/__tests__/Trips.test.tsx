import { supabase } from "@/utils/supabase";
import { Provider } from "../components/ui/provider";
import { Trips } from "../pages/Trips";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { Mock } from "vitest";
import { getTripsByUserId } from "@/utils/supabaseFunctions";

vi.mock("../utils/supabase", () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
  },
}));

vi.mock("../utils/supabaseFunctions", () => ({
  getTripsByUserId: vi.fn(),
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

const trips = [
  {
    created_at: "2026-01-01",
    end_date: "2026-05-02",
    id: "1",
    is_completed: false,
    memo: null,
    start_date: "2026-05-01",
    title: "沖縄旅行",
    user_id: "123456",
  },
];

beforeEach(() => {
  vi.clearAllMocks();
  (supabase.auth.getUser as Mock).mockResolvedValue({
    data: {
      user: { id: "123456" },
    },
  });
  (getTripsByUserId as Mock).mockResolvedValue(trips);
  render(
    <Provider>
      <MemoryRouter initialEntries={["/trips"]}>
        <Routes>
          <Route path="/trips" element={<Trips />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
});

describe("trips", () => {
  it("タイトルがある", async () => {
    const title = await screen.findByRole("heading", { name: "Trips" });
    expect(title).toBeInTheDocument();
  });
  it("旅行のタイトルがある", async () => {
    const title = await screen.findByRole("heading", { name: "沖縄旅行" });
    expect(title).toBeInTheDocument();
  });
  it("旅行の期間がある", async () => {
    const period = await screen.findByText("日程：2026-05-01 〜 2026-05-02");
    expect(period).toBeInTheDocument();
  });
  it("未完了のラベルがある", async () => {
    const label = await screen.findByText("未完了");
    expect(label).toBeInTheDocument();
  });
  it("旅行の詳細画面へのリンクがある", async () => {
    const title = await screen.findByRole("heading", { name: "沖縄旅行" });
    const link = title.parentElement?.parentElement?.parentElement;
    expect(link).toHaveAttribute("href", `/trips/${trips[0].id}`);
  });
  it("新しい旅行ボタンがある", async () => {
    const button = await screen.findByRole("button", { name: "新しい旅行" });
    expect(button).toBeInTheDocument();
  });
  it("旅行作成画面に遷移する", async () => {
    const button = await screen.findByRole("button", { name: "新しい旅行" });
    fireEvent.click(button);
    await waitFor(() => {
      expect(mockedNavigator).toHaveBeenCalledWith("/trips/new");
    });
  });
});
