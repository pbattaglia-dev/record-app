import { useMediaQuery, useTheme } from "@mui/material";

interface IDeviceTypes {
  matchesMobile: boolean;
}

export const useDeviceTypes = (): IDeviceTypes => {
  const theme = useTheme();

  const results = {
    matchesMobile: useMediaQuery(theme.breakpoints.down("sm"))
  };

  return results;
};
