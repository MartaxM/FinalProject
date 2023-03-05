const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const { authenticate } = require('passport')

/**
 * 
 * @param {*} passport 
 * @param {*} getUserByUsername function to find user by Username
 * @param {*} getUserById function to find user by _id
 * 
 * passport configuration
 */
function initialize(passport, getUserByUsername, getUserById) {
    const authenticateUser = async(username, password, done)=>{
        const user = await getUserByUsername(username)
        // if user not found, return false
        if(user == null){
            console.log("User not found")
            return done(null,false)
        }

        //if user exist, compare hashed pasword with given password
        try{
            if(await bcrypt.compare(password, user.password)){
                console.log("user: " + user.username + " logged in!")
                return done(null,user)
            }else{
                console.log("Password incorrect")
                return done(null, false)
            }

        }catch(e){
            return done(e)
        }
    }
    passport.use(new LocalStrategy(authenticateUser))
    passport.serializeUser((user,done)=>done(null, user._id))
    passport.deserializeUser(async (id,done)=> {
        return done(null, await getUserById(id))
    })
}

module.exports = initialize