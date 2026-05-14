import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Provider } from "../components/ui/provider";
import type { Mock } from "vitest";
import { NewTrips } from "../pages/NewTrips";
import {
  getItemsByUserId,
  getTripByTitleAndPeriod,
  insertItems,
  insertTrip,
  insertTripItems,
} from "../utils/supabaseFunctions";
import { supabase } from "../utils/supabase";

beforeEach(() => {
  vi.clearAllMocks();
  render(
    <Provider>
      <MemoryRouter initialEntries={["/trips/new"]}>
        <Routes>
          <Route path="/trips/new" element={<NewTrips />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
});

vi.mock("../utils/supabaseFunctions", () => ({
  insertTrip: vi.fn(),
  insertItems: vi.fn(),
  getItemsByUserId: vi.fn(),
  getTripByTitleAndPeriod: vi.fn(),
  insertTripItems: vi.fn(),
}));

vi.mock("../utils/supabase", () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
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

const items = [
  {
    created_at: "2026-01-01",
    id: "1",
    name: "歯ブラシ",
    unused_count: 1,
    useful_count: 5,
    user_id: "123456",
  },
  {
    created_at: "2026-01-02",
    id: "2",
    name: "トランプ",
    unused_count: 1,
    useful_count: 1,
    user_id: "123456",
  },
];

const trip = [
  {
    created_at: "2026-01-02",
    end_date: "2026-05-02",
    id: "11",
    is_completed: false,
    memo: null,
    start_date: "2026-05-01",
    title: "沖縄旅行",
    user_id: "123456",
  },
];

describe("NewTrips", () => {
  it("タイトルがある", async () => {
    const title = await screen.findByRole("heading", {
      name: "新しい旅行を作成",
    });
    expect(title).toBeInTheDocument();
  });
  describe("form", () => {
    it("旅行タイトル入力欄がある", async () => {
      const titleInput =
        await screen.findByPlaceholderText("旅行のタイトルを入力");
      expect(titleInput).toBeInTheDocument();
    });
    it("開始日の選択欄がある", async () => {
      const startInput = await screen.findByPlaceholderText("開始日を選択");
      expect(startInput).toBeInTheDocument();
    });
    it("終了日の選択欄がある", async () => {
      const endInput = await screen.findByPlaceholderText("終了日を選択");
      expect(endInput).toBeInTheDocument();
    });
    it("旅行作成ボタンがある", async () => {
      const makeButton = await screen.findByRole("button", {
        name: "旅行を作成",
      });
      expect(makeButton).toBeInTheDocument();
    });
    it("旅行を作成できる", async () => {
      (insertTrip as Mock).mockResolvedValue(undefined);
      (insertItems as Mock).mockResolvedValue(undefined);
      (getItemsByUserId as Mock).mockResolvedValue(items);
      (getTripByTitleAndPeriod as Mock).mockResolvedValue(trip);
      (insertTripItems as Mock).mockResolvedValue(undefined);
      const titleInput =
        await screen.findByPlaceholderText("旅行のタイトルを入力");
      const startInput = await screen.findByPlaceholderText("開始日を選択");
      const endInput = await screen.findByPlaceholderText("終了日を選択");
      fireEvent.change(titleInput, { target: { value: "沖縄旅行" } });
      fireEvent.change(startInput, { target: { value: new Date(2026, 4, 1) } });
      fireEvent.change(endInput, { target: { value: new Date(2026, 4, 2) } });

      const makeButton = await screen.findByRole("button", {
        name: "旅行を作成",
      });
      fireEvent.click(makeButton);
      await waitFor(() => {
        expect(mockedNavigator).toHaveBeenCalledWith("/trips");
      });
    });
    describe("旅行を作成できない", () => {
      describe("タイトルがない場合、作成できない", () => {
        beforeEach(async () => {
          const startInput = await screen.findByPlaceholderText("開始日を選択");
          const endInput = await screen.findByPlaceholderText("終了日を選択");
          fireEvent.change(startInput, {
            target: { value: new Date(2026, 4, 1) },
          });
          fireEvent.change(endInput, {
            target: { value: new Date(2026, 4, 2) },
          });
          const makeButton = await screen.findByRole("button", {
            name: "旅行を作成",
          });
          fireEvent.click(makeButton);
        });

        it("遷移しない", async () => {
          await waitFor(() => {
            expect(mockedNavigator).not.toHaveBeenCalledWith("/trips");
          });
        });
        it("エラーメッセージが表示される", async () => {
          const message = await screen.findByText("タイトルを入力してください");
          expect(message).toBeInTheDocument();
        });
      });
      describe("開始日がない場合、作成できない", () => {
        beforeEach(async () => {
          const titleInput =
            await screen.findByPlaceholderText("旅行のタイトルを入力");
          const endInput = await screen.findByPlaceholderText("終了日を選択");
          fireEvent.change(titleInput, { target: { value: "沖縄旅行" } });
          fireEvent.change(endInput, {
            target: { value: new Date(2026, 4, 2) },
          });
          const makeButton = await screen.findByRole("button", {
            name: "旅行を作成",
          });
          fireEvent.click(makeButton);
        });
        it("遷移しない", async () => {
          await waitFor(() => {
            expect(mockedNavigator).not.toHaveBeenCalledWith("/trips");
          });
        });
        it("エラーメッセージが表示される", async () => {
          const message = await screen.findByText("開始日を選択してください");
          expect(message).toBeInTheDocument();
        });
      });
      describe("終了日がない場合、作成できない", () => {
        beforeEach(async () => {
          const titleInput =
            await screen.findByPlaceholderText("旅行のタイトルを入力");
          const startInput = await screen.findByPlaceholderText("開始日を選択");
          fireEvent.change(titleInput, { target: { value: "沖縄旅行" } });
          fireEvent.change(startInput, {
            target: { value: new Date(2026, 4, 1) },
          });
          const makeButton = await screen.findByRole("button", {
            name: "旅行を作成",
          });
          fireEvent.click(makeButton);
        });
        it("遷移しない", async () => {
          await waitFor(() => {
            expect(mockedNavigator).not.toHaveBeenCalledWith("/trips");
          });
        });
        it("エラーメッセージが表示される", async () => {
          const message = await screen.findByText("終了日を選択してください");
          expect(message).toBeInTheDocument();
        });
      });
      describe("終了日が開始日より前の場合、作成できない", () => {
        beforeEach(async () => {
          const titleInput =
            await screen.findByPlaceholderText("旅行のタイトルを入力");
          const startInput = await screen.findByPlaceholderText("開始日を選択");
          const endInput = await screen.findByPlaceholderText("終了日を選択");
          fireEvent.change(titleInput, { target: { value: "沖縄旅行" } });
          fireEvent.change(startInput, {
            target: { value: new Date(2026, 4, 2) },
          });
          fireEvent.change(endInput, {
            target: { value: new Date(2026, 4, 1) },
          });
          const makeButton = await screen.findByRole("button", {
            name: "旅行を作成",
          });
          fireEvent.click(makeButton);
        });
        it("遷移しない", async () => {
          await waitFor(() => {
            expect(mockedNavigator).not.toHaveBeenCalledWith("/trips");
          });
        });
        it("エラーメッセージが表示される", async () => {
          const message = await screen.findByText(
            "終了日は開始日よりも後に設定してください",
          );
          expect(message).toBeInTheDocument();
        });
      });
    });
  });
  describe("item list", () => {
    beforeEach(() => {
      (supabase.auth.getUser as Mock).mockResolvedValue({
        data: {
          user: { id: "123456" },
        },
      });
      (getItemsByUserId as Mock).mockResolvedValue(items);
    });
    it("タイトルがある", async () => {
      const title = await screen.findByRole("heading", {
        name: "持ち物リスト",
      });
      expect(title).toBeInTheDocument();
    });
    it("持ち物が表示されている", async () => {
      const itemListContainer = await screen.findByTestId("item-list");
      const item = await within(itemListContainer).findByText("歯ブラシ");
      expect(item).toBeInTheDocument();
    });
    it("持ち物を追加できる", async () => {
      const itemInput =
        await screen.findByPlaceholderText("新しいアイテムを追加");
      fireEvent.change(itemInput, { target: { value: "ドライヤー" } });

      const addButton = await screen.findByLabelText("Add");
      fireEvent.click(addButton);

      const itemListContainer = await screen.findByTestId("item-list");
      const item = await within(itemListContainer).findByText("ドライヤー");
      expect(item).toBeInTheDocument();
    });
    it("持ち物を削除できる", async () => {
      const deleteButton = await screen.findByLabelText("Delete");
      fireEvent.click(deleteButton);
      const itemListContainer = await screen.findByTestId("potential-list");
      const item = await within(itemListContainer).findByText("歯ブラシ");
      expect(item).toBeInTheDocument();
    });
  });
  describe("potential list", () => {
    it("タイトルがある", async () => {
      const title = await screen.findByRole("heading", {
        name: "候補リスト",
      });
      expect(title).toBeInTheDocument();
    });
    it("候補が表示されている", async () => {
      const potentialListContainer =
        await screen.findByTestId("potential-list");
      const item = await within(potentialListContainer).findByText("トランプ");
      expect(item).toBeInTheDocument();
    });
    it("候補から持ち物を追加できる", async () => {
      const addButton = await screen.findByText("追加");
      fireEvent.click(addButton);
      const itemListContainer = await screen.findByTestId("item-list");
      const item = await within(itemListContainer).findByText("トランプ");
      expect(item).toBeInTheDocument();
    });
    it("候補から追加したアイテムを削除すると候補リストに戻る", async () => {
      const addButton = await screen.findByText("追加");
      fireEvent.click(addButton);

      const itemListContainer = await screen.findByTestId("item-list");
      const item = await within(itemListContainer).findByText("トランプ");
      const itemParent = item.parentElement;
      const deleteButton = await within(itemParent!).findByLabelText("Delete");
      fireEvent.click(deleteButton);

      const potentialListContainer =
        await screen.findByTestId("potential-list");
      const potentialItem = await within(potentialListContainer).findByText(
        "トランプ",
      );
      expect(potentialItem).toBeInTheDocument();
    });
  });
});
