
const mongoose = require('mongoose');

const TopicSchema = mongoose.Schema({

    topic : {
        type: String,
        // required : true
    },
    subTopics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubTopic',
        // required: true
    }]

})

const Topic = mongoose.model('Topics', TopicSchema);
module.exports = Topic;








