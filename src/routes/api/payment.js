import express from 'express';
import moment from 'moment';
import querystring from 'qs';
import crypto from 'crypto';
import keys from '../../config/key.js'; // Adjusted path

const router = express.Router();

// Function to sort object properties for VNPAY signature
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
}

router.post('/create_payment_url', (req, res) => {
    process.env.TZ = 'Asia/Ho_Chi_Minh';

    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const ipAddr =
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null);

    const { vnp_TmnCode, vnp_HashSecret, vnp_Url, vnp_ReturnUrl } = keys.vnpay;
    const orderId = moment(date).format('DDHHmmss'); // Consider a more robust order ID generation
    const amount = req.body.amount;
    const bankCode = req.body.bankCode;
    const locale = req.body.language || 'vn';
    const currCode = 'VND';

    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = vnp_TmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = req.body.orderType || 'other'; // Allow orderType from request or default
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = vnp_ReturnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode) {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', vnp_HashSecret);
    // Use Buffer.from for deprecated new Buffer()
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;

    const paymentUrl = vnp_Url + '?' + querystring.stringify(vnp_Params, { encode: false });

    res.status(200).json({ code: '00', message: 'success', data: paymentUrl });
});

router.get('/vnpay_return', (req, res) => {
    let vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    const { vnp_HashSecret } = keys.vnpay;
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    // Instead of rendering, redirect to a client-side page with query params
    const clientReturnUrl = keys.app.clientURL || 'http://localhost:5173'; // Get from config
    if (secureHash === signed) {
        // TODO: Check order status in your database and update it
        // For now, just redirect with VNPAY params
        const redirectUrl = `${clientReturnUrl}/payment-result?${querystring.stringify(vnp_Params, { encode: false })}`;
        res.redirect(redirectUrl);
    } else {
        const redirectUrl = `${clientReturnUrl}/payment-result?vnp_ResponseCode=97`;
        res.redirect(redirectUrl);
    }
});

router.get('/vnpay_ipn', (req, res) => {
    let vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];

    const orderId = vnp_Params['vnp_TxnRef'];
    const rspCode = vnp_Params['vnp_ResponseCode'];
    const amount = vnp_Params['vnp_Amount']; // VNPAY returns amount in VND * 100

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    const { vnp_HashSecret } = keys.vnpay;
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    // TODO: Implement your own logic to check orderId, amount, and paymentStatus from your database
    const checkOrderId = true; // Replace with actual check: findOrderById(orderId)
    const checkAmount = true; // Replace with actual check: order.amount === amount / 100
    let paymentStatus = '0'; // Replace with actual check: order.paymentStatus

    if (secureHash === signed) {
        if (checkOrderId) {
            if (checkAmount) {
                if (paymentStatus === '0') {
                    // Check if order is not already processed
                    if (rspCode === '00') {
                        // TODO: Update order status to 'success' in your database
                        // paymentStatus = '1';
                        console.log(`VNPAY IPN: Payment success for order ${orderId}`);
                        res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
                    } else {
                        // TODO: Update order status to 'failed' in your database
                        // paymentStatus = '2';
                        console.log(`VNPAY IPN: Payment failed for order ${orderId} with code ${rspCode}`);
                        res.status(200).json({ RspCode: '00', Message: 'Confirm Success' }); // VNPAY expects 00 even for failed biz logic
                    }
                } else {
                    console.log(`VNPAY IPN: Order ${orderId} already processed.`);
                    res.status(200).json({ RspCode: '02', Message: 'Order already confirmed' });
                }
            } else {
                console.log(`VNPAY IPN: Amount mismatch for order ${orderId}.`);
                res.status(200).json({ RspCode: '04', Message: 'Invalid amount' });
            }
        } else {
            console.log(`VNPAY IPN: Order ${orderId} not found.`);
            res.status(200).json({ RspCode: '01', Message: 'Order not found' });
        }
    } else {
        console.log('VNPAY IPN: Checksum failed.');
        res.status(200).json({ RspCode: '97', Message: 'Invalid Checksum' });
    }
});

// TODO: Add /querydr and /refund routes if needed, similar to the demo
// Remember to use API-style responses (JSON) and secure these endpoints.

export default router;
