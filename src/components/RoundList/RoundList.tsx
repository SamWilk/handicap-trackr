/**
 * RoundList Component
 * Displays the list of rounds with ability to delete
 */

import {
  Box,
  Card,
  CardContent,
  Typography,
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
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Round History
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            No rounds recorded yet. Add your first round to get started!
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Round History
        </Typography>

        <List sx={{ mt: 2 }}>
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
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight="bold">
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
                        <Typography variant="body2" color="text.secondary">
                          {new Date(round.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
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
