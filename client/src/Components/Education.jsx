import React, { useState, useEffect, useRef, useMemo } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import { courseList } from '../utils/courseslist'; 

export default function EducationInput({ formData, setFormData, isEditing }) {
    const [education, setEducation] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userValue, setUserValue] = useState('');
    const [collegeOptions, setCollegeOptions] = useState([]);
    const inputRefs = useRef([]);

    const currentYear = 1970
    const futureYear = 2050;
    const years = Array.from({ length: futureYear - currentYear + 1 }, (_, index) => (currentYear + index).toString());


    const fetchCollegeNames = async (searchQuery) => {
        try {
            const response = await axios.get('http://universities.hipolabs.com/search', {
                params: { name: searchQuery }
            });
            return response.data.map(entry => entry.name);
        } catch (error) {
            console.error('Error fetching college names:', error);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetchColleges = useRef(
        debounce(async (searchQuery) => {
            setLoading(true);
            const options = await fetchCollegeNames(searchQuery);
            setCollegeOptions(options);
        }, 300)
    ).current;



    const handleChangeEducation = (index, field, value) => {
        const updatedEducation = [...education];
        updatedEducation[index][field] = value;
        setEducation(updatedEducation);
        // Set focus to the current input field after updating its value
        const currentInputRef = inputRefs.current[index][field];
        if (currentInputRef && currentInputRef.focus) {
            currentInputRef.focus();
        }

        const combinedEducation = updatedEducation.map(edu => `${edu.degree} - ${edu.institution} (${edu.year}) - CGPA/Percentage: ${edu.cgpa}`).join(', ');
        setFormData({ ...formData, education: combinedEducation });
    };


    const handleUserInputChange = (e) => {
        if (e && e.target && e.target.value) {
        const newUserValue = e.target.value;
        setUserValue(newUserValue);
        if (newUserValue === '') {
            setCollegeOptions([]);
        } else {
            debouncedFetchColleges(newUserValue);
        }
        }
    };
    


    const handleAddEducation = () => {
        setEducation([...education, { degree: '', institution: '', year: '', cgpa: '' }]);
        inputRefs.current.push({});
    };

    const handleDeleteEducation = (index) => {
        const updatedEducation = [...education];
        updatedEducation.splice(index, 1);
        setEducation(updatedEducation);
        inputRefs.current.splice(index, 1);
    };

    const collegeOptionsMemo = useMemo(() => collegeOptions, [collegeOptions]);

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
                <Grid container spacing={2} key={`${edu.degree}-${edu.institution}-${edu.year}-${index}`} alignItems="center" marginTop={1}>
                
                        <Grid item xs={3} marginLeft={2}>
                            <Autocomplete
                                fullWidth
                            freeSolo
                            options={courseList.sort((a, b) => -b.localeCompare(a))}
                            groupBy={(option) => option[0].toUpperCase()} 
                                value={edu.degree}
                                onChange={(e, newValue) => handleChangeEducation(index, 'degree', newValue)}
                                renderInput={(params) => <TextField {...params} label="Degree" variant="outlined" />}
                                disabled={!isEditing}
                            />
                        
                    </Grid>
                    <Grid item xs={4}>
                        <Autocomplete
                            key={index} // Added key prop
                            freeSolo
                            options={collegeOptionsMemo.sort((a, b) => -b.localeCompare(a))}
                            groupBy={(option) => option[0].toUpperCase()} 
                            loading={loading}
                            value={edu.institution}
                            onChange={(e, newValue) => handleChangeEducation(index, 'institution', newValue)}
                            onInputChange={handleUserInputChange}
                            renderInput={(params) => (
                                <TextField {...params} label="Institution" variant="outlined" inputRef={(ref) => (inputRefs.current[index].institution = ref)} />
                            )}
                            disabled={!isEditing}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Autocomplete
                            label="Year"
                            variant="outlined"
                            fullWidth
                            value={edu.year}
                            onChange={(e, newValue) => handleChangeEducation(index, 'year', newValue)}
                            options={years}
                            renderInput={(params) => (
                                <TextField {...params} label="Year" variant="outlined" />
                            )}
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

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
