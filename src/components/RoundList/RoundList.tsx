/**
 * RoundList Component
 * Displays the list of rounds with ability to delete
 */

import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Divider,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { Round } from "../../types";
import { calculateDifferential } from "../../utils/handicapCalculator";

interface RoundListProps {
  rounds: Round[];
  onDeleteRound: (id: string) => void;
}

export const RoundList = ({ rounds, onDeleteRound }: RoundListProps) => {
  if (rounds.length === 0) {
    return (
      <Card variant="outlined" sx={{ overflow: "hidden" }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Typography variant="overline" color="text.secondary">
            History
          </Typography>
          <Typography variant="h4" sx={{ mt: 0.5 }}>
            Round History
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, lineHeight: 1.7 }}>
            No rounds recorded yet. Add your first round to get started!
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ overflow: "hidden" }}>
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="end" gap={2} sx={{ mb: 2 }}>
          <Box>
            <Typography variant="overline" color="text.secondary">
              History
            </Typography>
            <Typography variant="h4" sx={{ mt: 0.5 }}>
              Round History
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {rounds.length} rounds
          </Typography>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Review what you played, then delete any round that needs correcting.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ display: "none" }}>
          Round History
        </Typography>

        <List sx={{ mt: 1 }}>
          {rounds.map((round, index) => {
            const differential = calculateDifferential(
              round.score,
              round.course.rating,
              round.course.slope
            );

            return (
              <Box key={round.id}>
                {index > 0 && <Divider />}
                <ListItem
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => onDeleteRound(round.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                  sx={{ py: 2 }}
                >
                  <ListItemText
                    disableTypography
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight={700}>
                          {round.course.name}
                        </Typography>
                        <Chip
                          label={`Score: ${round.score}`}
                          size="small"
                          color="primary"
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                          {new Date(round.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                          Rating: {round.course.rating.toFixed(1)} | Slope:{" "}
                          {round.course.slope} | Differential:{" "}
                          {differential.toFixed(1)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              </Box>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
};
