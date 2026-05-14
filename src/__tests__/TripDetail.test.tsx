import userEvent from "@testing-library/user-event";
import { Provider } from "../components/ui/provider";
import { TripDetail } from "../pages/TripDetail";
import { supabase } from "../utils/supabase";
import {
  deleteTripItem,
  getItemsByTripId,
  getTripByTripId,
  insertItems,
} from "../utils/supabaseFunctions";
import { fireEvent, screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import type { Mock } from "vitest";

vi.mock("../utils/supabaseFunctions", () => ({
  getTripByTripId: vi.fn(),
  getItemsByTripId: vi.fn(),
  insertItems: vi.fn(),
  deleteTripItem: vi.fn(),
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
    useLocation: vi.fn(),
  };
});

vi.mock("../utils/supabase", () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
  },
}));

const trip = {
  created_at: "2026-01-01",
  end_date: "2026-05-02",
  id: "1",
  is_completed: false,
  memo: null,
  start_date: "2026-05-01",
  title: "沖縄旅行",
  user_id: "123456",
};

const items = [
  {
    item_id: "1",
    is_checked: false,
    items: {
      id: "1",
      name: "歯ブラシ",
    },
  },
];

type argType = {
  user_id: string;
  name: string;
};

beforeEach(() => {
  vi.clearAllMocks();
  (supabase.auth.getUser as Mock).mockResolvedValue({
    data: {
      user: { id: "123456" },
    },
  });
  (useParams as Mock).mockReturnValue({ tripId: "1" });
  (getTripByTripId as Mock).mockResolvedValue(trip);
  (getItemsByTripId as Mock).mockResolvedValue(items);
  vi.mocked(useLocation).mockReturnValue({
    state: {
      title: "沖縄旅行",
      is_completed: false,
    },
  } as ReturnType<typeof useLocation>);
  (insertItems as Mock).mockImplementation((arg: argType[]) => {
    return [
      {
        created_at: "2026-01-01",
        id: "2",
        name: arg[0].name,
        unused_count: "0",
        useful_count: "0",
        user_id: arg[0].user_id,
      },
    ];
  });
  (deleteTripItem as Mock).mockResolvedValue(undefined);
  render(
    <Provider>
      <MemoryRouter initialEntries={[`/trips/${trip.id}`]}>
        <Routes>
          <Route path="/trips/:id" element={<TripDetail />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
});

describe("trip detail", () => {
  it("旅行のタイトルがある", async () => {
    const title = await screen.findByRole("heading", { name: "沖縄旅行" });
    expect(title).toBeInTheDocument();
  });
  it("持ち物が表示されている", async () => {
    const item = await screen.findByText("歯ブラシ");
    expect(item).toBeInTheDocument();
  });
  it("アイテムを追加できる", async () => {
    const input = await screen.findByPlaceholderText("持ち物を追加");
    fireEvent.change(input, { target: { value: "薬" } });
    const button = await screen.findByLabelText("Add Item");
    fireEvent.click(button);
    const item = await screen.findByText("薬");
    expect(item).toBeInTheDocument();
  });
  it("アイテムを削除できる", async () => {
    const deleteButton = await screen.findByLabelText("Delete");
    fireEvent.click(deleteButton);
    await waitFor(async () => {
      const item = await screen.findByText("歯ブラシ");
      screen.debug();
      expect(item).not.toBeInTheDocument();
    });
  });
  it("アイテムにチェックをつけられる", async () => {
    const checkbox = await screen.findByRole("checkbox");
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });
  it("旅行を終了するを押すとふりかえり画面に遷移する", async () => {
    const finishButton = await screen.findByRole("button", {
      name: "旅行を終了する",
    });
    fireEvent.click(finishButton);
    expect(mockedNavigator).toHaveBeenCalledWith(`/trips/${trip.id}/feedback`);
  });
  it("完了した旅行の場合、旅行終了ボタンがない", async () => {
    vi.mocked(useLocation).mockReturnValue({
      state: {
        title: "神奈川旅行",
        is_completed: true,
      },
    } as ReturnType<typeof useLocation>);
    const finishButton = await screen.queryByRole("button", {
      name: "旅行を終了する",
    });
    expect(finishButton).not.toBeInTheDocument();
  });
});
