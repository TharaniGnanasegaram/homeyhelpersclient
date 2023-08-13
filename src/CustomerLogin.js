import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import UserContext from './UserContext';


function CustomerLogin() {

    const [errors, setErrors] = React.useState({});

    const [values, setValues] = React.useState({});

    const [userId, setUserId] = useState('');

    const { login } = useContext(UserContext);

    const navigate = useNavigate();

    const handleLogin = (loggedInUserId) => {

        console.log("loggedInUserId id " + loggedInUserId)
        setUserId(loggedInUserId);
        login(loggedInUserId, '100');
    };

    const loginCustomer = async (e) => {

        setErrors({});

        let isvalid = true;

        e.preventDefault();

        let formName = document.forms.loginCustomerform;

        const newCustomer = {
            username: formName.username.value,
            password: formName.password.value
        }

        let tempValues = {};
        tempValues.username = newCustomer.username;
        tempValues.password = newCustomer.password;

        setValues({
            ...tempValues,
        });


        let temp = { ...errors };
        temp.username = "";
        temp.password = "";


        if (newCustomer.username === "") {
            isvalid = false;
            temp.username = 'This field is required.';
        }

        if (newCustomer.password === "") {
            isvalid = false;
            temp.password = 'This field is required.';
        }


        if (isvalid) {
            await loginCustomerfunc(e, newCustomer);

        }

        else {

            setErrors({
                ...temp,
            });
        }
    }



    const loginCustomerfunc = async (e, newCustomer) => {

        let query =
            `
            query Logincustomer($username: String!, $password: String!) {
                logincustomer(username: $username, password: $password) {
                  _id
                  id
                  username
                  password
                  firstname
                  lastname
                  email
                  contactnumber
                  address
                }
              }
          `

        const response = await fetch('http://localhost:4000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables: { username: newCustomer.username, password: newCustomer.password } })

        });

        response.text().then(response => {
            const parsedResponse = JSON.parse(response);

            if (parsedResponse.errors) {
                const errorMessage = parsedResponse.errors[0].message;
                alert(errorMessage);
            }
            else if (parsedResponse.data.logincustomer == null) {
                alert("Log in failed! Please check your credentials");
            }
            else {
                handleLogin(parsedResponse.data.logincustomer._id)
                e.target.reset();
                navigate(`/customerhome`);
            }

        });

    }

    const registerNewUser = async (e) => {
        navigate(`/customerregister`);
    }

    return (


        <div>
            <h3 id="serprohead">Customer Portal</h3>

            <div class="twocolumnslogin">

                <div>
                    <img class="serprologinimg" src="cust2.jpg" ></img>
                </div>

                <Box component="form" id="loginCustomerform" name="loginCustomerform" onSubmit={loginCustomer} sx={{ '& .MuiTextField-root': { m: 1, width: '35ch' }, }} noValidate autoComplete="off" >

                    <div class="signupformdiv">

                        <h4 id="formhead">Customer Login</h4>

                        <TextField required id="username" type="text" label="User Name" name="username" helperText={errors.username} defaultValue={values.username} /> <br />

                        <TextField required id="password" type="password" label="Password" name="password" helperText={errors.password} defaultValue={values.password} /> <br />

                        <div>
                            <Button variant="contained" type="submit" class="registerbuttonstyle">Login me</Button>
                        </div>

                        <div>
                            <Button variant="outlined" type="button"  onClick={registerNewUser}>New user? Register!</Button>
                        </div>

                    </div>
                </Box>

            </div>
        </div>

    )

}

export default CustomerLogin;