import React, { useState , useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import TextField from '@mui/material/TextField';
import FileBase from 'react-file-base64';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MuiChipsInput } from 'mui-chips-input'
import { openBase64NewTab } from '../CommonComponent/base64topdf';
import { jwtDecode } from "jwt-decode";
import EditIcon from '@mui/icons-material/Edit';

// import Box from '@mui/material/Box';
import axios from 'axios';
import Grid from '@mui/material/Grid'; // Import Grid component
// import Navbar from './Navbar/Navbar';

export default function Form() {
  const [formData, setFormData] = useState({

    firstName: '',
    lastName: '',
    email: '',
    contact: '',
    experience: '',
    education: '',
    skills: [],
    location: '',
    resume: null
  });
  const [certificate, setCertificate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [resume, setResume] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authtoken");
        const userid = decodeAuthToken(token)
        const response = await axios.get(`http://localhost:8000/api/users/getuser/${userid}`);
        const userData = response.data.data.userProfile;
        console.log(userData)

        if (
          userData.firstName &&
          userData.lastName &&
          userData.email &&
          userData.contact &&
          userData.experience &&
          userData.education   &&
            userData.skills &&
            userData.location && 
            userData.resume
        ) {
          setFormData(userData);
          setIsEditing(false);
        } else {
          console.error('Error: Fetched data is incomplete.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const technologyStack = [
    "Android", "Angular", "ASP.NET", "AWS", "Bootstrap", "C#", "C++", "CSS", "Django", "Docker", "Express.js", "Flask", "Git", "Heroku", "HTML", "Java", "JavaScript", "Kubernetes", "Linux", "MongoDB", "MySQL", "Nginx", "Node.js", "PHP", "PostgreSQL", "Python", "React", "Redis", "Ruby on Rails", "SQLite", "Spring Boot", "Swift", "Tailwind CSS", "TensorFlow", "TypeScript", "Unity", "Vue.js"
  ];
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
      const userid=decodeAuthToken(token)
      console.log(token)
 
      console.log(userid)
      // console.log(formData)
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
      <Container style={{ paddingBottom: '20vh' }}>
        <Container style={{ paddingInline: 0, paddingTop: 10 }} >
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
          {/* Personal Details */}
          <Typography variant="h6" gutterBottom textAlign={'left'}>
            Personal Details
          </Typography>
          <Grid container spacing={2}> {/* Add Grid container with spacing */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                variant="outlined"
                fullWidth
                required
                name="firstName"
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
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing || isSubmitting}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Contact"
                variant="outlined"
                fullWidth
                required
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                disabled={!isEditing || isSubmitting}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Experience"
                variant="outlined"
                fullWidth
                required
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                disabled={!isEditing || isSubmitting}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Education"
                variant="outlined"
                fullWidth
                required
                name="education"
                value={formData.education}
                onChange={handleChange}
                disabled={!isEditing || isSubmitting}
              />
            </Grid>
            <Grid item xs={12} >
            <TextField
                label="Location"
                variant="outlined"
                fullWidth
                required 
                disabled={!isEditing || isSubmitting}
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
              </Grid>
          </Grid>

          <Grid container spacing={2} marginTop={1}>
            {/* Skills */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom textAlign={'left'} disabled={!isEditing || isSubmitting}>
                Skills
              </Typography>
              <MuiChipsInput
                // label="Skills"
                variant="outlined"
                helperText="Press enter to add skills"
                value={formData.skills}
                onChange={handleSkillsChange}
                fullWidth
              />
            </Grid>
            {/* Location */}
            <Grid item xs={12}>
              {/* <Typography variant="h6" gutterBottom textAlign={'left'} marginTop={2}>
                Location
              </Typography> */}

              <Typography variant="h6" gutterBottom textAlign={'left'} marginTop={2}>
                Upload Resume
              </Typography>
            </Grid>

            <Grid item xs={12} container justifyContent="space-between">
              {/* Upload Resume */}
              <Grid item>

                <FileBase
                  type="file"
                  multiple={false}
                  onDone={handleFileChange}
                />
              </Grid>

              {/* Submit Button */}
             
            </Grid>
          </Grid>

        </form>
      </Container>
    </>
  );
}
