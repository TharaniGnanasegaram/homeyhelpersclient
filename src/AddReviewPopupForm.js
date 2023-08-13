import React, { useState, useNavigate } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

function AddReviewPopup({ closePopup, serviceproviderservicesid }) {

    const customerid = localStorage.getItem('userId');

    const [values, setValues] = React.useState({});

    const [errors, setErrors] = React.useState({});

    console.log("serv " + serviceproviderservicesid);

    console.log("cus " + customerid)

    const addReviewSubmit = (e) => {
        setErrors({});

        let isvalid = true;

        e.preventDefault();

        let formName = document.forms.addreviewform;

        const newReview = {
            reviewcomments: formName.reviewcomments.value
        }

        let tempValues = {};
        tempValues.reviewcomments = newReview.reviewcomments;

        setValues({
            ...tempValues,
        });


        let temp = { ...errors };
        temp.reviewcomments = "";

        if (newReview.reviewcomments === "") {
            isvalid = false;
            temp.reviewcomments = 'This field is required.';
        }
        

        if (isvalid) {
            addReviewfunc(e, newReview);

        }

        else {

            setErrors({
                ...temp,
            });
        }
    };


    const addReviewfunc = async (e, newReview) => {

        let query =
            `
            mutation AddReview($serviceproviderservicesid: String!, $customerid: String!, $reviewdate: String!, $reviewcomments: String!) {
                addReview(serviceproviderservicesid: $serviceproviderservicesid, customerid: $customerid, reviewdate: $reviewdate, reviewcomments: $reviewcomments) {
                  _id
                  id
                  serviceproviderservicesid
                  customerid
                  reviewdate
                  reviewcomments
                }
              }
          `

        const response = await fetch('https://juicy-inky-porcupine.glitch.me/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables: { serviceproviderservicesid: serviceproviderservicesid, customerid: customerid, reviewdate: new Date(), reviewcomments: newReview.reviewcomments } })

        });

        response.text().then(response => {
            const parsedResponse = JSON.parse(response);

            if (parsedResponse.errors) {
                const errorMessage = parsedResponse.errors[0].message;
                alert(errorMessage);
            }
            else if (parsedResponse.data.addReview == null) {
                alert("Adding review failed!");
            }
            else {
                alert("Review Added successfully!");
                e.target.reset();
                closePopup();
            }

        });

    }


    return (

        <Box style={{ backgroundColor: 'rgb(0, 0, 0, 0.7)' }} component="form" id="addreviewform" name="addreviewform" onSubmit={addReviewSubmit} sx={{ '& .MuiTextField-root': { m: 1, width: '35ch' }, }} noValidate autoComplete="off" >

            <div class="reviewpopup" style={{ width: '45%', height: '60%' }}>

                <h6 id="editformsubhead">Write Review</h6>

                <TextField required id="reviewcomments" type="text" label="Review Comment" name="reviewcomments" multiline rows={4} maxRows={6} helperText={errors.reviewcomments} /> <br />

                <div>
                    <Button variant="contained" type="submit" class="updateServiceButton">Add Review</Button>
                    <Button variant="contained" type="cancel" class="cancelupdateServiceButton" onClick={closePopup} >Cancel</Button>
                </div>

            </div>

        </Box>

    );
};


export default AddReviewPopup;