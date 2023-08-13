import React, { useState, useNavigate } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';


function ServiceProviderReview({ closeReviewPopup, serviceproviderserviceid }) {

    const [myReviews, setMyReviews] = React.useState([]);

    const [reviewsFetched, setReviewsFetched] = useState(false);

    const [showLoader, setShowLoader] = React.useState(true);

    setTimeout(() => {
        setShowLoader(false);
    }, 1000);

    let query = `
                query {
                    getReviewByServiceProvider(serviceproviderservicesid: "${serviceproviderserviceid}") {
                    _id
                    id
                    serviceproviderservicesid
                    customerid
                    customername
                    reviewdate
                    reviewcomments
                    }
                }
            `;


    function fetchingMyReviews() {

        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        }).then(async (response) => {
            let tempMyReviews = await response.json();
            let tempReviewList = tempMyReviews.data.getReviewByServiceProvider;
            setMyReviews(tempReviewList)
            setReviewsFetched(true);
        })
    }


    React.useEffect(function () {
        fetchingMyReviews()
    }, []);



    return (

        <Box style={{ backgroundColor: 'rgb(0, 0, 0, 0.7)' }} id="checkreviewform" name="checkreviewform" sx={{ '& .MuiTextField-root': { m: 1, width: '35ch' }, }}>

            <div class="editpopup" style={{ width: '45%', height: '60%', overflowY: 'scroll' }}>

                <h6 id="popupsubhead">My Service Reviews</h6>

                {!reviewsFetched ?
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto' }}>
                        <CircularProgress />
                    </div>
                    : null}

                {reviewsFetched && myReviews && myReviews.map((myReview) => (
                    <div key={myReview.id}>
                        <h6 id="reviewcustomername">
                            {myReview.customername} |  {new Date(parseInt(myReview.reviewdate) + new Date().getTimezoneOffset() * 60000).toLocaleDateString('en-US')}
                        </h6>
                        <p>
                            {myReview.reviewcomments}
                        </p>
                        <hr />
                    </div>
                ))}

                {(reviewsFetched && (myReviews == "")) ? <p> No Reviews Found</p> : null}

                <div>
                    <Button variant="contained" type="cancel" class="cancelPopupButton" onClick={closeReviewPopup} >Close</Button>
                </div>
            </div>

        </Box>


    );
};


export default ServiceProviderReview;