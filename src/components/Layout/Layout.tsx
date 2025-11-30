/**
 * Layout Component
 * Main layout wrapper with Material-UI AppBar and container
 */

import { ReactNode } from "react";
import { AppBar, Toolbar, Typography, Container, Box } from "@mui/material";
import { GolfCourse as GolfIcon } from "@mui/icons-material";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <GolfIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="h1" sx={{ fontWeight: 600 }}>
            Golf Handicap Tracker
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
};
