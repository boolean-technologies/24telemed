import styled from 'styled-components';

export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  icon?: string;
}

const StyledInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
  }

    &:focus {
        outline: none;
        border-color: ${(props) => props.theme.colors.secondary};
    }
    & img {
        margin-right: 10px;
    }

`;

export function Input(props: InputProps) {
  return (
    <div>
      {props.icon && <img src={props.icon} alt="icon" />}
      <StyledInput
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
}
