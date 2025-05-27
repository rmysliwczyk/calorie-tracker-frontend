import { Alert, Box, Button, Container, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/authContext";

export default function Auth(props: { logout?: boolean } = {}) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(
    function () {
      if (props.logout) {
        auth.logOutAction();
      }
    },
    [props.logout]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();
      await auth.loginAction(username, password);
      navigate("/meals");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unkown error occurred");
      }
    }
  }

  return (
    <>
      <Container
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Box>
          <Box sx={{ mb: "10px" }}>
            <TextField
              id="username"
              label="Username"
              variant="outlined"
              value={username}
              onChange={function (event) {
                setUsername(event.target.value);
              }}
            />
          </Box>
          <Box sx={{ mb: "10px" }}>
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={function (event) {
                setPassword(event.target.value);
              }}
            />
          </Box>
          {error && (
            <Box sx={{ mb: "3px" }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          <Box>
            <Button type="submit">Log in</Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}
