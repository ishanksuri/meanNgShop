const { Order } = require('../models/order');

//express JWT is the library which is used normally to secure the APIs in our server.
//JWT library is disassemling this token with the secret code which is provided in out API.
//It will confirm if it is really generated from our server or not
const expressJwt = require('express-jwt').expressjwt;
// Or
// const { expressjwt: expressJwt } = require('express-jwt');

//protection function to protect API
//unless is excluding APIs(login) as to even login it requires token which is not possible
//for products- excluding or getting get product req is fine without token authentication but not product
function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        //revoking the token under some specific condition
        isRevoked: isRevoked,
    }).unless({
        //all api are secure except these below:
        path: [
            { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/orders(.*)/, methods: ['POST', 'OPTIONS'] },

            `${api}/users/login`, 
            `${api}/users/register`,

            // //allowing all urls for temporary time
            // { url: /(.*)/ },
        ],
    });
}

//req: when i want something from body user is sending
//payload : data inside the token
async function isRevoked(req, payload) {
    //if the user is not admin, token will be rejected
    console.log(payload.payload.isAdmin);
    if (!payload.payload.isAdmin) {
        return true; //not admin so cancel request
    }
    //if user is admin
    return false;
}

module.exports = authJwt;
