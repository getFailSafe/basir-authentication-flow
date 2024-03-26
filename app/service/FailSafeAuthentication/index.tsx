"use client"

const FailSafeAuthentication = async (walletAddress:any, challengeResponse:any, sessionToken:any, axios:any) => {
    const APIBaseURL = "https://api.getfailsafe.com/v1.0";
    const endpointUrl = `${APIBaseURL}/auth/login`;

    try {
        const requestBody:any = {
            wallet_address: walletAddress,
        };

        // Add challengeResponse and sessionToken if they are provided
        if (challengeResponse) {
            requestBody.challengeResponse = challengeResponse;
        }

        if (sessionToken) {
            requestBody.sessionToken = sessionToken;
        }

        const headers = {
            'x-api-key': process.env.NEXT_PUBLIC_FAILSAFE_API_KEY,
        };

        const response = await axios.post(endpointUrl, requestBody, { headers });

        return response.data;
    } catch (error) {
        console.error('Error calling the Lambda function:', error);
        throw error;
    }
};

export default FailSafeAuthentication;

