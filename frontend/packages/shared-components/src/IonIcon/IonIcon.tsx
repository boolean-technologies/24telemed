import { get } from 'lodash-es';
import { PaletteVariants, SpacingVariants, defaultTheme } from '../styles';

type IonIconProps = {
  name: string;
  outlined?: boolean;
  color?: PaletteVariants;
  size?: SpacingVariants | number;
};

export function IonIcon({ name, outlined, color, size }: IonIconProps) {
  return (
    // @ts-ignore
    <ion-icon
      name={outlined ? `${name}-outline` : name}
      style={{
        color: color ? get(defaultTheme.palette, color) : undefined,
        fontSize: size ? typeof size === "number" ? size : get(defaultTheme.spacing, size) : undefined,
      }}
    />
  );
}
