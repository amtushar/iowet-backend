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
    static ENDPOINT_GROUP_SUBJECT = "/1.0.0/subjects"
    static ENDPOINT_GROUP_STUDENT = "/1.0.0/students"
    static ENDPOINT_GROUP_RESULT = "/1.0.0/results"
    static ENDPOINT_GROUP_PUBLIC = "/1.0.0/public"
    static ENDPOINT_GROUP_USER_PROFILE = "/1.0.0/userprofile"
  

    // endpoints for different versions
    static ENDPOINT_API_VERSION = "/v1"
    static ENDPOINT_API_VERSION_2 = "/v2"
    static ENDPOINT_API_VERSION_3 = "/v3"
    static ENDPOINT_API_VERSION_4 = "/v4"


    // endpoints for user-verification group
    static ENDPOINT_USER_VERIFICATION_CHECK = "/userverificationcheck" // isVerified
    static ENDPOINT_USER_VERIFICATION_UPDATE = "/userverificationupdate" // isVerified

    static ENDPOINT_READ_PUBLIC_COURSES = "/publiccourses"  //reading multiple objects
    static ENDPOINT_READ_PUBLIC_RESULT = "/publicresult"  //reading multiple objects
    // endpoints for coursegroup
    static ENDPOINT_COURSE = "/course" //creating one or multiple object
    static ENDPOINT_UPDATE_COURSE = "/updatecourse" //creating one or multiple object
    static ENDPOINT_READ_COURSES = "/courses"  //reading multiple objects
    static ENDPOINT_READ_COURSE_NAMES = "/coursenames"  //reading multiple objects
    static ENDPOINT_UPDATE_COURSE = "/updatecourse"  //reading multiple objects

     // endpoints for subjectgroup
    static ENDPOINT_SUBJECT = "/subject" //creating one or multiple object
    static ENDPOINT_READ_SUBJECTS = "/subjects"  //reading multiple objects
    static ENDPOINT_READ_SUBJECT_BY_COURSE = "/subjectsbycourse"  //reading multiple objects
    static ENDPOINT_UPDATE_SUBJECT = "/updatesubject"  //reading multiple objects

     // endpoints for studentgroup
    static ENDPOINT_STUDENT = "/student" //creating one or multiple object
    static ENDPOINT_READ_STUDENTS = "/students"  //reading multiple objects
    static ENDPOINT_READ_STUDENT_BY_ROLL = "/studentbyroll"  //reading multiple objects
    static ENDPOINT_UPDATE_STUDENT = "/updatestudent"  //reading multiple objects

     // endpoints for resultgroup
    static ENDPOINT_RESULT = "/result" //creating one or multiple object
    static ENDPOINT_READ_RESULT_BY_ROLL = "/resultbyroll"  //reading multiple objects
    static ENDPOINT_UPDATE_RESULT = "/updateresult"  //reading multiple objects


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



}
