/**
@Description  : This file is the entry point for RestService
**/

const express = require('express');
const cors = require('cors');
const endpoints = require('./utils/endpoints.util.js')
const engine = require("./utils/engine.util.js")
const messages = require('./utils/messages.util.js')
require('dotenv').config();
const cookieParser = require('cookie-parser');

/******** admin portal Services or Controllers *********/
const userService = require("./services/user.service.js");
const venueFacilityService = require('./services/venueFacility.service.js');
const venueService = require('./services/venue.service.js');
const userAuth = require('./middleware/authentication.js');
const userProfileService = require('./services/userprofile.service.js');
const userNewPasswordService = require('./services/usernewpassword.service.js');
const subscriptionService = require('./services/subscription.service.js');
const facilityTypeService = require('./services/facilitytype.service.js');
const classService = require('./services/class.service.js');
const checkPermission = require('./middleware/authorization.js');
const userLoginService = require('./services/userlogin.service.js');
const userEmailTokenService = require('./services/user.emailToken.service.js');
const classTypeService = require('./services/classtype.service.js');
const featureService = require('./services/feature.service.js');
const bookingService = require('./services/booking.service.js');
const adminCustomerService = require('./services/customer.service.js');
const voucherService = require('./services/voucher.service.js');
const offerService = require('./services/offer.service.js');
const purchasedVoucherService = require('./services/purchasedVoucher.service.js');

// lead service controllers
const leadVenueService = require('./leadgenerationservices/venue.service.js');
const leadSubscriptionService = require('./leadgenerationservices/subscription.service.js');
const leadVenueFacilityService = require('./leadgenerationservices/facility.service.js');
const leadClassService = require('./leadgenerationservices/class.service.js');
const leadFacilityTypeService = require('./leadgenerationservices/facilityType.service.js');
const countryService = require('./services/country.service.js');
const leadCountryService = require('./leadgenerationservices/country.service.js');

// mobile application controllers
const customerService = require('./mobileappservices/customer.service.js');
const customerAuth = require('./middleware/authenticationMobile.js');
const customerProfileService = require('./mobileappservices/customerprofile.service.js');
const customerVenueService = require('./mobileappservices/venue.service.js');
const customerSubscriptionService = require('./mobileappservices/subscription.service.js');
const customerVenueFacilityService = require('./mobileappservices/facility.service.js');
const customerFacilityTypeService = require('./mobileappservices/facilityType.service.js');
const customerClassTypeService = require('./mobileappservices/classtype.service.js');
const profilePictureService = require('./mobileappservices/profilepicture.service.js');
const customerRegistrationService = require('./mobileappservices/customerRegistration.service.js');
const leadRegistrationService = require('./leadgenerationservices/registration.service.js');
const customerBookingService = require('./mobileappservices/booking.service.js');
const SessionService = require('./mobileappservices/sessions.service.js');
const checkInVerifyService = require('./mobileappservices/checkInVerify.service.js');
const customerSubscriptionHistoryService = require('./mobileappservices/subscriptionHistory.Service.js');
const CustomerPaymentGatewayService = require('./mobileappservices/payment.service.js');
const customerVoucherService = require('./mobileappservices/voucher.service.js');
const customerVoucherPurchaseService = require('./mobileappservices/customerVoucherPurchase.service.js');
const customerOfferService = require('./mobileappservices/offer.service.js');
const redeemOfferService = require('./services/redeemOffers.service.js');


const restService = express();
const consoleLogger = engine.generateConsoleLogger();
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
            // No Origin means it's likely from a mobile app (Expo APK or other native apps)
            return callback(null, true);  // ✅ Use `true`, NOT `'*'`
        }
        const allowedOrigins = [
            'https://benefitplus.com',
            'https://www.benefitplus.com'
        ];

        if (allowedOrigins.includes(origin)) {
            callback(null, origin);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true  // ✅ Allows sending cookies/auth tokens
};


restService.use(cookieParser());
restService.use(cors(corsOptions));
restService.use(express.json());

// mobile application
restService.use(endpoints.ENDPOINT_CUSTOMER_MOBILE_BASE_URL + endpoints.ENDPOINT_GROUP_CUSTOMER, customerService);
restService.use(endpoints.ENDPOINT_CUSTOMER_MOBILE_BASE_URL + endpoints.ENDPOINT_GROUP_CUSTOMER_PROFILE, customerAuth, customerProfileService);
restService.use(endpoints.ENDPOINT_CUSTOMER_MOBILE_BASE_URL + endpoints.ENDPOINT_GROUP_CUSTOMER_VENUE, customerVenueService);
restService.use(endpoints.ENDPOINT_CUSTOMER_MOBILE_BASE_URL + endpoints.ENDPOINT_GROUP_CUSTOMER_SUBSCRIPTIONS, customerAuth, customerSubscriptionService);
restService.use(endpoints.ENDPOINT_CUSTOMER_MOBILE_BASE_URL + endpoints.ENDPOINT_GROUP_CUSTOMER_SUBSCRIPTION_HISTORY, customerAuth, customerSubscriptionHistoryService);
restService.use(endpoints.ENDPOINT_CUSTOMER_MOBILE_BASE_URL + endpoints.ENDPOINT_GROUP_CUSTOMER_FACILITIES, customerAuth, customerVenueFacilityService);
restService.use(endpoints.ENDPOINT_CUSTOMER_MOBILE_BASE_URL + endpoints.ENDPOINT_GROUP_CUSTOMER_FACILITY_TYPE, customerAuth, customerFacilityTypeService);
restService.use(endpoints.ENDPOINT_CUSTOMER_MOBILE_BASE_URL + endpoints.ENDPOINT_GROUP_CUSTOMER_CLASS_TYPE, customerAuth, customerClassTypeService);
restService.use(endpoints.ENDPOINT_CUSTOMER_MOBILE_BASE_URL + endpoints.ENDPOINT_GROUP_CUSTOMER_PROFILE, customerAuth, profilePictureService);
restService.use(endpoints.ENDPOINT_CUSTOMER_MOBILE_BASE_URL + endpoints.ENDPOINT_GROUP_CUSTOMER_REGISTRATION, customerAuth, customerRegistrationService);
restService.use(endpoints.ENDPOINT_CUSTOMER_MOBILE_BASE_URL + endpoints.ENDPOINT_GROUP_CUSTOMER_BOOKING, customerAuth, customerBookingService);
restService.use(endpoints.ENDPOINT_CUSTOMER_MOBILE_BASE_URL + endpoints.ENDPOINT_GROUP_CUSTOMER_SESSIONS, customerAuth, SessionService);
restService.use(endpoints.ENDPOINT_CUSTOMER_MOBILE_BASE_URL + endpoints.ENDPOINT_GROUP_CUSTOMER_CHECKIN, customerAuth, checkInVerifyService);
restService.use(endpoints.ENDPOINT_CUSTOMER_MOBILE_BASE_URL + endpoints.ENDPOINT_GROUP_CUSTOMER_PAYMENT, CustomerPaymentGatewayService);
restService.use(endpoints.ENDPOINT_CUSTOMER_MOBILE_BASE_URL + endpoints.ENDPOINT_GROUP_CUSTOMER_VOUCHER, customerAuth, customerVoucherService);
restService.use(endpoints.ENDPOINT_CUSTOMER_MOBILE_BASE_URL + endpoints.ENDPOINT_GROUP_CUSTOMER_PURCHASED_VOUCHER, customerAuth, customerVoucherPurchaseService);
restService.use(endpoints.ENDPOINT_CUSTOMER_MOBILE_BASE_URL + endpoints.ENDPOINT_GROUP_CUSTOMER_OFFERS,customerAuth, customerOfferService);


// lead generation site
restService.use(endpoints.ENDPOINT_CUSTOMER_CLIENT_BASE_URL + endpoints.ENDPOINT_GROUP_LEAD_COUNTRY, leadCountryService);
restService.use(endpoints.ENDPOINT_CUSTOMER_CLIENT_BASE_URL + endpoints.ENDPOINT_GROUP_LEAD_VENUE, leadVenueService);
restService.use(endpoints.ENDPOINT_CUSTOMER_CLIENT_BASE_URL + endpoints.ENDPOINT_GROUP_LEAD_SUBSCRIPTIONS, leadSubscriptionService);
restService.use(endpoints.ENDPOINT_CUSTOMER_CLIENT_BASE_URL + endpoints.ENDPOINT_GROUP_LEAD_FACILITIES, leadVenueFacilityService);
restService.use(endpoints.ENDPOINT_CUSTOMER_CLIENT_BASE_URL + endpoints.ENDPOINT_GROUP_LEAD_CLASSES, leadClassService);
restService.use(endpoints.ENDPOINT_CUSTOMER_CLIENT_BASE_URL + endpoints.ENDPOINT_GROUP_LEAD_FACILITY_TYPE, leadFacilityTypeService);
restService.use(endpoints.ENDPOINT_CUSTOMER_CLIENT_BASE_URL + endpoints.ENDPOINT_GROUP_LEAD_REGISTRATION, leadRegistrationService);
// restService.use(endpoints.ENDPOINT_CUSTOMER_MOBILE_BASE_URL + endpoints.ENDPOINT_GROUP_LEAD_SUBSCRIPTIONS, leadSubscribeService);


// admin portal
restService.use(endpoints.ENDPOINT_BASE_URL + endpoints.ENDPOINT_GROUP_USER_VERIFICATION, userEmailTokenService);
restService.use(endpoints.ENDPOINT_BASE_URL + endpoints.ENDPOINT_GROUP_USER_LOGIN, userLoginService);
restService.use(endpoints.ENDPOINT_BASE_URL + endpoints.ENDPOINT_GROUP_USER_NEWPASSWORD, userNewPasswordService);
restService.use(endpoints.ENDPOINT_BASE_URL + endpoints.ENDPOINT_GROUP_USER_PROFILE, userAuth, checkPermission, userProfileService); // for again capturing current logged in user after reload in redux state being called in the layout in frontend
restService.use(endpoints.ENDPOINT_BASE_URL + endpoints.ENDPOINT_GROUP_USER, userAuth, checkPermission, userService);
restService.use(endpoints.ENDPOINT_BASE_URL + endpoints.ENDPOINT_GROUP_VENUE, userAuth, checkPermission, venueService);
restService.use(endpoints.ENDPOINT_BASE_URL + endpoints.ENDPOINT_GROUP_FACILITY, userAuth, checkPermission, venueFacilityService);
restService.use(endpoints.ENDPOINT_BASE_URL + endpoints.ENDPOINT_GROUP_SUBSCRIPTION, userAuth, checkPermission, subscriptionService);
restService.use(endpoints.ENDPOINT_BASE_URL + endpoints.ENDPOINT_GROUP_FACILITY_TYPE, userAuth, checkPermission, facilityTypeService);
restService.use(endpoints.ENDPOINT_BASE_URL + endpoints.ENDPOINT_GROUP_CLASS, userAuth, checkPermission, classService);
restService.use(endpoints.ENDPOINT_BASE_URL + endpoints.ENDPOINT_GROUP_CLASS_TYPE, userAuth, checkPermission, classTypeService)
restService.use(endpoints.ENDPOINT_BASE_URL + endpoints.ENDPOINT_GROUP_FEATURE, userAuth, checkPermission, featureService);
restService.use(endpoints.ENDPOINT_BASE_URL + endpoints.ENDPOINT_GROUP_COUNTRY, userAuth, checkPermission, countryService);
restService.use(endpoints.ENDPOINT_BASE_URL + endpoints.ENDPOINT_GROUP_BOOKING, userAuth, checkPermission, bookingService);
restService.use(endpoints.ENDPOINT_BASE_URL + endpoints.ENDPOINT_GROUP_CUSTOMER, userAuth, checkPermission, adminCustomerService);
restService.use(endpoints.ENDPOINT_BASE_URL + endpoints.ENDPOINT_GROUP_VOUCHER, userAuth, checkPermission, voucherService);
restService.use(endpoints.ENDPOINT_BASE_URL + endpoints.ENDPOINT_GROUP_OFFER, userAuth, checkPermission, offerService);
restService.use(endpoints.ENDPOINT_BASE_URL + endpoints.ENDPOINT_GROUP_PURCHASED_VOUCHER, userAuth, purchasedVoucherService);
restService.use(endpoints.ENDPOINT_BASE_URL + endpoints.ENDPOINT_GROUP_REDEEM_OFFER, userAuth, redeemOfferService);

// Starting the Rest-Service Based on the security configuration
restService.listen(process.env.REST_SERVICE_PORT, process.env.HOST || '0.0.0.0');
consoleLogger.info(messages.REST_SERVICE_RUNNING_MESSAGE + process.env.REST_SERVICE_HOST + ":" + process.env.REST_SERVICE_PORT);