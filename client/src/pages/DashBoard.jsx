import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import TextField from '@mui/material/TextField';
import FileBase from 'react-file-base64';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MuiChipsInput } from 'mui-chips-input'
import { openBase64NewTab } from '../utils/base64topdf';
import { jwtDecode } from "jwt-decode";
import EditIcon from '@mui/icons-material/Edit';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import { technologyStack } from '../utils/TechnologyStack';
import locationsdata from '../utils/locations.json'

// import Box from '@mui/material/Box';
import axios from 'axios';
import Grid from '@mui/material/Grid'; // Import Grid component
import ExperienceInput from '../Components/Experience';
import EducationInput from '../Components/Education';
// import Navbar from './Navbar/Navbar';

export default function Form() {
  const [formData, setFormData] = useState({

    firstName: '',
    lastName: '',
    email: '',
    contact: '',
    experience: [],
    education: [],
    skills: [],
    location: '',
    resume: null
  });
  const [certificate, setCertificate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationOptions, setLocationOptions] = useState([]);
  const [isEditing, setIsEditing] = useState(true);
  const [resume, setResume] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      const userid = decodeAuthToken(token)
      const response = await axios.get(`http://localhost:8000/api/users/getuser/${userid}`);
      const userData = response.data.data.userProfile;


      if (userData) {

        setTimeout(() => {
          setFormData(prevData => ({
            ...prevData,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            contact: userData.contact || '',
            experience: userData.experience || '',
            education: userData.education || '',
            skills: userData.skills || [],
            location: userData.location || '',
            resume: userData.resume || null
          }));
          setIsEditing(false);
          console.log(formData)
        }, 1000);
      } else {
        console.error('Error: Fetched data is incomplete.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);


  const handleSkillsChange = (newChips) => {
    setFormData({ ...formData, skills: newChips });
  }
  const handleFileChange = (files) => {
    setFormData({ ...formData, resume: files.base64 });
    setCertificate(files.base64);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formErrors = {};
      if (formData.skills.length === 0) {
        formErrors.skills = 'Skills cannot be blank';
        toast.error("Skills cannot be blank")
      }
      if (!formData.firstName) {
        formErrors.projectName = 'First Name cannot be blank';
        toast.error("First Name cannot be blank")
      }
      if (!formData.lastName) {
        formErrors.lastName = 'Last Name cannot be blank';
        toast.error("Last Name cannot be blank")
      }
      if (!formData.resume) {
        formErrors.resume = 'Resume cannot be blank';
        toast.error("certificate cannot be blank")
      }
      if (!formData.location) {
        formErrors.location = 'Location cannot be blank';
        toast.error("Location cannot be blank")
      }
      if (!formData.education) {
        formErrors.education = 'education cannot be blank';
        toast.error("Education cannot be blank")
      }
      if (!formData.experience) {
        formErrors.experience = 'Experience cannot be blank';
        toast.error("Experience cannot be blank")
      }
      if (!formData.contact) {
        formErrors.contact = 'contact cannot be blank';
        toast.error("contact cannot be blank")
      }
      if (!formData.email) {
        formErrors.email = 'Email cannot be blank';
        toast.error("Email cannot be blank")
      }

      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
      }

      const token = localStorage.getItem('authtoken');
      const userid = decodeAuthToken(token)
      console.log(token)

      console.log(userid)
      // console.log(formData)
      console.log(formData)
      const response = await axios.post('http://localhost:8000/userprofiles', { formData, userId: userid });

      console.log("hello")
      if (response.data.success) {
        toast.success('Form submitted successfully!');
        setIsSubmitting(false);
        setIsEditing(false);
      } else {
        toast.error('Failed to submit form. Please try again later.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      toast.error('An error occurred while submitting the form.');
      setIsSubmitting(false);
    }
  };
  const decodeAuthToken = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      // console.log(decodedToken)
      const userid = decodedToken.user.id;
      return userid;
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  };



  const handleViewCertificate = () => {
    if (resume) {
      openBase64NewTab(resume);
    }
    else {
      openBase64NewTab(formData.resume);
    }
  };
  const handleEdit = () => {
    setIsEditing((prevEditing) => !prevEditing);
  };
  return (
    <>
      <Container style={{ paddingBottom: '20vh', paddingTop: '10px' }}>
        <Container style={{ paddingInline: 0, paddingTop: 10 }}>
          <Button
            onClick={handleEdit}
            color="primary"
            variant="contained"
            style={{
              position: 'relative',
              float: 'left',
            }}
          >
            <EditIcon />
          </Button>
          {isEditing && (
            <Button
              type="submit"
              onClick={handleSubmit}
              color="primary"
              variant="contained"
              endIcon={<KeyboardArrowRightIcon />}
              disabled={isSubmitting}
              style={{
                position: 'relative',
                float: 'right',
              }}
            >
              Submit
            </Button>
          )}
          {!isEditing && (
            <Button onClick={handleViewCertificate} variant="outlined" color="primary" style={{
              position: 'relative',
              float: 'right',
            }}>
              View Certificate
            </Button>
          )}
        </Container>
        <Typography
          variant="h5"
          color='textSecondary'
          component='h2'
          align='center'
          justify='center'
          fontWeight='bold'
          margin={5}
          gutterBottom
        >
          Please fill in your information below.
        </Typography>
        <ToastContainer />
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom textAlign={'left'}>
            Personal Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                variant="outlined"
                fullWidth
                required
                name="firstName"
                placeholder='firstName'
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing || isSubmitting}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                variant="outlined"
                fullWidth
                required
                name="lastName"
                placeholder='Surname'
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing || isSubmitting}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                required
                name="email"
                placeholder='example@gmail.com'
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing || isSubmitting}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <PhoneInput
                placeholder="Enter phone number"
                value={formData.contact}
                onChange={(value) => setFormData({ ...formData, contact: value })}
                style={{
                  width: '100%',
                  padding: '16px',
                  marginBottom: '10px',
                  border: '1px solid #bdbdbd',
                  borderRadius: '4px',
                  lineHeight: '1.5',
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  fontSize: '1rem',
                  backgroundColor: 'transparent',
                  transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                  '&:focus': {
                    borderColor: '#1976d2',
                    boxShadow: '0 0 0 0.2rem rgba(25, 118, 210, 0.25)',
                  },
                  '&:disabled': {
                    backgroundColor: '#f5f5f5',
                  }
                }}
                error={formData.contact ? isValidPhoneNumber(formData.contact) ? undefined : 'Invalid phone number' : 'Phone number required'}
                disabled={!isEditing || isSubmitting}
              />
            </Grid>
            <ExperienceInput
              formData={formData}
              setFormData={setFormData}
              isEditing={isEditing}
            />
            <EducationInput
              formData={formData}
              setFormData={setFormData}
              isEditing={isEditing}
            />
            <Grid item xs={12}>
              <Autocomplete
                fullWidth
                disablePortal
                disabled={!isEditing || isSubmitting}
                options={locationsdata}
                getOptionLabel={(option) => option}
                value={formData.location}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, location: newValue });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Location"
                    variant="outlined"
                    fullWidth
                    required
                    disabled={!isEditing || isSubmitting}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} marginTop={1}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom textAlign={'left'} disabled={!isEditing || isSubmitting}>
                Skills
              </Typography>
              <Autocomplete
                multiple
                options={technologyStack}
                value={formData.skills}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, skills: newValue });
                }}
                disabled={!isEditing || isSubmitting}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={option}
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Skills"
                    placeholder="Type or select skills"
                    fullWidth
                    disabled={!isEditing || isSubmitting}
                  />
                )}
              />
            </Grid>
            <Grid container marginTop={1} marginLeft={2}>
              <Grid item xs={12} marginBottom={2}>
                <Typography variant="h6" gutterBottom textAlign="left">
                  Upload Resume
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <FileBase
                  type="file"
                  multiple={false}
                  onDone={handleFileChange}
                  style={{ display: 'none' }}
                />
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  );
}