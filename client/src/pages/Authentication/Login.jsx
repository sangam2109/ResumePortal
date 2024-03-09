import { useState, useContext } from 'react';
import { UserContext } from '../../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from "react-router-dom";
import useMediaQuery from '@mui/material/useMediaQuery';
import avatarGraphic from '../../assets/avatar.png'


function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext)
  const navigate = useNavigate();



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: credentials.email, password: credentials.password }),
      });

      const json = await response.json();
      console.log(json)
      if (json.success) {
        if (json.message === "verify") {
          toast('Please verify your account');
          setTimeout(() => {
            // Adjust the routing logic as per your requirements
            navigate('/verify')
          }, 2000);

        }
        else {
          toast('Successfully logged in');
          localStorage.setItem('authtoken', json.authtoken);
          const role = json.body.user.role
          setLoading(false);
          if (role === "admin") {
            setTimeout(() => {
              // Adjust the routing logic as per your requirements
              navigate('/admin')
            }, 2000);
          } else {
            setTimeout(() => {
              // Adjust the routing logic as per your requirements
              navigate('/dashboard')
            }, 2000);
          }

        }


      } else {
        toast('🚫 ' + json.message);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast('🚫 An error occurred');
      setLoading(false);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const isMobile = useMediaQuery('(max-width: 768px)');



  return (
    <Container component="main" >
      <CssBaseline />
      <ToastContainer />
      <Grid container spacing={2} alignItems="center">
        {/* Image section */}
        {!isMobile && (
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={avatarGraphic} alt="" height={'220vh'} style={{ marginBottom: '20px' }} />
              <Typography component="h1" variant="h5">
                Sign In
              </Typography>
            </Box>
          </Grid>
        )}
        {isMobile && (
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 5 }}>
              <img src={avatarGraphic} alt="" height={'120vh'} style={{ marginBottom: '20px' }} />
              <Typography component="h1" variant="h5">
                Sign In
              </Typography>
            </Box>
          </Grid>
        )}
        {/* Form section */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: `${isMobile ? '10px' : '80px'}` }}>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, paddingX: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={credentials.email}
              autoComplete="email"
              onChange={onChange}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              value={credentials.password}
              type="password"
              autoComplete="current-password"
              onChange={onChange}
            />


            <FormControlLabel
              control={
                <Checkbox
                  name="rememberMe"
                  checked={credentials.rememberMe}
                  onChange={onChange}
                  color="primary"
                />
              }
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/signup" variant="body2" style={{ color: 'GrayText' }}>
                  Do not have any account? Sign up here
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
    </Container >
  );
}



export default Login;