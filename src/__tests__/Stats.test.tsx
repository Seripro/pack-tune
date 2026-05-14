import { Provider } from "@/components/ui/provider";
import { Stats } from "@/pages/Stats";
import { supabase } from "@/utils/supabase";
import { getItemsByUserId } from "@/utils/supabaseFunctions";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { Mock } from "vitest";

vi.mock("../utils/supabaseFunctions", () => ({
  getItemsByUserId: vi.fn(),
}));

vi.mock("../utils/supabase", () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
  },
}));

const items = [
  {
    created_at: "2026-01-01",
    id: "1",
    name: "歯ブラシ",
    unused_count: 0,
    useful_count: 5,
    user_id: "123456",
  },
  {
    created_at: "2026-01-01",
    id: "2",
    name: "薬",
    unused_count: 0,
    useful_count: 3,
    user_id: "123456",
  },
  {
    created_at: "2026-01-01",
    id: "3",
    name: "ドライヤー",
    unused_count: 0,
    useful_count: 2,
    user_id: "123456",
  },
];

beforeEach(() => {
  (supabase.auth.getUser as Mock).mockResolvedValue({
    data: {
      user: { id: "123456" },
    },
  });
  (getItemsByUserId as Mock).mockResolvedValue(items);
  render(
    <Provider>
      <MemoryRouter initialEntries={[`/items/stats`]}>
        <Routes>
          <Route path="/items/stats" element={<Stats />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
});

describe("stats", () => {
  it("タイトルがある", async () => {
    const title = await screen.findByRole("heading", { name: "統計" });
    expect(title).toBeInTheDocument();
  });
  it("よく使うアイテムが表示されている", async () => {
    const item1 = await screen.findByText("歯ブラシ");
    const item2 = await screen.findByText("薬");
    expect(item1).toBeInTheDocument();
    expect(item2).toBeInTheDocument();
  });
  it("あまり使わないアイテムは表示されていない", async () => {
    const item = await screen.queryByText("ドライヤー");
    expect(item).not.toBeInTheDocument();
  });
});
