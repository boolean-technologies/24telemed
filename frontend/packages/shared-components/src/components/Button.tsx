import styled from 'styled-components';

export interface ButtonProps {
  color: string;
  onClick: () => void;
  label: string;
  hoverColor: string;
  activeColor: string;
  focusColor: string;
  backgroundColor: string;
}

const StyledButton = styled.button<ButtonProps>`
  background-color: ${(props) => props.backgroundColor};
    color: ${(props) => props.color};
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
      background-color: ${(props) => props.hoverColor };
    }
    &:active {
      background-color: ${(props) => props.activeColor };
    }
    &:focus {
      background-color: ${(props) => props.focusColor };
    }

    &:disabled {
      background-color: grey;
      cursor: not-allowed;
    }
    
`;

const Button = (props: ButtonProps) => {
  return (
    <StyledButton {...props} onClick={props.onClick}>
      {props.label}
    </StyledButton>
  );
};

export default Button;
