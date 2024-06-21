import { Badge, Button, ButtonProps, Dropdown, MenuProps, Tooltip } from 'antd';
import styled, { css, useTheme } from 'styled-components';
import {
  Flex,
  IonIcon,
  PaletteVariants,
  ShadowVariants,
  SpacingVariants,
  Theme,
  Typography,
} from '@local/shared-components';
import { get } from 'lodash-es';

export type ButtonVariants = 'primary1' | 'primary2' | 'primary3' | 'primaryDanger';

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
  primary3: {
    border: 'common.transparent',
    background: 'common.transparent',
    text: 'primary2.main',
    shadow: 'none',
  }
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
    // outline-color: ${get(theme.palette, variantDesc.border)};
    // outline-width: 2px;
    // outline-style: solid;
    // outline-offset: -2px;
    // border: none;
    box-shadow: ${get(theme.shadows, variantDesc.shadow)};

    ion-icon {
      color: ${get(theme.palette, variantDesc.text)} !important;
    }

    &:hover:enabled {
      background-color: ${get(theme.palette, 'primary1.light')};
      color: ${get(theme.palette, variantDesc.background)};
      outline: none;
      box-shadow: ${get(theme, 'shadows.lg')};
      ion-icon {
        color: ${get(theme.palette, variantDesc.background)} !important;
      }
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
  iconBold?: boolean;
  size?: 'large' | 'small' | 'middle';
  className?: string;
  items?: MenuProps['items'];
  badgeIsDot?: boolean;
  label?: string;
};

export function IconButton({
  icon,
  onClick,
  variant = 'primary1',
  isLoading,
  disabled,
  tooltip,
  badgeCount,
  badgeIsDot,
  size,
  iconBold,
  className,
  items = [],
  label,
}: IconButtonProps) {
  const variantDesc = variants[variant];
  const theme = useTheme() as Theme;

  const iconSize: Record<string, SpacingVariants> = {
    large: 'md',
    small: 'sm',
    middle: 'sm',
  };

  const mainButton = (
    <StyledButton
      type="primary"
      icon={
        <IonIcon
          name={icon}
          outlined={iconBold ? false : true}
          color="common.white"
          size={size ? iconSize[size] : 'md'}
        />
      }
      onClick={onClick}
      variant={variant}
      isLoading={isLoading}
      disabled={disabled}
      size={size}
      className={className}
      outlined={!items.length}
    />
  );

  return (
    <Tooltip title={tooltip} color={get(theme.palette, variantDesc.background)}>
      <Badge
        count={badgeCount}
        overflowCount={9}
        style={{ fontWeight: 'bold', boxShadow: 'none' }}
        dot={badgeIsDot}
      >
        <Flex direction="column" gap="xxs" align="center" justify="center">
        {items.length ? (
          <StyledDropdownButton
            size={size}
            menu={{ items }}
            icon={
              <IonIcon name="chevron-up" color="secondary1.light" size="sm" />
            }
            trigger={["click"]}
            variant={variant}
          >
            {mainButton}
          </StyledDropdownButton>
        ) : (
          mainButton
        )}
        {label && <Typography variant="bodyXs" color="common.white">{label}</Typography>}
        </Flex>
      </Badge>
    </Tooltip>
  );
}

const width = {
  large: 45,
  small: 34,
  middle: 40,
};

const StyledButton = styled(Button)<
  (ButtonProps | IconButtonProps) & { outlined?: boolean }
>`
  cursor: pointer;
  ${({ size = 'large' }) => {
    return css`
      width: ${width[size]}px;
      height: ${width[size]}px;
      min-width: ${width[size]}px;
      border-radius: 8px;
    `;
  }}

  .ant-btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  ${makeButtonColor};
  ${({ outlined }) =>
    outlined &&
    css`
      &:hover {
        outline: 3px solid ${({ theme }) => theme.palette.primary1.light} !important;
      }
    `}
`;

const StyledDropdownButton = styled(Dropdown.Button)<{
  size: IconButtonProps['size'];
  variant?: ButtonVariants;
}>`
  // background: ${({ theme }) => theme.palette.primary1.light};
  ${makeButtonColor};
  ${({ size = 'large' }) => {
    return css`
      border-radius: 8px;
      & > button {
        padding: 0px;
        border: none;
        background: ${({ theme }) => theme.palette.primary1.light};
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        height: ${width[size]}px;
        // min-width: ${width[size]}px;
        border-radius: 8px;
      }
    `;
  }}

  :hover {
    background: rgba(255, 255, 255, 0.25) !important;
  }

  & > button:last-child {
    background: transparent !important;
    width: ${({ size = 'large' }) => width[size]/1.25}px !important;
  }

  & > button:last-child:hover {
    background: transparent !important;
    width: ${({ size = 'large' }) => width[size]/1.25}px !important;
  }
`;
