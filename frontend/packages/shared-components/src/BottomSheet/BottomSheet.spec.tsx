import { ByRoleOptions, mediaQueries, render, screen } from "../testUtils";
import { get } from "lodash-es";
import { colorVariants, defaultTheme } from "../styles";
import {BottomSheetComponent, BottomSheetComponentProps} from './BottomSheetComponent'

describe("BottomSheet", () => {
  it("should render properly", () => {
    const onClickCancel = jest.fn();
    render(
      <BottomSheetComponent onClickCancel={onClickCancel}>
        <div>BottomSheet Content</div>
      </BottomSheetComponent>
    );
    const el = screen.getByText("BottomSheet Content");
    expect(el).toBeInTheDocument();
    expect(el).toMatchSnapshot();
  });
});
```