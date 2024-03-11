import  { get } from "lodash-es";
import { PaletteVariants, defaultTheme } from "../styles";

type IonIconProps = {
  name: string;
  outlined?: boolean;
  color?: PaletteVariants;
};

export function IonIcon({ name, outlined, color }: IonIconProps) {
  // @ts-ignore
  return <ion-icon name={outlined ? `${name}-outline` : name} style={{ color: get(defaultTheme.palette, color) }}></ion-icon>;
}
