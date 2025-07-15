const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    name : { type : String, required : true },
    type : { type : String, required : true },
    ip : { type : String, required : true },
    location : { type : String, required : true },
    status : {
        type : String,
        enum : [ 'active', 'error', 'inactive' ],
        default : 'inactive'
    }
},
    {
        timestamps : true
    });

module.exports = mongoose.model('Device', deviceSchema);
