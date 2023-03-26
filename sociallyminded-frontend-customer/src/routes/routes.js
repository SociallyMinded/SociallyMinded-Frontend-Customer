
const ABSOLUTE_PATH = "http://localhost:8080/SociallyMinded-war/webresources"
const ABSOLUTE_FRONTEND_PATH = "http://localhost:3000/"

export const getAllCustomersUrl = `${ABSOLUTE_PATH}/entity.customer`
export const handleLoginViaGmail = `${ABSOLUTE_PATH}/entity.customer/loginViaGmail/`
export const getAllProductsUrl = `${ABSOLUTE_PATH}/entity.product/`
export const createNewOrderUrl = `${ABSOLUTE_PATH}/entity.orderrecord`
export const createNewReviewUrl = `${ABSOLUTE_PATH}/entity.review`

// Add product Id after the last "/" 
export const getAllReviewsByProductIdUrl = `${ABSOLUTE_PATH}/entity.review/findReviewsByProductId/`
export const getProductByIdUrl = `${ABSOLUTE_PATH}/entity.product/`
// Add customer firebase uid after the last "/" 
export const getOrdersByCustomer = `${ABSOLUTE_PATH}/entity.orderrecord/findOrderRecordsByCustomerId/`

// //testing the add review page
// export const addReviewByProductIdUrl = "/addReview"


export const ABSOLUTE_HOME_LINK = ABSOLUTE_FRONTEND_PATH
export const HOME_LINK = "/"
export const SIGNUP_PAGE_LINK = "/signup"
export const LOGIN_PAGE_LINK = "/login"
export const RESET_PASSWORD_LINK = "/reset_pw"
export const SHOP_LINK = "/shop"
export const PROFILE_PAGE_LINK = "/profile"
export const LOGIN_SIGNUP_REDIRECT_LINK = "/shop"


