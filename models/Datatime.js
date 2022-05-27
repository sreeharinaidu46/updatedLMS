const mongoose = require("mongoose");

const dateSchema = new mongoose.Schema({


    date: {
        type: String
    },
    issued: {
        type: Number,
        default: 0
    },
    returned: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("Datatime", dateSchema);