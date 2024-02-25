import { render, screen } from "../testUtils";
import {BottomSheetComponent } from './BottomSheetComponent'

describe("BottomSheet", () => {
  it("should render properly", () => {
    
    render(
      <BottomSheetComponent onClickCancel={() => {}}>
        <div>BottomSheet Content</div>
      </BottomSheetComponent>
    );
    const el = screen.getByText("BottomSheet Content");
    expect(el).toBeInTheDocument();
    expect(el).toMatchSnapshot();
  });

  it("should render title properly", () => {
    render(
      <BottomSheetComponent onClickCancel={() => {}} title="BottomSheet Title">
        <div>BottomSheet Content</div>
      </BottomSheetComponent>
    );
    const el = screen.getByText("BottomSheet Title");
    expect(el).toBeInTheDocument();
    expect(el).toMatchSnapshot();
  });

});
