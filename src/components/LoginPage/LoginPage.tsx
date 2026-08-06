import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { OAuthProvider } from "../../types/auth";

interface LoginPageProps {
  error: string | null;
  onSignIn: (provider: OAuthProvider) => void;
  providers: OAuthProvider[];
}

export const LoginPage = ({
  error,
  onSignIn,
  providers,
}: LoginPageProps) => {
  return (
    <Box
      sx={{
        minHeight: { xs: "calc(100vh - 140px)", md: "calc(100vh - 180px)" },
        display: "grid",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.15fr) 420px" },
          alignItems: "stretch",
        }}
      >
        <Stack spacing={2.5} sx={{ justifyContent: "center", maxWidth: 760 }}>
          <Typography variant="overline" color="text.secondary">
            Secure Access
          </Typography>

          <Typography
            variant="h1"
            sx={{
              fontSize: {
                xs: "clamp(2.9rem, 11vw, 4.6rem)",
                md: "clamp(4rem, 6vw, 6.1rem)",
              },
              maxWidth: 720,
            }}
          >
            Sign in before you track your next round.
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 620, lineHeight: 1.8 }}
          >
            OAuth stays outside the frontend. This page only redirects to the
            provider URLs you configure in the environment and resumes the app
            after the auth callback returns.
          </Typography>
        </Stack>

        <Card variant="outlined" sx={{ overflow: "hidden" }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="h4">Continue with OAuth</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1.25, lineHeight: 1.7 }}
                >
                  Choose an identity provider to open the tracker.
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" variant="outlined">
                  {error}
                </Alert>
              )}

              {providers.length > 0 ? (
                <Stack spacing={1.25}>
                  {providers.map((provider) => (
                    <Button
                      key={provider.id}
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={() => onSignIn(provider)}
                      sx={{
                        justifyContent: "space-between",
                        py: 1.5,
                      }}
                    >
                      <span>{provider.label}</span>
                      <span>{provider.id.toUpperCase()}</span>
                    </Button>
                  ))}
                </Stack>
              ) : (
                <Alert severity="info" variant="outlined">
                  No OAuth providers are configured yet. Add at least one
                  `VITE_AUTH_*_URL` value to enable sign-in.
                </Alert>
              )}

              <Typography variant="caption" color="text.secondary">
                Supported env vars: `VITE_AUTH_GOOGLE_URL`,
                `VITE_AUTH_MICROSOFT_URL`, `VITE_AUTH_GITHUB_URL`,
                `VITE_AUTH_APPLE_URL`.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
