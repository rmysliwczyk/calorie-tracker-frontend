import { Alert, Box, Button, Container, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/authContext";

export default function Auth(props: { logout?: boolean } = {}) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const auth = useAuth();

  if (props.logout) {
    auth.logOutAction();
  }

  async function handleLogin() {
    try {
      await auth.loginAction(username, password);
      navigate("/fooditems");
    } catch (err) {
      console.log(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  }

  return (
    <>
      <Container sx={{display: "flex", justifyContent: "center"}}>
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
            <Button onClick={handleLogin}>Log in</Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}
