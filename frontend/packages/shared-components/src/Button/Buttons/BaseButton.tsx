import React from 'react'
import styled from 'styled-components';
interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  backgroundColor?: string;
  color: string;
}

const BaseButton = (props: ButtonProps) => {
  return (
    <div>BaseButton</div>
  )
}

export default BaseButton;

const Button = styled.button<Pick<ButtonProps, 'backgroundColor' | 'color'>>`
  background-color: ${props => props.backgroundColor};
  color: $${({ theme, color }) => color || theme.colors.primary};
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #f2f2f2;
  }
`;



