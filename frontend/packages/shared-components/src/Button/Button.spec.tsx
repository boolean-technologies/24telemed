import '@testing-library/jest-dom/extend-expect'
import Button from './Button';
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, Mock } from "vitest";

describe('Button', () => {
  
  it('renders a button', () => {
    render(<Button label="Click me" color="white" backgroundColor="blue" hoverColor="lightblue" activeColor="darkblue" focusColor="lightblue" onClick={() => console.log('clicked')} />);
    const button = screen.getByText('Click me');
    expect(button).toBeInTheDocument();
  });
  it('matches snapshot', () => {
    const { asFragment } = render(<Button label="Click me" color="white" backgroundColor="blue" hoverColor="lightblue" activeColor="darkblue" focusColor="lightblue" onClick={() => console.log('clicked')} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
