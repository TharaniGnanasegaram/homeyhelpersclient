import React, { useState, useNavigate } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import DatePicker from 'react-datepicker';
import moment from 'moment';

function EditServiceAvailablePopup({ convertToHoursFunc, closePopup, serviceproviderserviceAvailableid, servicedateVar, starttimeVar, endtimeVar, durationVar }) {

    const [formData, setFormData] = useState({

    });

    const [values, setValues] = React.useState({});

    const [errors, setErrors] = React.useState({});

    const [selectedStartTime, setSelectedStartTime] = React.useState(null);

    const [duration, setDuration] = React.useState(null);

    const handleStartTimeChange = (time) => {
        setSelectedStartTime(time);
        calculateDuration(time, selectedEndTime);
    };

    const [selectedEndTime, setSelectedEndTime] = React.useState(null);

    const handleEndTimeChange = (time) => {
        setSelectedEndTime(time);
        calculateDuration(selectedStartTime, time);
    };


    const updateServiceSlotsSubmit = async (e) => {

        setErrors({});

        let isvalid = true;

        e.preventDefault();

        let formName = document.forms.edittimeavailform;

        const updateSlotService = {
            serviceproviderservicesid: serviceproviderserviceAvailableid,
            starttime: formName.starttime.value,
            endtime: formName.endtime.value,
            duration: formName.duration.value,
        }

        let tempValues = {};
        tempValues.serviceproviderservicesid = updateSlotService.serviceproviderservicesid;
        tempValues.starttime = updateSlotService.starttime;
        tempValues.endtime = updateSlotService.endtime;
        tempValues.duration = updateSlotService.duration;

        setValues({
            ...tempValues,
        });


        let temp = { ...errors };
        temp.servicedate = "";
        temp.starttime = "";
        temp.endtime = "";


        if (updateSlotService.starttime === "") {
            isvalid = false;
            temp.starttime = 'This field is required.';
        }

        if (updateSlotService.endtime === "") {
            isvalid = false;
            temp.endtime = 'This field is required.';
        }


        if (isvalid) {
            updateSlotService.duration =  parseFloat(convertToHoursFunc(updateSlotService.duration));
            await updateServiceSlotsfunc(e, updateSlotService);

        }

        else {

            setErrors({
                ...temp,
            });
        }
    };


    const updateServiceSlotsfunc = async (e, updateSlotService) => {

        let query =
            `
            mutation UpdateServiceProviderServiceAvailability($updateServiceProviderServiceAvailabilityId: String!, $starttime: String!, $endtime: String!, $duration: Float!) {
                updateServiceProviderServiceAvailability(id: $updateServiceProviderServiceAvailabilityId, starttime: $starttime, endtime: $endtime, duration: $duration) {
                  _id
                  id
                  serviceproviderservicesid
                  servicedate
                  starttime
                  endtime
                  duration
                  isavailable
                }
              }
          `

        const response = await fetch('http://localhost:4000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query, variables: {
                    updateServiceProviderServiceAvailabilityId: serviceproviderserviceAvailableid,
                    starttime: updateSlotService.starttime,
                    endtime: updateSlotService.endtime,
                    duration: updateSlotService.duration
                }
            })

        });

        response.text().then(response => {
            const parsedResponse = JSON.parse(response);

            if (parsedResponse.errors) {
                const errorMessage = parsedResponse.errors[0].message;
                alert(errorMessage);
            }
            else if (parsedResponse.data.updateServiceProviderServiceAvailability == null) {
                alert("Updating Time Slot failed!");
            }
            else {
                alert("Time slot updated successfully!");
                e.target.reset();
                closePopup();
                window.location.reload(false);
            }

        });

    }



    const parseTimeStringToTime = (timeString) => {
        const [time, meridiem] = timeString.split(' ');
        const [hours, minutes] = time.split(':');

        let parsedHours = parseInt(hours, 10);
        if (meridiem === 'PM' && parsedHours !== 12) {
            parsedHours += 12;
        } else if (meridiem === 'AM' && parsedHours === 12) {
            parsedHours = 0;
        }

        const parsedDate = new Date();
        parsedDate.setHours(parsedHours);
        parsedDate.setMinutes(parseInt(minutes, 10));

        return parsedDate;
    };



    React.useEffect(() => {
        const getDefaultTimes = async () => {
            const defaultStartTime = await parseTimeStringToTime(starttimeVar);
            const defaultEndTime = await parseTimeStringToTime(endtimeVar);

            setSelectedStartTime(defaultStartTime);
            setSelectedEndTime(defaultEndTime);
        };

        getDefaultTimes();
    }, [starttimeVar, endtimeVar]);



    const calculateDuration = (startTime, endTime) => {

        if (startTime && endTime) {
            const diffInMilliseconds = Math.abs(endTime - startTime);
            const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
            const hours = Math.floor(diffInMinutes / 60);
            const minutes = diffInMinutes % 60;
            const formattedDuration = `${hours}h ${minutes}m`;
            setDuration(formattedDuration);
        } else {
            setDuration('');
        }
    };


    return (

        <Box style={{ backgroundColor: 'rgb(0, 0, 0, 0.7)' }} component="form" id="edittimeavailform" name="edittimeavailform" onSubmit={updateServiceSlotsSubmit} sx={{ '& .MuiTextField-root': { m: 1, width: '35ch' }, }} noValidate autoComplete="off" >

            <div class="editpopup" style={{ width: '45%', height: '60%', overflowY: 'scroll' }}>

                <h6 id="editformsubhead">Edit My Service</h6>

                <TextField required id="servicedate" type="text" disabled style={{ width: '80%' }} InputLabelProps={{ shrink: true, }} name="servicedate" label="Service Date" value={new Date(parseInt(servicedateVar)).toLocaleDateString()} > </TextField>

                <div>
                    <TextField
                        label="Start Time"
                        value={selectedStartTime ? selectedStartTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase() : starttimeVar}
                        style={{
                            width: '80%',
                        }}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            endAdornment: (
                                <DatePicker
                                    name="starttime"
                                    selected={selectedStartTime}
                                    onChange={handleStartTimeChange}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    dateFormat="h:mm aa"
                                    className="mydatetimepick"
                                />
                            ),
                        }}
                    />

                </div>

                <div>
                    <TextField
                        label="End Time"
                        value={selectedEndTime ? selectedEndTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase() : endtimeVar}
                        style={{
                            width: '80%',
                        }}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            endAdornment: (
                                <DatePicker
                                    name="endtime"
                                    selected={selectedEndTime}
                                    onChange={handleEndTimeChange}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    dateFormat="h:mm aa"
                                    className="mydatetimepick"
                                />
                            ),
                        }}
                    />

                </div>

                <TextField required id="duration" style={{ width: '80%' }} type="text" disabled InputLabelProps={{ shrink: true }} label="Duration" name="duration" value={duration ? duration : durationVar} onChange={(event) => setDuration(event.target.value)} />

                <div>
                    <Button variant="contained" type="submit" class="updateServiceButton">Update Time Slot</Button>
                    <Button variant="contained" type="cancel" class="cancelupdateServiceButton" onClick={closePopup} >Cancel</Button>
                </div>

            </div>

        </Box>

    );
};


export default EditServiceAvailablePopup;