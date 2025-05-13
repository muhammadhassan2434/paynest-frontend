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
    BILLREMINDER: {
        FETCHFILLREMINDER: API_DOMAIN + 'billreminders/{id}',
        FETCHPENDINGREMINDERS: API_DOMAIN + 'pending/billreminders/{id}',
        FETCHSUCCESSREMINDERS: API_DOMAIN + 'success/billreminders/{id}',
        STOREBILLREMINDER: API_DOMAIN + 'store/billreminder',
        UPDATEBILLREMINDER: API_DOMAIN + 'update/billreminder/{id}',
        DELETEBILLREMINDER: API_DOMAIN + 'delete/billreminder/{id}',
    },
    BILLPAYMENT:{
        FETCHELECTRICITYPROVIDER: API_DOMAIN + 'service/provider/electricity/bill',
        FETCHELGASPROVIDER: API_DOMAIN + 'service/provider/gas/bill',
        VALIDATECONSUMERNUMBER: API_DOMAIN + 'validate/consumer/number',
        STOREBILLPAYMENT: API_DOMAIN + 'billpayment/store',
    }
    




}

export default API_DOMAIN;
