import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Box } from '@mui/material'; // Import Box component
import { jobtitles } from '../utils/TechnologyStack';

export default function ExperienceInput({ formData, setFormData, isEditing }) {
    const [experiences, setExperiences] = useState([]);

    const handleAddExperience = () => {
        setExperiences([...experiences, { year: '', jobRole: '', companyName: '' }]);
    };

    const handleDeleteExperience = (index) => {
        const updatedExperiences = [...experiences];
        updatedExperiences.splice(index, 1);
        setExperiences(updatedExperiences);
    };

    const handleChangeExperience = (index, field, value) => {
        const updatedExperiences = [...experiences];
        updatedExperiences[index][field] = value;
        setExperiences(updatedExperiences);

        // Update formData with the combined experience string
        const combinedExperience = updatedExperiences.map(exp => `${exp.year} - ${exp.jobRole} at ${exp.companyName}`).join(', ');
        setFormData({ ...formData, experience: combinedExperience });
    };

    // Generate year options from 0 to 80
    const years = Array.from({ length: 81 }, (_, index) => index.toString());

    return (
        <Grid container spacing={2} alignItems="center" marginLeft={0} marginTop={2}>
            <Grid item xs={12}>
                <TextField
                    label="Experience"
                    variant="outlined"
                    required
                    name="experience"
                    fullWidth
                    value={formData.experience}
                    onChange={() => { }}
                    disabled
                />
            </Grid>
            {experiences.map((experience, index) => (
                <Grid container spacing={2} key={index} alignItems="center" marginTop={1}>
                    <Grid item xs={3} marginLeft={2}>
                        <TextField
                            label="Year"
                            variant="outlined"
                            fullWidth
                            value={experience.year}
                            onChange={(e) => handleChangeExperience(index, 'year', e.target.value)}
                            disabled={!isEditing}
                            error={isNaN(experience.year) || experience.year < 0 || experience.year > 80}
                            helperText={
                                isNaN(experience.year) || experience.year < 0 || experience.year > 80 ?
                                    "Year must be a number between 0 and 80" :
                                    ""
                            }
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Autocomplete
                            fullWidth
                            freeSolo
                            options={jobtitles.sort((a, b) => -b.localeCompare(a))}
                            groupBy={(option) => option[0].toUpperCase()} 
                            value={experience.jobRole}
                            onChange={(e, newValue) => handleChangeExperience(index, 'jobRole', newValue)}
                            filterOptions={(options, { inputValue }) =>
                                options.filter((option) =>
                                    option.toLowerCase().includes(inputValue.toLowerCase())
                                )
                            } 
                            renderInput={(params) => <TextField {...params} label="Job Role" variant="outlined" />}
                            disabled={!isEditing}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="Company Name"
                            variant="outlined"
                            fullWidth
                            value={experience.companyName}
                            onChange={(e) => handleChangeExperience(index, 'companyName', e.target.value)}
                            disabled={!isEditing}
                        />
                    </Grid>
                    {isEditing && (
                        <Grid item>
                            <IconButton onClick={() => handleDeleteExperience(index)}>
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    )}
                </Grid>
            ))}
            {isEditing && (
                <Grid item>
                    <IconButton onClick={handleAddExperience}>
                        <AddIcon />
                    </IconButton>
                </Grid>
            )}
        </Grid>
    );
}
