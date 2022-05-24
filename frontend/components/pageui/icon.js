import { useTheme } from "styled-components";
import Image from "next/image";

const Icon = ({ prefix, width, height, alt }) => {
  const theme = useTheme();
  const iconColor = theme.primaryIconColor;

  return (
    <Image
      src={`/icons/${prefix}_${iconColor}.svg`}
      alt={alt}
      width={width}
      height={height}
    />
  );
};

export default Icon;
