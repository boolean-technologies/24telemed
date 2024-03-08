import LogoPng from '../../assets/logo.png';

type LogoProps = {
  size?: 'sm' | 'lg' | 'md';
};

export function Logo({ size = "lg" }: LogoProps) {
  const width = {
    sm: 40,
    md: 60,
    lg: 100,
  }[size];

  return <img src={LogoPng} width={width} height={width} alt="Logo" />;
}
