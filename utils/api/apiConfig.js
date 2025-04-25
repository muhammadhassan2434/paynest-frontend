const API_DOMAIN = 'https://paynest.coinxness.com/api/';


export const API_ENDPOINTS = {
    AUTH: {
        REGISTER: API_DOMAIN + 'register',
        OTPVERIFY: API_DOMAIN + 'verify/otp',
        REGISTERACCOUNT: API_DOMAIN + 'account/register',
        USERLOGIN: API_DOMAIN + 'user/login',
    },
    PAYNESTTRANSFER: {
        VALIDATENUMBER: API_DOMAIN + 'validate/paynest/number',
        VALIDATEAMOUNT: API_DOMAIN + 'validate/enteramount',
        TRANSFERAMOUNT: API_DOMAIN + 'paynest/transfer',
    },
    SERVICES: {
        FETCHSERVICES: API_DOMAIN + 'services',
    },
    




}

export default API_DOMAIN;
