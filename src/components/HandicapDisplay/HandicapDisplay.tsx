/**
 * HandicapDisplay Component
 * Displays the current handicap index and related statistics
 */

import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { HandicapData } from "../../types";
import { formatHandicapIndex } from "../../utils/handicapCalculator";

interface HandicapDisplayProps {
  handicapData: HandicapData | null;
}

export const HandicapDisplay = ({ handicapData }: HandicapDisplayProps) => {
  if (!handicapData) {
    return (
      <Card variant="outlined" sx={{ overflow: "hidden" }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Typography variant="overline" color="text.secondary">
            Handicap
          </Typography>
          <Typography variant="h4" sx={{ mt: 0.75 }}>
            Handicap Index
          </Typography>
          <Typography
            variant="h2"
            color="text.secondary"
            sx={{ fontSize: { xs: "3rem", md: "4.25rem" }, mt: 1.5 }}
          >
            N/A
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, lineHeight: 1.7 }}>
            Enter at least 3 rounds to calculate your handicap index
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ overflow: "hidden" }}>
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2} sx={{ mb: 2 }}>
          <Box>
            <Typography variant="overline" color="text.secondary">
              Handicap
            </Typography>
            <Typography variant="h4" sx={{ mt: 0.5 }}>
              Handicap Index
            </Typography>
          </Box>
          <Chip
            label={`${handicapData.totalRounds} rounds`}
            color="primary"
            size="small"
          />
        </Stack>

        <Typography
          variant="h2"
          color="primary"
          sx={{
            fontSize: { xs: "3.6rem", md: "5rem" },
            lineHeight: 0.92,
            mb: 2,
          }}
        >
          {formatHandicapIndex(handicapData.handicapIndex)}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary">
              Rounds Used
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {handicapData.roundsUsed} of {handicapData.totalRounds}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Last Updated
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {new Date(handicapData.lastUpdated).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
