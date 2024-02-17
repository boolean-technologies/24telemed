import { useBreakpoints } from "@local/shared-components";

const useIsMobile = (maxWidth?: number) => {
  const { isMobile } = useBreakpoints();
  return isMobile;
};

export default useIsMobile;
