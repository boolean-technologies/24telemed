import { useBreakpoints } from "@local/shared-components";

const useIsTab = () => {
  const { isMd } = useBreakpoints();
  return isMd;
};

export default useIsTab;
