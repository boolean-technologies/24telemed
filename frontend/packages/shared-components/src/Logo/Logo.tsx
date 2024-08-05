import LogoPng from '../../assets/logo.png';

type LogoProps = {
  size?: 'sm' | 'lg' | 'md' | "xl";
};

export function Logo({ size = "lg" }: LogoProps) {
  const width = {
    sm: 40,
    md: 60,
    lg: 100,
    xl: 150,
  }[size];

  return <img src={LogoPng} width={width} height="auto" alt="Logo" />;
}
