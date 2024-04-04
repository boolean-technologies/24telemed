import React from 'react'
import { Flex, Typography } from '@local/shared-components'


const PrivacyPolicy = () => {
    return (
        <Flex justifyContent="space-between" alignItems="center" direction="column">

            <Typography variant="bodyXl"
            >
                Privacy Policy
            </Typography>


            <Typography variant='bodySm'>
            We may collect personal information, including but not limited to your name, contact information, medical history, and payment details, when you use our app.


            </Typography>

        </Flex>
    )
}


export default PrivacyPolicy