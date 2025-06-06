export default {
    app: {
        name: 'Mern Ecommerce',
        apiURL: `${process.env.BASE_API_URL}`,
        clientURL: process.env.CLIENT_URL,
    },
    port: process.env.PORT || 3000,
    database: {
        url: process.env.MONGO_URI,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        tokenLife: '7d',
    },
    mailchimp: {
        key: process.env.MAILCHIMP_KEY,
        listKey: process.env.MAILCHIMP_LIST_KEY,
    },
    mailgun: {
        key: process.env.MAILGUN_KEY,
        domain: process.env.MAILGUN_DOMAIN,
        sender: process.env.MAILGUN_EMAIL_SENDER,
    },
    google: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    facebook: {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    },
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
        bucketName: process.env.AWS_BUCKET_NAME,
    },
    // VNPAY Configuration
    vnpay: {
        vnp_TmnCode: process.env.VNP_TMN_CODE || '5HZLPWM3',
        vnp_HashSecret: process.env.VNP_HASH_SECRET || 'F2TT67F52DOZ5BHGEDVFZFO75UVGTLO0',
        vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
        vnp_Api: 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
        vnp_ReturnUrl: process.env.VNP_RETURN_URL || 'http://localhost:3000/api/v1/payment/vnpay_return',
    },
};
