import { Provider } from "@/components/ui/provider";
import { NotFound } from "@/pages/NotFound";
import { fireEvent, screen } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

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

beforeEach(() => {
  render(
    <Provider>
      <MemoryRouter initialEntries={[`/404`]}>
        <Routes>
          <Route path="/404" element={<NotFound />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
});

describe("not found", () => {
  it("404が表示されている", async () => {
    const title = await screen.findByRole("heading", { name: "404" });
    expect(title).toBeInTheDocument();
  });
  it("ボタンを押すと/tripsに遷移する", async () => {
    const button = await screen.findByRole("button", {
      name: "旅行一覧に戻る",
    });
    fireEvent.click(button);
    expect(mockedNavigator).toHaveBeenCalledWith("/trips");
  });
});
