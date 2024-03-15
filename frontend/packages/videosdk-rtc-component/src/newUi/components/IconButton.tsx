import { Badge, Button, ButtonProps, Tooltip } from 'antd';
import styled, { css, useTheme } from 'styled-components';
import {
  IonIcon,
  PaletteVariants,
  ShadowVariants,
  SpacingVariants,
  Theme,
} from '@local/shared-components';
import { get } from 'lodash-es';

export type ButtonVariants = 'primary1' | 'primary2' | 'primaryDanger';

interface ButtonStateDescription {
  border: PaletteVariants;
  background: PaletteVariants;
  text: PaletteVariants;
  shadow: ShadowVariants;
}

type VariantsDescription = {
  [key in ButtonVariants]: ButtonStateDescription;
};

const variants: VariantsDescription = {
  primary1: {
    border: 'primary1.light',
    background: 'primary1.light',
    text: 'primary2.main',
    shadow: 'lg',
  },
  primary2: {
    border: 'primary2.main',
    background: 'primary2.main',
    text: 'primary1.main',
    shadow: 'lg',
  },
  primaryDanger: {
    border: 'error',
    background: 'error',
    text: 'common.white',
    shadow: 'lg',
  },
};

function makeButtonColor({
  theme,
  variant = 'primary1',
  isLoading = false,
}: {
  theme: Theme;
  variant?: ButtonVariants;
  isLoading?: boolean;
}) {
  const variantDesc = variants[variant];

  return css`
    background-color: ${get(theme.palette, variantDesc.background)};
    color: ${get(theme.palette, variantDesc.text)};
    outline-color: ${get(theme.palette, variantDesc.border)};
    outline-width: 2px;
    outline-style: solid;
    outline-offset: -2px;
    border: none;
    box-shadow: ${get(theme.shadows, variantDesc.shadow)};

    ion-icon {
      color: ${get(theme.palette, variantDesc.text)} !important;
    }

    &:hover:enabled {
      background-color: ${get(theme.palette, 'primary1.light')};
      color: ${get(theme.palette, 'primary1.main')};
      outline: none;
      box-shadow: ${get(theme, 'shadows.lg')};
    }

    &:active:enabled {
      background-color: ${get(theme.palette, 'background.white')};
      color: ${get(theme.palette, 'primary1.main')};
      outline: none;
      box-shadow: ${get(theme, 'shadows.inset')};
    }

    ${isLoading &&
    css`
      background-color: ${get(theme.palette, 'background.white')};
      color: ${get(theme.palette, 'primary1.main')};
      outline: none;
      box-shadow: ${get(theme, 'shadows.inset')};
      pointer-events: none;
    `}
  `;
}

type IconButtonProps = {
  icon: string;
  onClick: () => void;
  variant?: ButtonVariants;
  isLoading?: boolean;
  disabled?: boolean;
  tooltip?: string;
  badgeCount?: number;
  size?: "large" | "small" | "middle";
};

export function IconButton({
  icon,
  onClick,
  variant = 'primary1',
  isLoading,
  disabled,
  tooltip,
  badgeCount,
  size,
}: IconButtonProps) {
  const variantDesc = variants[variant];
  const theme = useTheme() as Theme;

  const iconSize: Record<string, SpacingVariants> = {
    large: "md",
    small: "sm",
    middle: "sm"
  }

  return (
    <Tooltip title={tooltip} color={get(theme.palette, variantDesc.background)}>
      <Badge
        count={badgeCount}
        overflowCount={9}
        style={{ fontWeight: 'bold', boxShadow: 'none' }}
      >
        <StyledButton
          type="primary"
          icon={<IonIcon name={icon} outlined color="common.white" size={size ? iconSize[size] : "md"} />}
          onClick={onClick}
          variant={variant}
          isLoading={isLoading}
          disabled={disabled}
          size={size}
        />
      </Badge>
    </Tooltip>
  );
}

const StyledButton = styled(Button)<ButtonProps | IconButtonProps>`
  ${({ size = "large" }) => {
    const width = {
      large: 55,
      small: 34,
      middle: 45
    }

    return css`
      width: ${width[size]}px;
      height: ${width[size]}px;
      min-width: ${width[size]}px;
      border-radius: ${18 * width[size] / 55}px;
    `
  }}
  
  .ant-btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  ${makeButtonColor};
`;
