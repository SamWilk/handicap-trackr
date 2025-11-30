/**
 * HandicapDisplay Component
 * Displays the current handicap index and related statistics
 */

import { Box, Card, CardContent, Typography, Chip } from "@mui/material";
import { HandicapData } from "../../types";
import { formatHandicapIndex } from "../../utils/handicapCalculator";

interface HandicapDisplayProps {
  handicapData: HandicapData | null;
}

export const HandicapDisplay = ({ handicapData }: HandicapDisplayProps) => {
  if (!handicapData) {
    return (
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Handicap Index
          </Typography>
          <Typography variant="h2" color="text.secondary">
            N/A
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Enter at least 3 rounds to calculate your handicap index
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={3}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5">Handicap Index</Typography>
          <Chip
            label={`${handicapData.totalRounds} rounds`}
            color="primary"
            size="small"
          />
        </Box>

        <Typography
          variant="h2"
          color="primary"
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          {formatHandicapIndex(handicapData.handicapIndex)}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
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
