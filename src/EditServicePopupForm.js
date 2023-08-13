import React, { useState, useNavigate } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

function EditServicePopup({ closePopup, serviceproviderserviceid, serviceidvar, hourlyratevar, experiencevar }) {

    const [formData, setFormData] = useState({
        
    });

    const [values, setValues] = React.useState({});

    const [errors, setErrors] = React.useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const updateServiceSubmit = (e) => {
        setErrors({});

        let isvalid = true;

        e.preventDefault();

        let formName = document.forms.editMyServiceform;

        const newServiceProviderService = {
            hourlyrate: formName.hourlyrate.value,
            experience: formName.experience.value
        }

        let tempValues = {};
        tempValues.hourlyrate = newServiceProviderService.hourlyrate;
        tempValues.experience = newServiceProviderService.experience;

        setValues({
            ...tempValues,
        });


        let temp = { ...errors };
        temp.hourlyrate = "";
        temp.experience = "";

        if (newServiceProviderService.hourlyrate === "") {
            isvalid = false;
            temp.hourlyrate = 'This field is required.';
        }
        

        if (newServiceProviderService.experience === "") {
            isvalid = false;
            temp.experience = 'This field is required.';
        }

        if(newServiceProviderService.hourlyrate !== ""  && isNaN(newServiceProviderService.hourlyrate)){
            isvalid = false;
            temp.hourlyrate = 'Hourly rate should be numeric.';
        }

        if (isvalid) {
            newServiceProviderService.hourlyrate = parseFloat(newServiceProviderService.hourlyrate)
            updateServicefunc(e, newServiceProviderService);

        }

        else {

            setErrors({
                ...temp,
            });
        }
    };


    const updateServicefunc = async (e, newServiceProviderService) => {

        let query =
            `
            mutation UpdateServiceProviderService($updateServiceProviderServiceId: String!, $hourlyrate: Float!, $experience: String!) {
                updateServiceProviderService(id: $updateServiceProviderServiceId, hourlyrate: $hourlyrate, experience: $experience) {
                  _id
                  id
                  serviceproviderid
                  serviceid
                  hourlyrate
                  experience
                }
              }
          `

        const response = await fetch('http://localhost:4000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables: { updateServiceProviderServiceId: serviceproviderserviceid, hourlyrate: newServiceProviderService.hourlyrate, experience: newServiceProviderService.experience } })

        });

        response.text().then(response => {
            const parsedResponse = JSON.parse(response);

            if (parsedResponse.errors) {
                const errorMessage = parsedResponse.errors[0].message;
                alert(errorMessage);
            }
            else if (parsedResponse.data.updateServiceProviderService == null) {
                alert("Updating Service failed!");
            }
            else {
                alert("Service updated successfully!");
                e.target.reset();
                closePopup();
            }

        });

    }


    return (

        <Box style={{ backgroundColor: 'rgb(0, 0, 0, 0.7)' }} component="form" id="editMyServiceform" name="editMyServiceform" onSubmit={updateServiceSubmit} sx={{ '& .MuiTextField-root': { m: 1, width: '35ch' }, }} noValidate autoComplete="off" >

            <div class="editpopup" style={{ width: '45%', height: '60%'}}>

                <h6 id="editformsubhead">Edit My Service</h6>

                <TextField required id="services" type="text" disabled name="services" label="Service"  value={serviceidvar} > </TextField>

                <TextField required id="hourlyrate" type="text" label="Hourly Rate" name="hourlyrate" helperText={errors.hourlyrate} defaultValue={hourlyratevar} /> <br />

                <TextField required id="experience" type="text" label="Experience" name="Experience" multiline rows={4} maxRows={6} helperText={errors.experience} defaultValue={experiencevar} /> <br />

                <div>
                    <Button variant="contained" type="submit" class="updateServiceButton">Update Service</Button>
                    <Button variant="contained" type="cancel" class="cancelupdateServiceButton" onClick={closePopup} >Cancel</Button>
                </div>

            </div>

        </Box>

    );
};


export default EditServicePopup;