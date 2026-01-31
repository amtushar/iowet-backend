/**
@CreatedBy    : Dhingra
@CreatedTime  : August 27 2024
@ModifiedBy   : Dhingra
@ModifiedTime : August 27 2024
@Description  : This file is contains all the endpoints for rest service
**/

module.exports = class endpoints {

    // base url for admin portal
    static ENDPOINT_BASE_URL = "/api/rest/marhabba"

    // base url for client lead generation site
    static ENDPOINT_CUSTOMER_CLIENT_BASE_URL = "/api/rest/marhabba/customer-client"

    // base url for mobile application
    static ENDPOINT_CUSTOMER_MOBILE_BASE_URL = "/api/rest/marhabba/customer-mobile"

    // base app service url and send otp
    static BASE_URL_APPSERVICE = "https://uatbenefitplus.com"
    static ENDPOINT_SEND_OTP = "/applayer/marhabba/sms/sendmessage"

    // admin endpoints
    // endpoints for different groups
    static ENDPOINT_GROUP_USER_LOGIN = "/1.0.0/userslogin"
    static ENDPOINT_GROUP_USER_NEWPASSWORD = "/1.0.0/usersnewpassword"
    static ENDPOINT_GROUP_USER_VERIFICATION = "/1.0.0/usersverification"
    static ENDPOINT_GROUP_USER = "/1.0.0/users"
    static ENDPOINT_GROUP_USER_PROFILE = "/1.0.0/userprofile"
    static ENDPOINT_GROUP_VENUE = "/1.0.0/venues"
    static ENDPOINT_GROUP_FACILITY = "/1.0.0/facilities"
    static ENDPOINT_GROUP_SUBSCRIPTION = "/1.0.0/subscription"
    static ENDPOINT_GROUP_CLASS = "/1.0.0/class"
    static ENDPOINT_GROUP_FACILITY_TYPE = "/1.0.0/facilitytype"
    static ENDPOINT_GROUP_CLASS_TYPE = "/1.0.0/classtype"
    static ENDPOINT_GROUP_FEATURE = "/1.0.0/feature"
    static ENDPOINT_GROUP_COUNTRY = "/1.0.0/country"
    static ENDPOINT_GROUP_BOOKING = "/1.0.0/booking"
    static ENDPOINT_GROUP_VOUCHER = "/1.0.0/voucher"
    static ENDPOINT_GROUP_PURCHASED_VOUCHER = "/1.0.0/purchasedvoucher"
    static ENDPOINT_GROUP_OFFER = "/1.0.0/offer"
    static ENDPOINT_GROUP_REDEEM_OFFER = "/1.0.0/redeemoffer"



    // endpoints for different versions
    static ENDPOINT_API_VERSION = "/v1"
    static ENDPOINT_API_VERSION_2 = "/v2"
    static ENDPOINT_API_VERSION_3 = "/v3"
    static ENDPOINT_API_VERSION_4 = "/v4"


    // endpoints for user-verification group
    static ENDPOINT_USER_VERIFICATION_CHECK = "/userverificationcheck" // isVerified
    static ENDPOINT_USER_VERIFICATION_UPDATE = "/userverificationupdate" // isVerified


    // endpoints for usergroup
    static ENDPOINT_USER = "/user" //creating one or multiple object
    static ENDPOINT_USERS = "/users"  //reading multiple objects
    static ENDPOINT_USERCHECK = "/usercheck"
    static ENDPOINT_USERS_LOGIN = "/users/login"  // for user login
    static ENDPOINT_USERS_LOGIN_TOKEN = "/users/logintoken"  // for user login
    static ENDPOINT_USERS_LOGOUT = "/users/logout"  // for user login
    static ENDPOINT_USER_NEWPASSWORD = "/users/newpassword"  // for user password update
    static ENDPOINT_ONE_USER = "/user/:id" // reading one object using id

    // endpoints for logged in user
    static ENDPOINT_CURRENT_USER = "/currentuser"  //for recapturing user

    // endpoints for venuegroup
    static ENDPOINT_VENUE = "/venue" //creating one or multiple object
    static ENDPOINT_VENUES = "/venues"  //reading multiple objects
    static ENDPOINT_VENUE_NAME = "/venuename"  //reading one venue name by venue id
    static ENDPOINT_VENUES_ACCESS = "/venueaccess"  //reading multiple objects
    static ENDPOINT_VENUES_EXISTING_FILTER = "/venuefilter"  //reading multiple objects
    static ENDPOINT_VENUECHECK = "/venuecheck"
    static ENDPOINT_ONE_VENUE = "/venue/:id" // reading one object using id
    static ENDPOINT_VENUE_SEARCH = "/venuesearch"  //reading multiple venues with query


    // endpoints for venueArenagroup
    static ENDPOINT_FACILITY = "/facility" //creating one or multiple object
    static ENDPOINT_FACILITIES = "/facilities"  //reading multiple objects
    static ENDPOINT_ONE_FACILITY = "/facility/:id" // reading one object using id
    static ENDPOINT_VENUE_FACILITY_SEARCH = "/facilitysearch"  //reading multiple venues with query
    static ENDPOINT_VENUE_FACILITY_CLASS_SEARCH = "/facilityclasssearch"  //reading multiple venues with query
    static ENDPOINT_VENUE_FACILITIES = "/venuefacilities"  //reading facilties of a particular venue
    static ENDPOINT_FACILITY_CHECK = "/facilitycheck"

    // endpoints for subscriptionplan
    static ENDPOINT_SUBSCRIPTION_PLAN = "/subscriptionplan" //creating one or multiple object
    static ENDPOINT_SUBSCRIPTION_PLANS = "/subscriptionplans"  //reading multiple objects
    static ENDPOINT_ONE_SUBSCRIPTION = "/subscriptionplan/:id" // reading one object using id


    // endpoints for classes
    static ENDPOINT_CLASS = "/class" //creating one or multiple object
    static ENDPOINT_CLASSES = "/classes"  //reading multiple objects
    static ENDPOINT_VENUE_CLASSES = "/venueclasses"  //reading multiple objects
    static ENDPOINT_ONE_CLASS = "/class/:id" // reading one object using id
    static ENDPOINT_SESSIONSLOTS = "/sessionslots" // reading one object
    static ENDPOINT_CLASS_LIMIT = "/class/:id/limit";// Updates the free class limit  for a specific class by classID



    // endpoints for facility type
    static ENDPOINT_FACILITY_TYPE = "/facilitytype" //creating one or multiple object
    static ENDPOINT_FACILITY_TYPES = "/facilitytypes"  //reading multiple objects
    static ENDPOINT_ONE_FACILITY_TYPE = "/facilitytype/:id" // reading one object using id


    // endpoints for class types
    static ENDPOINT_CLASS_TYPE = "/classtype" // creating one or multiple objects
    static ENDPOINT_CLASS_TYPES = "/classtypes" // reading multiple objects
    static ENDPOINT_FEATURE = "/feature" // creating one or multiple objects
    static ENDPOINT_FEATURES = "/features"  // reading multiple objects

    // endpoints for countries
    static ENDPOINT_ADD_COUNTRY = "/addcountry" // creating one or multiple objects
    static ENDPOINT_READ_COUNTRIES = "/readcountries"  // reading multiple objects

    // endpoints for bookings
    static ENDPOINT_READ_BOOKINGS = "/bookings"
    static ENDPOINT_VERIFY_BOOKING_CODE = "/bookings/verify-code";
    static ENDPOINT_MODIFY_BOOKING_STATUS = "/modifybookingstatus"

    // endpoints for vouchers
    static ENDPOINT_CREATE_VOUCHER = "/createvoucher"
    static ENDPOINT_READ_VOUCHERS = "/readvouchers"
    static ENDPOINT_MODIFY_VOUCHER_IMAGE = "/voucherimage"
    static ENDPOINT_MODIFY_VOUCHER_TITLE = "/modifyvouchertitle"
    static ENDPOINT_MODIFY_VOUCHER = "/modifyvoucher"
    static ENDPOINT_DELETE_VOUCHER = "/deletevoucher"
    // endpoints for offers
    static ENDPOINT_CREATE_OFFER = "/createoffer"
    static ENDPOINT_READ_OFFERS = "/readoffers"
    static ENDPOINT_MODIFY_OFFER = "/modifyoffer"
    static ENDPOINT_DELETE_OFFER = "/deleteoffer"
    static ENDPOINT_MODIFY_OFFER_TITLE = "/modifyoffertitle"


    // endpoints for customer vouchers
    static ENDPOINT_READ_CUSTOMER_VOUCHERS = "/readcustomervouchers"
    static ENDPOINT_VERIFY_VOUCHER_CODE = "/vouchers/verify-code"

    // endpoints for customer offers
    static ENDPOINT_READ_CUSTOMER_OFFERS = "/readcustomeroffers"
    static ENDPOINT_VERIFY_OFFER_CODE = "/offers/verify-code"

    // lead generation endpoints 

    // groups
    static ENDPOINT_GROUP_LEAD_COUNTRY = "/1.0.0/leadcountry"
    static ENDPOINT_GROUP_LEAD_VENUE = "/1.0.0/leadvenues"
    static ENDPOINT_GROUP_LEAD_SUBSCRIPTIONS = "/1.0.0/leadsubscriptions"
    static ENDPOINT_GROUP_LEAD_FACILITIES = "/1.0.0/leadfacilities"
    static ENDPOINT_GROUP_LEAD_FACILITY_TYPE = "/1.0.0/leadfacilitytype"
    static ENDPOINT_GROUP_LEAD_CLASSES = "/1.0.0/leadclasses"
    static ENDPOINT_GROUP_LEAD_REGISTRATION = "/1.0.0/leadregistration"

    // endpoints for lead countrygroup
    static ENDPOINT_LEAD_READ_COUNTRIES = "/leadcountries"


    // endpoints for lead venuegroup
    static ENDPOINT_LEAD_VENUES = "/leadvenues"  //reading multiple objects
    static ENDPOINT_LEAD_VENUE_FACILITIES = "/leadvenuefacilities"  //reading multiple objects
    static ENDPOINT_LEAD_VENUE_SECTION = "/leadvenuesection"  //reading multiple objects in section by pagination
    static ENDPOINT_LEAD_VENUE_FACILITY = "/leadvenuefacility" //read muliple objects



    // endpoints for lead classgroup
    static ENDPOINT_LEAD_VENUE_CLASSES = "/leadvenueclasses"  //reading multiple objects

    // endpoints for lead subscriptiongroup
    static ENDPOINT_LEAD_SUBSCRIPTIONS = "/leadsubscriptions"  //reading multiple objects

    // endpoints for lead facilitytypesgroup
    static ENDPOINT_LEAD_FACILITY_TYPES = "/leadfacilitytypes"  //reading multiple objects

    // endpoints for lead subscription plans
    static ENDPOINT_LEAD_SUBSCRIBE_PLANS = "/subscribeplans"  //reading multiple objects

    // endpoints for lead customerRegistration
    static ENDPOINT_LEAD_REGISTRATION = "/subscribe"  //creating one or multiple objects

    // endpoints for lead contactgroup
    static ENDPOINT_LEAD_READ_CONTACT = '/leadcontact' //reading multiple objects

    // mobile application endpoints

    //groups
    static ENDPOINT_GROUP_CUSTOMER = "/1.0.0/customer"
    static ENDPOINT_GROUP_CUSTOMER_PROFILE = "/1.0.0/customerprofile"
    static ENDPOINT_GROUP_CUSTOMER_VENUE = "/1.0.0/customervenues"
    static ENDPOINT_GROUP_CUSTOMER_FACILITIES = "/1.0.0/customerfacilities"
    static ENDPOINT_GROUP_CUSTOMER_FACILITY_TYPE = "/1.0.0/customerfacilitytype"
    static ENDPOINT_GROUP_CUSTOMER_CLASS_TYPE = "/1.0.0/customerclasstype"
    static ENDPOINT_GROUP_CUSTOMER_REGISTRATION = "/1.0.0/customerregistration"
    static ENDPOINT_GROUP_CUSTOMER_SUBSCRIPTIONS = "/1.0.0/customersubscription"
    static ENDPOINT_GROUP_CUSTOMER_SUBSCRIPTION_HISTORY = "/1.0.0/customersubscriptionhistory"
    static ENDPOINT_GROUP_CUSTOMER_BOOKING = "/1.0.0/customerbooking"
    static ENDPOINT_GROUP_CUSTOMER_SESSIONS = "/1.0.0/classsessions"
    static ENDPOINT_GROUP_CUSTOMER_CHECKIN = "/1.0.0/customercheckin"
    static ENDPOINT_GROUP_CUSTOMER_PAYMENT = "/1.0.0/customerpayment"
    static ENDPOINT_GROUP_CUSTOMER_VOUCHER = "/1.0.0/customervoucher"
    static ENDPOINT_GROUP_CUSTOMER_PURCHASED_VOUCHER = "/1.0.0/customerpurchasedvoucher"
    static ENDPOINT_GROUP_CUSTOMER_OFFERS = "/1.0.0/customeroffers"


    // endpoints for customergroup
    static ENDPOINT_CUSTOMER = "/customer" //creating one or multiple object
    static ENDPOINT_CUSTOMER_GET_OTP = "/customergetotp" //creating one or multiple object
    static ENDPOINT_CUSTOMERS = "/customers"  //reading multiple objects
    static ENDPOINT_CUSTOMERCHECK = "/customercheck"
    static ENDPOINT_CUSTOMERS_LOGIN = "/customers/login"  // for customer login
    static ENDPOINT_ONE_CUSTOMER = "/customer/:id" // reading one object using id

    // endpoints for logged in customer
    static ENDPOINT_CURRENT_CUSTOMER = "/currentcustomer"  //for recapturing customer

    // endpoints for mobile venuegroup
    static ENDPOINT_CUSTOMER_VENUE_SEARCH = "/customervenuesearch"  //home venue search
    static ENDPOINT_CUSTOMER_VENUES = "/customervenues"  //reading multiple objects
    static ENDPOINT_CUSTOMER_VENUES_HOME = "/customervenueshome"  //reading multiple objects
    static ENDPOINT_CUSTOMER_VENUE_FACILITIES = "/customervenuefacilities"  //reading multiple objects
    static ENDPOINT_CUSTOMER_VENUE_FACILITY = "/customervenuefacility" //read muliple objects
    static ENDPOINT_CUSTOMER_VENUE_NAMES = "/customervenuenames"  //reading multiple objects


    //end point for latest 5 venues added
    static ENDPOINT_CUSTOMER_VENUES_LATEST = "/customervenueslatest"; // get latest 5 added venues


    // endpoints for subscriptionplan
    static ENDPOINT_CUSTOMER_SUBSCRIPTION_PLANS = "/customersubscriptionplans"  //reading multiple objects


    // endpoints for mobile facilitytypesgroup
    static ENDPOINT_CUSTOMER_FACILITY_TYPES = "/customerfacilitytypes"  //reading multiple objects


    // endpoints for mobile classtypesgroup
    static ENDPOINT_CUSTOMER_CLASS_TYPES = "/customerclasstypes"  //reading multiple objects

    // endpoints for mobile CheckIn group
    static ENDPOINT_CUSTOMER_CHECKIN_VERIFY_OTP = "/verifyotp"


    // endpoints for mobile booking
    static ENDPOINT_CUSTOMER_CHECK_CLASS_BOOKING = "/checkclassbooking"
    static ENDPOINT_CUSTOMER_CHECK_FACILITY_BOOKING = "/checkfacilitybooking"
    static ENDPOINT_CUSTOMER_ADD_CLASS_BOOKING = "/addclassbooking"
    static ENDPOINT_CUSTOMER_ADD_FACILITY_BOOKING = "/addfacilitybooking"
    static ENDPOINT_CUSTOMER_GET_UPCOMING_BOOKINGS = "/upcomingbookings"
    static ENDPOINT_CUSTOMER_GET_HISTORY_BOOKINGS = "/historybookings"
    static ENDPOINT_CUSTOMER_GET_UPCOMING_FACILITY_BOOKINGS = "/upcomingfacilitybookings"
    static ENDPOINT_CUSTOMER_CHECK_FREE_CLASS_QUOTA = "/checkfreeclassquota"
    static ENDPOINT_GROUP_CUSTOMER_GET_FACILITY_BOOKING = "/getnumofbookings"

    // endpoints for subscribe plan
    static ENDPOINT_CUSTOMER_SUBSCRIBE = "/subscribe" //creating object
    static ENDPOINT_CUSTOMER_SUBSCRIBE_PLANS = "/subscribeplans" //reading multiple objects
    static ENDPOINT_CUSTOMER_UPGRADE_SUBSCRIPTION_PLAN = "/upgradesubscription"

    // endpoints for profile update
    static ENDPOINT_CUSTOMER_UPDATE_PROFILE = "/updateprofile" //creating object

    // endpoints for profilepic
    static ENDPOINT_ADD_PROFILEPIC = "/profilepic"
    static ENDPOINT_READ_PROFILEPIC = "/getprofilepic"

    // endpoints for mobile classes
    static ENDPOINT_CUSTOMER_READ_SESSIONS = '/getsessions' // reading multiple objects
    static ENDPOINT_CUSTOMER_READ_UPDATED_SESSION = '/getupdatedsession' // reading multiple objects
    static ENDPOINT_CUSTOMER_CHECK_SESSION_AVAILABILITY = '/checksessionavailability' // reading multiple objects

    // endpoints for subscriptionhistory
    static ENDPOINT_CUSTOMER_SUBSCRIPTION_HISTORY = "/customersubscriptionhistory"  //reading multiple objects

    // endpoints for customer
    static ENDPOINT_READ_REGISTERED_CUSTOMER = "/registeredcustomers"  //reading multiple objects

    // endpoints for customer payments
    static ENDPOINT_CUSTOMER_PAYMENT_CREATE = "/customerpaymentcreate"
    static ENDPOINT_CUSTOMER_PAYMENT_FINISH_URL = "/customerpaymentfinishurl" // api hit by Qicard after payment completion - here we can decide the page to move after payment
    static ENDPOINT_CUSTOMER_PAYMENT_NOTIFICATION_URL = "/customerpaymentnotificationurl" // webhook url api hit by Qicard we can decide to run the query ex - for updating payment status in the mongodb
    static ENDPOINT_CUSTOMER_PAYMENT_STATUS = "/customerpaymentstatus"
    static ENDPOINT_CUSTOMER_PAYMENT_REFUND = "/customerpaymentrefund"
    static ENDPOINT_CUSTOMER_PAYMENT_CANCEL = "/customerpaymentcancel"

    //  For available vouchers (voucher schema)
    static ENDPOINT_CUSTOMER_READ_VOUCHERS = "/getcustomervouchers"
    static ENDPOINT_CUSTOMER_VOUCHER_VALIDITY = "/checkvouchervalidity"
    static ENDPOINT_CUSTOMER_VOUCHER_SEARCH = "/searchvoucher"
    static ENDPOINT_CUSTOMER_CHECK_VOUCHER_AVAILABILITY = "/checkvoucheravailability"

    //  For purchased vouchers (customerVoucher schema)  
    static ENDPOINT_CUSTOMER_VOUCHER_PURCHASE = "/purchasevoucher"
    static ENDPOINT_CUSTOMER_PURCHASED_VOUCHERS = "/mypurchasedvouchers"
    static ENDPOINT_CUSTOMER_VOUCHER_UPDATE = "/updatevoucherstatus"
    static ENDPOINT_CUSTOMER_VOUCHER_HISTORY = "/voucherhistory"

    // endpoints for mobile offers
    static ENDPOINT_CUSTOMER_CHECK_REDEEM_OFFER = "/checkredeemoffer"
    static ENDPOINT_CUSTOMER_READ_OFFERS = "/getcustomeroffers"
    static ENDPOINT_CUSTOMER_OFFER_REDEEM = "/getcustomeroffer-redeem"
    static ENDPOINT_CUSTOMER_REDEEMED_OFFERS = '/myredeemedoffers'
    static ENDPOINT_CUSTOMER_READ_ALL_OFFERS = '/getalloffers'
    static ENDPOINT_CUSTOMER_OFFER_HISTORY = '/offerhistory'
    static ENDPOINT_CUSTOMER_OFFER_SEARCH = "/searchoffer"


}
