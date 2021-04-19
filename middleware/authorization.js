const showModel = require("../models/Show");

const dashBoardLoader = (req, res) => {
    const user = req.session.userInfo;
    if(user.type == "Admin") {
        res.render("User/adminDashboard", {
            admin: user,
            title: "Admin Dashboard"
        });
    }
    else {//for normal users
        showModel.find({featured:"true"})
        .then((shows) => {
            const recommendShows = shows.map(show => {
                return {
                    id: show._id,
                    showTitle: show.showTitle,
                    imageS: show.imageS,
                }
            });
            res.render("User/userDashboard", {
                user: user,
                title: "My page",
                data: recommendShows
            });
        })
        .catch(err => {
            console.log(`Error happened when listing in the database: ${err}`);
            res.render("index");
        });
    }
}
module.exports = dashBoardLoader;