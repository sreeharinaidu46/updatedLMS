const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/auth")
const Issue = require("../models/issue");
const Book = require("../models/book");
const Datatime = require("../models/Datatime");
const moment = require("moment");





router.post("/issueRequest", async(req, res) => {


        const { accession_no, title, author, publisher, year, userId, bookId, userBranch, userName, isRecom, copies } = req.body;


        console.log("hello");
        console.log(bookId);
        const Modbook = await Book.findOne({ _id: bookId })
        Modbook.copies -= 1;
        await Modbook.save();

        const book = await new Issue({
            accession_no,
            title,
            author,
            publisher,
            year,
            userId,
            bookId,
            userBranch,
            userName,
            isRecom,
            copies
        })
        await book.save();
        // console.log("book",book)
        // book.save().then(result => {
        //     res.status(201).json({
        //         message: "Done upload!",

        //     })
        // }).catch(err => {
        //     console.log(err),
        //         res.status(500).json({
        //             error: err
        //         });
        // })

    })
    //newly
router.get("/getList", (req, res) => {
    Datatime.find()
        .then((lists) => {
            res.json(lists);
        })
        .catch((err) => {
            console.log(err);
        });

})

router.get("/issuedBook", requireLogin, (req, res) => {
    console.log("rjnbtgrj");
    Issue.find({ userId: req.user._id })
        .then((admins) => {
            res.json(admins);
        })
        .catch((err) => {
            console.log(err);
        });
})

router.get("/allIssuedBook", (req, res) => {

    Issue.find()
        .then((admins) => {
            res.json(admins);
        })
        .catch((err) => {
            console.log(err);
        });
})


router.get("/allIssueRequest", (req, res) => {

    Issue.find()
        .then(admins => {
            res.json(admins);
        })
        .catch((err) => {
            console.log(err);
        });
})


router.post("/issuedBookDelete", async(req, res) => {



    const { postId } = req.body;

    try {
        //await Issue.findOneAndDelete({ bookId: req.body.postId });
        const book = await Issue.findOne({ bookId: postId });
        // const date=await Date.findOne({issuedAt:book.issuedAt.slice(0,10)});
        // if(date)

        book.isRecom = true;
        await book.save();
        res.send("you successfully return the book")

    } catch (error) {
        console.log(error);
    }


})

router.put("/issueRenewedByAdmin", async(req, res) => {
    try {
        const date = new Date();
        const issue = await Issue.findOne({ bookId: req.body.bookId, userId: req.body.userId });
        issue.createdAt = date;
        issue.return_Count += 1;
        await issue.save();
    } catch (error) {
        console.log(error.message)
    }

})



router.post("/issuedReqAccept", async(req, res) => {
    // const date=await Date.find({});
    // if(date==null){


    // }

    const { bookId, postId } = req.body;

    try {
        const issue = await Issue.findOne({ _id: bookId })
        const book = await Book.findOne({ _id: postId })
        const data = await Datatime.findOne({ date: moment(issue.createdAt).format("YYYY-MM-DD") });
        console.log("hari");
        console.log(data);
        if (data == null) {
            const datas = Datatime({
                date: moment(issue.createdAt).format("YYYY-MM-DD"),
                issued: 1,
                returned: 0
            });
            datas.save();
        } else {
            console.log(data.issued);
            data.issued += 1;
            data.save();
        }

        // book.copies -= 1;
        // book.copies += 1;
        await book.save();
        issue.isIssue = true
        await issue.save()
        res.send('issue Delivered Successfully')
    } catch (error) {

        return res.status(400).json({ message: error });

    }

});

router.post("/issueReqDelete", async(req, res) => {

    try {
        const issue = await Issue.findOne({ _id: req.body.postId });
        // const date = await Datetime.findOne({ date: issue.issuedAt.slice(0, 10) });
        // if (date != null) {
        //     date.returned += 1;
        //     await date.save()
        // } else {
        //     const dates = new Datetime({
        //         date: issue.issuedAt.slice(0, 10),
        //         issue: 1,
        //         returned: 1
        //     });
        //     await dates.save();
        // }
        // const date=await 
        if (issue) {
            if (req.body.key) {
                const data = await Datatime.findOne({ date: moment(issue.createdAt).format("YYYY-MM-DD") });
                if (data == null) {
                    const datas = {
                        date: moment(issue.createdAt).format("YYYY-MM-DD"),
                        issued: 0,
                        returned: 1,
                    }
                    datas.save();
                } else {
                    data.returned += 1;
                    data.save();
                }

            }


        }
        // const data = await Datatime.findOne({ date: moment(issue.createdAt).format("YYYY-MM-DD") });
        // if (data == null) {
        //     const datas = {
        //         date: moment(issue.createdAt).format("YYYY-MM-DD"),
        //         issued: 0,
        //         returned: 1,
        //     }
        //     datas.save();
        // } else {
        //     data.returned += 1;
        //     data.save();
        // }
        const book = await Book.findOne({ _id: req.body.bookId })

        console.log(book);
        if (issue) {
            book.copies += 1;
            book.save();

        }
        await Issue.findOneAndDelete({ _id: req.body.postId });



        res.send("you successfully return the book")

    } catch (error) {
        console.log(error);
    }


})

router.post("/issueReturnedAdmin", async(req, res) => {
    try {
        await Issue.findOneAndDelete({ bookId: req.body.bookId, userId: req.body.userId });
        const book = await Book.findOne({ _id: req.body.bookId })
        book.copies += 1;
        await book.save()
    } catch (error) {
        console.log(error.message);
    }
})




router.post("/issuedBook", async(req, res) => {

    const postId = req.body.postId
    try {
        const book = await Book.findOne({ _id: postId })
        console.log(book)
        book.isIssue = true
        await book.save()
        res.send('book issued Successfully')
    } catch (error) {

        return res.status(400).json({ message: error });

    }

});

router.post("/singleIssuedBook", async(req, res) => {

    const postId = req.body.postId

    try {
        const book = await Book.findOne({ _id: postId });

        console.log(book);
        res.json(book)

    } catch (error) {

        return res.status(400).json({ message: error });

    }

});



module.exports = router;