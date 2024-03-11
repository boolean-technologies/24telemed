import {render, screen } from '../testUtils';
import { vi } from 'vitest';
import { fireEvent, cleanup } from '@testing-library/react'
import {PasswordInput} from './PasswordInput';

const mockProps = {
  helperText: 'helper text',
  error: true,
  errorText: 'error text',
  label: 'label',
  onChange: vi.fn(),
  value: 'value',
  name: 'input',
  type: 'password',
  placeholder: 'placeholder',
};

const renderPasswordInput = (props = mockProps) => {
  return render(<PasswordInput {...props} />);
};

describe('PasswordInput', () => {
  afterEach(cleanup);
  
  it('renders a label with the correct text', () => {
    renderPasswordInput();
    expect(screen.getByText('label')).toBeInTheDocument();
  });

  it('renders a helper text with the correct text', () => {
    renderPasswordInput();
    expect(screen.getByText('helper text')).toBeInTheDocument();
  });

  it('renders an error text with the correct text', () => {
    renderPasswordInput();
    expect(screen.getByText('error text')).toBeInTheDocument();
  });

  it('fires the onChange function when changed', () => {
    const onChange = mockProps.onChange;
    renderPasswordInput({ ...mockProps, onChange });
    const input = screen.getByLabelText('input');
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(onChange).toHaveBeenCalled();
  });

});


