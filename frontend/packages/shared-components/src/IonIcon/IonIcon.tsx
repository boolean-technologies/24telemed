type IonIconProps = {
  name: string;
  outlined?: boolean;
};

export function IonIcon({ name, outlined }: IonIconProps) {
  // @ts-ignore
  return <ion-icon name={outlined ? `${name}-outline` : name}></ion-icon>;
}
