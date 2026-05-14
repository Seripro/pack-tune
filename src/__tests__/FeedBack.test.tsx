import userEvent from "@testing-library/user-event";
import { Provider } from "../components/ui/provider";
import { FeedBack } from "../pages/FeedBack";
import { supabase } from "../utils/supabase";
import {
  getItemsByUserId,
  getItemsForAllColumnByTripId,
  incrementUnused,
  incrementUseful,
  updateCompleted,
} from "../utils/supabaseFunctions";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes, useParams } from "react-router-dom";
import type { Mock } from "vitest";

vi.mock("../utils/supabase", () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
  },
}));

vi.mock("../utils/supabaseFunctions", () => ({
  getItemsForAllColumnByTripId: vi.fn(),
  getItemsByUserId: vi.fn(),
  incrementUseful: vi.fn(),
  incrementUnused: vi.fn(),
  updateCompleted: vi.fn(),
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
    useParams: vi.fn(),
  };
});

const tripItems = [
  {
    items: {
      created_at: "2026-01-01",
      id: "1",
      name: "歯ブラシ",
      unused_count: 0,
      useful_count: 0,
      user_id: "123456",
    },
  },
];

const allItems = [
  {
    created_at: "2026-01-01",
    id: "1",
    name: "歯ブラシ",
    unused_count: 0,
    useful_count: 0,
    user_id: "123456",
  },
  {
    created_at: "2026-01-01",
    id: "2",
    name: "薬",
    unused_count: 0,
    useful_count: 0,
    user_id: "123456",
  },
];

beforeEach(() => {
  vi.clearAllMocks();
  (useParams as Mock).mockReturnValue({ tripId: "1" });
  (supabase.auth.getUser as Mock).mockResolvedValue({
    data: {
      user: { id: "123456" },
    },
  });
  (getItemsForAllColumnByTripId as Mock).mockResolvedValue(tripItems);
  (getItemsByUserId as Mock).mockResolvedValue(allItems);
  (incrementUseful as Mock).mockResolvedValue(undefined);
  (incrementUnused as Mock).mockResolvedValue(undefined);
  (updateCompleted as Mock).mockResolvedValue(undefined);
  render(
    <Provider>
      <MemoryRouter initialEntries={[`/trips/1/feedback`]}>
        <Routes>
          <Route path="/trips/:tripId/feedback" element={<FeedBack />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
});

describe("feedback", () => {
  it("タイトルがある", async () => {
    const title = await screen.findByRole("heading", { name: "ふりかえり" });
    expect(title).toBeInTheDocument();
  });
  it("ふりかえりを終了すると/tripsに遷移する", async () => {
    const button = await screen.findByRole("button", {
      name: "ふりかえりを終了する",
    });
    fireEvent.click(button);
    await waitFor(async () => {
      expect(mockedNavigator).toHaveBeenCalledWith("/trips");
    });
  });
  describe("使わなかったアイテム", () => {
    it("タイトルがある", async () => {
      const title = await screen.findByRole("heading", {
        name: "使わなかったアイテム",
      });
      expect(title).toBeInTheDocument();
    });
    it("旅行に持っていったアイテムが表示されている", async () => {
      const unusedContainer = (
        await screen.findByRole("heading", {
          name: "使わなかったアイテム",
        })
      ).parentElement?.parentElement;
      const item = await within(unusedContainer!).findByText("歯ブラシ");
      expect(item).toBeInTheDocument();
    });
    it("チェックがつけられる", async () => {
      const unusedContainer = (
        await screen.findByRole("heading", {
          name: "使わなかったアイテム",
        })
      ).parentElement?.parentElement;
      const checkbox = await within(unusedContainer!).findByRole("checkbox");
      await userEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });
  });
  describe("追加すればよかったアイテム", () => {
    it("タイトルがある", async () => {
      const title = await screen.findByRole("heading", {
        name: "追加すればよかったアイテム",
      });
      expect(title).toBeInTheDocument();
    });
    it("旅行に持っていかなかったアイテムが表示されている", async () => {
      const unusedContainer = (
        await screen.findByRole("heading", {
          name: "追加すればよかったアイテム",
        })
      ).parentElement?.parentElement;
      const item = await within(unusedContainer!).findByText("薬");
      expect(item).toBeInTheDocument();
    });
    it("旅行に持っていったアイテムは追加すればよかったアイテムの中には存在しない", async () => {
      const unusedContainer = (
        await screen.findByRole("heading", {
          name: "追加すればよかったアイテム",
        })
      ).parentElement?.parentElement;
      const item = await within(unusedContainer!).queryByText("歯ブラシ");
      expect(item).not.toBeInTheDocument();
    });
    it("チェックがつけられる", async () => {
      const unusedContainer = (
        await screen.findByRole("heading", {
          name: "追加すればよかったアイテム",
        })
      ).parentElement?.parentElement;
      const checkbox = await within(unusedContainer!).findByRole("checkbox");
      await userEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });
  });
});
