const mongoose = require('mongoose');
const snapshotSchema = new mongoose.Schema({
    data:{
        type:Object,
        required:true
    },
    date:{
        type: Date,
        default: new Date()
    }
})
module.exports = mongoose.model('snapshot', snapshotSchema);