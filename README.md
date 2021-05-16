# Description

This project is meant to provide JWT authentication with Refresh and Access tokens. Adequate information shall be provided once it is fully implemented.

## Why Refresh and Access Token instead of old cookie sessions?
They scale better in microservices, as the Token based authentication is stateless and does not need to be stored in a centralized database.

## How do we achieve XSS protection?
The Refresh Token is meant to be stored in the User Agent as an `httpOnly` cookie, thus cannot -by any means- be accessed via JavaScript.

## How do we achieve CSRF mitigation?
- The Access Token is stored in memory and cannot be accessed from the malicious site.
- Setting the cookie's attribute [SameSite](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-cookie-same-site-00#section-5.2) to `Strict` prevents the Refresh Token from being used as a third-party cookie.


# Flow

![backend-auth (2)](https://user-images.githubusercontent.com/22287199/118382855-2280fa80-b602-11eb-9f2b-4231b9fad06a.jpg)


## Auth Server
When the user requests to login, a Refresh Token will be sent as an `httpOnly` cookie (with a very long `maxAge`) which will be _safely_ stored in the User Agent and a payload which will consist of a short lived (15 minutes) Access Token (as `jwt`) and its `expiry date` (as `jwtExpiryDate`).

![authorized-calls](https://user-images.githubusercontent.com/22287199/118382832-d33aca00-b601-11eb-8eba-e1e39c6422e8.jpg)

You must have noticed in the flow chart above that there is a step where it is checked whether a Refresh Token is `denylisted`. We mentioned above that the JWTs are stateless and the only means to be invalidated is when it is expired. So, we are going to use a database to store all these tokens in order to invalidate them.

## Client
_In progress_


# Goals
- [x] Refresh and Access Token authentication
- [x] XSS protection
- [x] CSRF mitigation
- [x] DB agnostic integration
- [x] Logger Middleware
- [x] TypeScript ready 🚀

# TODO
- [x] Logout functionality
- [ ] Adequate documentation

# Improvements
- [ ] Proper Error handling responses on jwt verification checks
