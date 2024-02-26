import {render, screen } from '../testUtils';
import { vi } from 'vitest';
import {TextInput} from './TextInput';
import { fireEvent, cleanup } from '@testing-library/react'

const mockProps = {
  helperText: 'helper text',
  error: true,
  errorText: 'error text',
  label: 'label',
  onChange: vi.fn(),
  value: 'value',
  name: 'input',
};

const renderTextInput = (props = mockProps) => {
  return render(<TextInput {...props} />);
};


describe('TextInput', () => {
  afterEach(cleanup);
  
  it('renders a label with the correct text', () => {
    renderTextInput();
    expect(screen.getByText('label')).toBeInTheDocument();
  });

  it('renders a helper text with the correct text', () => {
    renderTextInput();
    expect(screen.getByText('helper text')).toBeInTheDocument();
  });

  it('renders an error text with the correct text', () => {
    renderTextInput();
    expect(screen.getByText('error text')).toBeInTheDocument();
  });

  it('fires the onChange function when changed', () => {
    const onChange = mockProps.onChange;
    renderTextInput({ ...mockProps, onChange });
    const input = screen.getByLabelText('input');
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(onChange).toHaveBeenCalled();
  });

});

