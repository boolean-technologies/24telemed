import {render, screen } from '../testUtils';
import { vi } from 'vitest';
import { BaseInput } from './BaseInput';
import { fireEvent, cleanup } from '@testing-library/react'


const mockProps = {
  name: 'input',
  value: 'value',
  onChange: vi.fn(),
  error: false,
};

const renderBaseInput = (props = mockProps) => {
  return render(<BaseInput {...props} />);
};


describe('BaseInput', () => {
  afterEach(cleanup);
  
  it('renders an input with the correct name', () => {
    renderBaseInput();
    expect(screen.getByLabelText('input')).toBeInTheDocument();
  });

  it('renders an input with the correct value', () => {
    renderBaseInput();
    expect(screen.getByDisplayValue('value')).toBeInTheDocument();
  });

  it('fires the onChange function when changed', () => {
    const onChange = mockProps.onChange;
    renderBaseInput({ ...mockProps, onChange });
    const input = screen.getByLabelText('input');
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(onChange).toHaveBeenCalled();
  });

});
