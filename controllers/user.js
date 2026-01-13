const User = require('../models/user');

async function handleUserSignup(req,res){
    const {name,email,password} = req.body;
    await User.create({
        name,
        email,
        password,
    });
    return res.redirect("/");
};
// async function handleUserLogin(req,res){
//     const {email,password} = req.body;
//     const user = await User.findOne({email,password});
//     console.log("User",user);
//     if(!user)
//          return res.render("login",{
//         error : "invalid username or password",
//         })
//     return res.redirect("/");
// };
async function handleUserLogin(req, res) {
    console.log("LOGIN ROUTE HIT");
    const { email, password } = req.body;
    console.log(email, password);

    const user = await User.findOne({ email, password });
    console.log("User", user);

    if (!user) {
        return res.render("login", {
            error: "invalid username or password",
        });
    }

    return res.redirect("/");
}
module.exports = {
    handleUserSignup,
    handleUserLogin
}