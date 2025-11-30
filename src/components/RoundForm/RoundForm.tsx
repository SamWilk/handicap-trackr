/**
 * RoundForm Component
 * Form for entering new golf rounds with validation
 */

import { useState, FormEvent } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { Round } from "../../types";

interface RoundFormProps {
  onAddRound: (round: Round) => void;
}

export const RoundForm = ({ onAddRound }: RoundFormProps) => {
  const [courseName, setCourseName] = useState("");
  const [courseRating, setCourseRating] = useState("");
  const [slopeRating, setSlopeRating] = useState("");
  const [score, setScore] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newRound: Round = {
      id: crypto.randomUUID(),
      date,
      course: {
        name: courseName,
        rating: parseFloat(courseRating),
        slope: parseInt(slopeRating),
      },
      score: parseInt(score),
    };

    onAddRound(newRound);

    // Reset form
    setCourseName("");
    setCourseRating("");
    setSlopeRating("");
    setScore("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  const isFormValid =
    courseName.trim() !== "" &&
    courseRating !== "" &&
    parseFloat(courseRating) > 0 &&
    slopeRating !== "" &&
    parseInt(slopeRating) >= 55 &&
    parseInt(slopeRating) <= 155 &&
    score !== "" &&
    parseInt(score) > 0;

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Add New Round
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Stack spacing={2}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Course Name"
                fullWidth
                required
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="e.g., Pebble Beach"
              />

              <TextField
                label="Date"
                type="date"
                fullWidth
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Course Rating"
                type="number"
                fullWidth
                required
                value={courseRating}
                onChange={(e) => setCourseRating(e.target.value)}
                inputProps={{ step: "0.1", min: "0" }}
                placeholder="e.g., 72.5"
              />

              <TextField
                label="Slope Rating"
                type="number"
                fullWidth
                required
                value={slopeRating}
                onChange={(e) => setSlopeRating(e.target.value)}
                inputProps={{ min: "55", max: "155" }}
                placeholder="e.g., 130"
              />

              <TextField
                label="Score"
                type="number"
                fullWidth
                required
                value={score}
                onChange={(e) => setScore(e.target.value)}
                inputProps={{ min: "1" }}
                placeholder="e.g., 85"
              />
            </Stack>

            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              disabled={!isFormValid}
              fullWidth
            >
              Add Round
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};
