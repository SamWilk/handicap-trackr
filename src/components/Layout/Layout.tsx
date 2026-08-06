/**
 * Layout Component
 * Main layout wrapper with a refined top bar and warm editorial shell
 */

import { ReactNode } from "react";
import {
  AppBar,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { GolfCourse as GolfIcon } from "@mui/icons-material";

interface LayoutProps {
  authenticated?: boolean;
  children: ReactNode;
  onSignOut?: () => void;
  userLabel?: string;
}

export const Layout = ({
  authenticated = true,
  children,
  onSignOut,
  userLabel,
}: LayoutProps) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 20% 0%, rgba(29,53,87,0.06), transparent 24%), radial-gradient(circle at 85% 12%, rgba(175,148,111,0.12), transparent 22%)",
        }}
      />

      <AppBar position="sticky" color="transparent" elevation={0}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: 84 }}>
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ flex: 1, minWidth: 0 }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  display: "grid",
                  placeItems: "center",
                  border: "1px solid rgba(19, 37, 60, 0.14)",
                  backgroundColor: "rgba(255, 255, 255, 0.72)",
                  backdropFilter: "blur(14px)",
                  color: "primary.main",
                }}
              >
                <GolfIcon />
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ fontWeight: 800, letterSpacing: "-0.03em" }}
                >
                  Golf Handicap Trackr
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  OpenGolf-powered round entry
                </Typography>
              </Box>
            </Stack>

            {authenticated && (
              <>
                <Stack
                  direction="row"
                  spacing={0.75}
                  sx={{ display: { xs: "none", md: "flex" }, mr: 2 }}
                >
                  <Button href="#handicap" color="inherit" variant="text">
                    Handicap
                  </Button>
                  <Button href="#round-form" color="inherit" variant="text">
                    Lookup
                  </Button>
                  <Button href="#rounds" color="inherit" variant="text">
                    History
                  </Button>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  {userLabel && (
                    <Chip
                      label={userLabel}
                      variant="outlined"
                      sx={{ display: { xs: "none", sm: "inline-flex" } }}
                    />
                  )}

                  <Button href="#round-form" color="primary" variant="contained">
                    Add round
                  </Button>

                  {onSignOut && (
                    <Button color="inherit" variant="text" onClick={onSignOut}>
                      Sign out
                    </Button>
                  )}
                </Stack>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="xl" sx={{ position: "relative", py: { xs: 3, md: 5 } }}>
        {children}
      </Container>
    </Box>
  );
};
