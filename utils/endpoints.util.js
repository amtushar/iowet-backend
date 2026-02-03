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


    // admin endpoints
    // endpoints for different groups
    static ENDPOINT_GROUP_USER_LOGIN = "/1.0.0/userslogin"
    static ENDPOINT_GROUP_USER_NEWPASSWORD = "/1.0.0/usersnewpassword"
    static ENDPOINT_GROUP_USER_VERIFICATION = "/1.0.0/usersverification"
    static ENDPOINT_GROUP_USER = "/1.0.0/users"
    static ENDPOINT_GROUP_COURSE = "/1.0.0/courses"
    static ENDPOINT_GROUP_USER_PROFILE = "/1.0.0/userprofile"
    static ENDPOINT_GROUP_VENUE = "/1.0.0/venues"
    static ENDPOINT_GROUP_FACILITY = "/1.0.0/facilities"
  

    // endpoints for different versions
    static ENDPOINT_API_VERSION = "/v1"
    static ENDPOINT_API_VERSION_2 = "/v2"
    static ENDPOINT_API_VERSION_3 = "/v3"
    static ENDPOINT_API_VERSION_4 = "/v4"


    // endpoints for user-verification group
    static ENDPOINT_USER_VERIFICATION_CHECK = "/userverificationcheck" // isVerified
    static ENDPOINT_USER_VERIFICATION_UPDATE = "/userverificationupdate" // isVerified

    // endpoints for coursegroup
    static ENDPOINT_COURSE = "/course" //creating one or multiple object
    static ENDPOINT_READ_COURSES = "/courses"  //reading multiple objects
    static ENDPOINT_UPDATE_COURSE = "/updatecourse"  //reading multiple objects


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


}
