/**
 * RoundForm Component
 * Form for entering new golf rounds with validation and course lookup
 */

import { FormEvent, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { Round } from "../../types";
import {
  CourseDetails,
  CourseSearchResult,
  getCourseDetails,
  searchCourses,
} from "../../services/courseLookupService";

interface RoundFormProps {
  onAddRound: (round: Round) => void;
}

export const RoundForm = ({ onAddRound }: RoundFormProps) => {
  const [courseName, setCourseName] = useState("");
  const [courseRating, setCourseRating] = useState("");
  const [slopeRating, setSlopeRating] = useState("");
  const [score, setScore] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupResults, setLookupResults] = useState<CourseSearchResult[]>([]);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<CourseDetails | null>(null);
  const [selectedTeeIndex, setSelectedTeeIndex] = useState(0);

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

    setCourseName("");
    setCourseRating("");
    setSlopeRating("");
    setScore("");
    setDate(new Date().toISOString().split("T")[0]);
    setLookupQuery("");
    setLookupResults([]);
    setLookupError("");
    setSelectedCourse(null);
    setSelectedTeeIndex(0);
  };

  const applyTee = (course: CourseDetails, teeIndex: number) => {
    const tee = course.tees[teeIndex];
    setSelectedCourse(course);
    setSelectedTeeIndex(teeIndex);
    setCourseName(course.name);

    if (tee?.rating != null) {
      setCourseRating(tee.rating.toFixed(1));
    }

    if (tee?.slope != null) {
      setSlopeRating(String(tee.slope));
    }
  };

  const handleLookup = async () => {
    const query = lookupQuery.trim();

    if (!query) {
      setLookupResults([]);
      setLookupError("Enter a course name, city, state, or ZIP first.");
      return;
    }

    setLookupLoading(true);
    setLookupError("");

    try {
      const results = await searchCourses(query);
      setLookupResults(results);

      if (results.length === 0) {
        setLookupError("No matching courses found. Try a different city or course name.");
      }
    } catch (error) {
      setLookupError(
        error instanceof Error
          ? error.message
          : "Course lookup failed. You can still enter ratings manually."
      );
      setLookupResults([]);
    } finally {
      setLookupLoading(false);
    }
  };

  const handleSelectCourse = async (course: CourseSearchResult) => {
    setLookupLoading(true);
    setLookupError("");

    try {
      const details = await getCourseDetails(course.id);
      setLookupResults([]);

      if (details.tees.length > 0) {
        applyTee(details, 0);
      } else {
        setSelectedCourse(details);
        setSelectedTeeIndex(0);
        setCourseName(details.name);
        setLookupError(
          "This course was found, but tee ratings were not available. Enter rating and slope manually."
        );
      }
    } catch (error) {
      setLookupError(
        error instanceof Error
          ? error.message
          : "Could not load tee details for that course."
      );
    } finally {
      setLookupLoading(false);
    }
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
    <Card variant="outlined" sx={{ overflow: "hidden" }}>
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Typography variant="overline" color="text.secondary">
          Entry
        </Typography>
        <Typography variant="h4" sx={{ mt: 0.5 }}>
          Add New Round
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.25, lineHeight: 1.7 }}>
          Search by course name, city, state, or ZIP to autofill rating and slope.
          Manual entry still works if a course is missing from the data.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Stack spacing={2}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: "rgba(19, 37, 60, 0.03)",
                borderColor: "rgba(19, 37, 60, 0.12)",
              }}
            >
              <Stack spacing={1.5}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: "0.02em" }}>
                  Course Lookup
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <TextField
                    label="Search course, city, state, or ZIP"
                    fullWidth
                    value={lookupQuery}
                    onChange={(e) => setLookupQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        void handleLookup();
                      }
                    }}
                    placeholder="e.g., Jacksonville, Pebble Beach, 90210"
                  />

                  <Button
                    variant="outlined"
                    onClick={() => void handleLookup()}
                    disabled={lookupLoading}
                    sx={{ minWidth: { sm: 140 } }}
                  >
                    {lookupLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      "Search"
                    )}
                  </Button>
                </Stack>

                {lookupError && (
                  <Alert severity="info" variant="outlined">
                    {lookupError}
                  </Alert>
                )}

                {lookupResults.length > 0 && (
                  <Paper
                    variant="outlined"
                    sx={{
                      maxHeight: 260,
                      overflow: "auto",
                      bgcolor: "background.paper",
                      borderColor: "rgba(19, 37, 60, 0.12)",
                    }}
                  >
                    <List dense disablePadding>
                      {lookupResults.map((course) => (
                        <ListItemButton
                          key={course.id}
                          onClick={() => void handleSelectCourse(course)}
                        >
                          <ListItemText
                            disableTypography
                            primary={
                              <Typography
                                component="div"
                                sx={{ fontWeight: 600, lineHeight: 1.2 }}
                              >
                                {course.name}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                component="div"
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.25 }}
                              >
                                {[course.city, course.state]
                                  .filter(Boolean)
                                  .join(", ")}
                              </Typography>
                            }
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  </Paper>
                )}

                {selectedCourse && (
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    alignItems={{ sm: "center" }}
                    sx={{ pt: 0.5 }}
                  >
                    <Chip
                      label={`Selected: ${selectedCourse.name}`}
                      color="primary"
                      variant="outlined"
                    />
                    {(selectedCourse.city || selectedCourse.state) && (
                      <Typography variant="body2" color="text.secondary">
                        {[selectedCourse.city, selectedCourse.state]
                          .filter(Boolean)
                          .join(", ")}
                      </Typography>
                    )}
                  </Stack>
                )}
              </Stack>
            </Paper>

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
                select
                label="Tee Set"
                fullWidth
                disabled={!selectedCourse || selectedCourse.tees.length === 0}
                value={selectedCourse ? String(selectedTeeIndex) : ""}
                onChange={(e) => {
                  const nextIndex = Number(e.target.value);
                  if (selectedCourse && selectedCourse.tees[nextIndex]) {
                    applyTee(selectedCourse, nextIndex);
                  }
                }}
                helperText={
                  selectedCourse?.tees.length
                    ? "Pick the tee that matches your round."
                    : "Search for a course to load tee sets."
                }
              >
                {selectedCourse?.tees.length ? (
                  selectedCourse.tees.map((tee, index) => (
                    <MenuItem key={`${tee.name}-${index}`} value={index}>
                      {[
                        tee.name,
                        tee.gender,
                        tee.rating != null ? `CR ${tee.rating.toFixed(1)}` : null,
                        tee.slope != null ? `SR ${tee.slope}` : null,
                        tee.length != null ? `${tee.length.toLocaleString()} yds` : null,
                      ]
                        .filter(Boolean)
                        .join(" | ")}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    No tee sets available
                  </MenuItem>
                )}
              </TextField>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Slope Rating"
                type="number"
                fullWidth
                required
                value={slopeRating}
                onChange={(e) => setSlopeRating(e.target.value)}
                inputProps={{ min: "55", max: "155" }}
                placeholder="e.g., 130"
                helperText="Autofilled from the selected tee when available."
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

            <Divider />

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
