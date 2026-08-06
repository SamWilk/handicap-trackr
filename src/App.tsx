/**
 * Main App Component
 * Golf Handicap Tracker - Track your golf rounds and calculate your handicap index
 */

import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CssBaseline,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { HandicapDisplay, Layout, RoundForm, RoundList } from "./components";
import { useHandicap } from "./hooks/useHandicap";
import { useRounds } from "./hooks/useRounds";
import {
  calculateDifferential,
  formatHandicapIndex,
} from "./utils/handicapCalculator";

const theme = createTheme({
  palette: {
    primary: {
      main: "#13253c",
    },
    secondary: {
      main: "#8d7354",
    },
    background: {
      default: "#f4efe7",
      paper: "#fbf7ef",
    },
    text: {
      primary: "#13253c",
      secondary: "#5f6a77",
    },
  },
  typography: {
    fontFamily:
      '"Manrope", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      fontFamily: '"Fraunces", Georgia, serif',
      fontWeight: 600,
      letterSpacing: "-0.04em",
      lineHeight: 1,
    },
    h2: {
      fontFamily: '"Fraunces", Georgia, serif',
      fontWeight: 600,
      letterSpacing: "-0.035em",
    },
    h3: {
      fontFamily: '"Fraunces", Georgia, serif',
      fontWeight: 600,
      letterSpacing: "-0.03em",
    },
    h4: {
      fontFamily: '"Fraunces", Georgia, serif',
      fontWeight: 600,
      letterSpacing: "-0.03em",
    },
    button: {
      textTransform: "none",
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
  },
  shape: {
    borderRadius: 0,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#f4efe7",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(19, 37, 60, 0.10)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderColor: "rgba(19, 37, 60, 0.12)",
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(251,247,239,0.92) 100%)",
          boxShadow: "0 18px 44px rgba(19, 37, 60, 0.06)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          paddingLeft: 18,
          paddingRight: 18,
        },
        containedPrimary: {
          backgroundColor: "#13253c",
          "&:hover": {
            backgroundColor: "#0f1d2f",
          },
        },
        outlined: {
          borderColor: "rgba(19, 37, 60, 0.18)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
  },
});

function App() {
  const { rounds, loading, addRound, deleteRound } = useRounds();
  const handicapData = useHandicap(rounds);
  const latestRound = rounds[0];
  const uniqueCourses = new Set(rounds.map((round) => round.course.name)).size;
  const bestDifferential =
    rounds.length > 0
      ? Math.min(
          ...rounds.map((round) =>
            calculateDifferential(
              round.score,
              round.course.rating,
              round.course.slope
            )
          )
        )
      : null;

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
        <Stack spacing={4}>
          <Box
            component="section"
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: {
                xs: "1fr",
                lg: "minmax(0, 1.2fr) minmax(320px, 0.8fr)",
              },
              alignItems: "stretch",
            }}
          >
            <Stack spacing={2.5} sx={{ justifyContent: "center" }}>
              <Box>
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    maxWidth: 840,
                    fontSize: {
                      xs: "clamp(2.6rem, 10vw, 4.4rem)",
                      md: "clamp(3.8rem, 6vw, 5.8rem)",
                    },
                  }}
                >
                  Handicap tracking with less manual data entry.
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    maxWidth: 680,
                    mt: 2,
                    fontSize: { xs: "1rem", md: "1.08rem" },
                    lineHeight: 1.75,
                    color: "text.secondary",
                  }}
                >
                  Search a course, autofill the tee set, and keep rating, slope,
                  and yardage aligned to the round you actually played.
                </Typography>
              </Box>
            </Stack>

            <Card
              variant="outlined"
              sx={{
                alignSelf: "stretch",
                overflow: "hidden",
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack spacing={2}>
                  <Typography variant="overline" color="text.secondary">
                    Round Snapshot
                  </Typography>

                  <Typography variant="h3" sx={{ lineHeight: 0.95 }}>
                    {handicapData
                      ? formatHandicapIndex(handicapData.handicapIndex)
                      : "N/A"}
                  </Typography>

                  <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {handicapData
                      ? "Your current handicap index, calculated from the best recent differentials."
                      : "Add at least 3 rounds to generate a handicap index."}
                  </Typography>

                  <Divider />

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Rounds logged
                      </Typography>
                      <Typography variant="h5" sx={{ mt: 0.5 }}>
                        {rounds.length}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Unique courses
                      </Typography>
                      <Typography variant="h5" sx={{ mt: 0.5 }}>
                        {uniqueCourses}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Best differential
                      </Typography>
                      <Typography variant="h5" sx={{ mt: 0.5 }}>
                        {bestDifferential != null
                          ? bestDifferential.toFixed(1)
                          : "N/A"}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Latest round
                      </Typography>
                      <Typography variant="h5" sx={{ mt: 0.5 }}>
                        {latestRound ? latestRound.score : "N/A"}
                      </Typography>
                    </Box>
                  </Box>

                  {latestRound && (
                    <>
                      <Divider />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Most recent course
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ mt: 0.5, fontWeight: 700 }}
                        >
                          {latestRound.course.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(latestRound.date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {rounds.length < 3 && (
            <Alert severity="info" variant="outlined">
              You need at least 3 rounds to calculate your handicap index. The
              more rounds you enter, the more accurate your handicap will be.
            </Alert>
          )}

          <Box id="handicap">
            <HandicapDisplay handicapData={handicapData} />
          </Box>

          <Stack
            direction={{ xs: "column", lg: "row" }}
            spacing={3}
            alignItems="stretch"
          >
            <Box id="round-form" sx={{ flex: 1 }}>
              <RoundForm onAddRound={addRound} />
            </Box>

            <Box id="rounds" sx={{ flex: 1 }}>
              <RoundList rounds={rounds} onDeleteRound={deleteRound} />
            </Box>
          </Stack>
        </Stack>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
