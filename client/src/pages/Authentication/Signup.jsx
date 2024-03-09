import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import avatarGraphic from '../../assets/avatar.png'

function Signup() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    gender: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          phone: credentials.phone,
          gender: credentials.gender,
        }),
      });
      console.log(credentials);
      const json = await response.json();
      console.log(json);
      if (json.success) {
        toast('Successfully signed up');
        // ... rest of the code
        setTimeout(() => {
          navigate('/verify')
        }, 2000);
      } else {
        toast('🚫 Invalid Credentials');
        setLoading(false);
      }
    } catch (error) {
      toast('🚫 Invalid Credentials');
      setLoading(false);
    }
  };
  const handleGenderChange = (e) => {
    setCredentials({ ...credentials, gender: e.target.value });
  };


  const onChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setCredentials({ ...credentials, [e.target.name]: value });
  };

  // Use media query hook to check for screen size
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
                Sign up
              </Typography>
            </Box>
          </Grid>
        )}
        {isMobile && (
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 5 }}>
              <img src={avatarGraphic} alt="" height={'120vh'} style={{ marginBottom: '20px' }} />
              <Typography component="h1" variant="h5">
                Sign up
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
              id="name"
              label="Name"
              name="name"
              value={credentials.name}
              onChange={onChange}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={credentials.email}
              onChange={onChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              value={credentials.password}
              type="password"
              onChange={onChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="phone"
              label="Phone Number"
              value={credentials.phone}
              onChange={onChange}
            />
            <FormControl fullWidth>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                id="gender"
                value={credentials.gender}
                label="Gender"
                onChange={handleGenderChange}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
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
              {loading ? 'Signing up...' : 'Sign up'}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2" style={{ color: '#0015ff' }}>
                  Already have an account? Sign in
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

export default Signup;