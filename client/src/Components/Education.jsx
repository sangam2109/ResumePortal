import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Box } from '@mui/material'; // Import Box component
import { technologyStack } from '../utils/TechnologyStack';

export default function EducationInput({ formData, setFormData, isEditing }) {
    const [education, setEducation] = useState([]);

    const handleAddEducation = () => {
        setEducation([...education, { degree: '', institution: '', year: '', cgpa: '' }]);
    };

    const handleDeleteEducation = (index) => {
        const updatedEducation = [...education];
        updatedEducation.splice(index, 1);
        setEducation(updatedEducation);
    };

    const handleChangeEducation = (index, field, value) => {
        const updatedEducation = [...education];
        updatedEducation[index][field] = value;
        setEducation(updatedEducation);

        // Update formData with the combined education string
        const combinedEducation = updatedEducation.map(edu => `${edu.degree} - ${edu.institution} (${edu.year}) - CGPA/Percentage: ${edu.cgpa}`).join(', ');
        setFormData({ ...formData, education: combinedEducation });
    };

    return (
        <Grid container spacing={2} alignItems="center" marginLeft={0} marginTop={2}>
            <Grid item xs={12}>
                <TextField
                    label="Education"
                    variant="outlined"
                    required
                    name="education"
                    fullWidth
                    value={formData.education}
                    onChange={() => { }}
                    disabled
                />
            </Grid>
            {education.map((edu, index) => (
                <Grid container spacing={2} key={index} alignItems="center" marginTop={1}>
                    <Grid item xs={3} marginLeft={2}>
                        <TextField
                            label="Degree"
                            variant="outlined"
                            fullWidth
                            value={edu.degree}
                            onChange={(e) => handleChangeEducation(index, 'degree', e.target.value)}
                            disabled={!isEditing}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="Institution"
                            variant="outlined"
                            fullWidth
                            value={edu.institution}
                            onChange={(e) => handleChangeEducation(index, 'institution', e.target.value)}
                            disabled={!isEditing}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            label="Year"
                            variant="outlined"
                            fullWidth
                            value={edu.year}
                            onChange={(e) => handleChangeEducation(index, 'year', e.target.value)}
                            disabled={!isEditing}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            label="CGPA/Percentage"
                            variant="outlined"
                            fullWidth
                            value={edu.cgpa}
                            onChange={(e) => handleChangeEducation(index, 'cgpa', e.target.value)}
                            disabled={!isEditing}
                        />
                    </Grid>
                    {isEditing && (
                        <Grid item>
                            <IconButton onClick={() => handleDeleteEducation(index)}>
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    )}
                </Grid>
            ))}
            {isEditing && (
                <Grid item>
                    <IconButton onClick={handleAddEducation}>
                        <AddIcon />
                    </IconButton>
                </Grid>
            )}
        </Grid>
    );
}
