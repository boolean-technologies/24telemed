import LogoPng from '../../assets/logo.png';

type LogoProps = {
  size?: 'sm' | 'lg' | 'md' | "xl";
  style?: React.CSSProperties;
};

export function Logo({ size = "lg", style }: LogoProps) {
  const width = {
    sm: 40,
    md: 60,
    lg: 100,
    xl: 150,
  }[size];

  return <img src={LogoPng} width={width} height={width} alt="Logo" style={style} />;
}
