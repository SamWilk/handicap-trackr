/**
 * Main App Component
 * Golf Handicap Tracker - Track your golf rounds and calculate your handicap index
 */

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Box, Alert, Stack } from "@mui/material";
import { Layout, HandicapDisplay, RoundForm, RoundList } from "./components";
import { useRounds } from "./hooks/useRounds";
import { useHandicap } from "./hooks/useHandicap";

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#2e7d32", // Golf green
    },
    secondary: {
      main: "#1976d2",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const { rounds, loading, addRound, deleteRound } = useRounds();
  const handicapData = useHandicap(rounds);

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <Box sx={{ p: 3 }}>Loading...</Box>
        </Layout>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Stack spacing={3}>
          {/* Handicap Display */}
          <HandicapDisplay handicapData={handicapData} />

          {/* Info Alert */}
          {rounds.length < 3 && (
            <Alert severity="info">
              You need at least 3 rounds to calculate your handicap index. The
              more rounds you enter (up to 20), the more accurate your handicap
              will be.
            </Alert>
          )}

          {/* Add Round Form and Round History */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            <Box sx={{ flex: 1 }}>
              <RoundForm onAddRound={addRound} />
            </Box>

            <Box sx={{ flex: 1 }}>
              <RoundList rounds={rounds} onDeleteRound={deleteRound} />
            </Box>
          </Stack>
        </Stack>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
