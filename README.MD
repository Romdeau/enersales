#Enersales v0.1.0
##Node API with Express, frontend with Angular 1.3.15
###Probably terrible learning project, I'm still figuring this angualar thing out.

##Getting Started
Install npm requirements
>npm install

Install bower requirements
>bower install

Then copy the config.js.example as config.js and set the required fields.
After that just run
>node server.js

and you should be in business.

##Obvious Security Problems
I'm using unauthenticated routes for email, if your API is internet accessible it can be used to spam people which is bad as you're essentially an open relay.

I'm using a super accounts system from a tutorial, it really should be using something that is actively maintained like Passport.JS
