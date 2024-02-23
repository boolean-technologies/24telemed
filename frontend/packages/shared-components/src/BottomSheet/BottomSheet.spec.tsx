import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from '../styles/defaultTheme';
import { BottomSheetComponent } from './BottomSheetComponent';


const TestBottomSheet = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <BottomSheetComponent title="Filter" onClickCancel={() => {}}>
        This is a bottom sheet content
      </BottomSheetComponent>
    </ThemeProvider>
  );
};


describe('BottomSheet', () => {
  it('should render the bottom sheet', () => {
    render(<TestBottomSheet />);
    expect(screen.getByText('Filter')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<TestBottomSheet />);
    expect(container).toMatchSnapshot();
  });
});
