const mongoose = require('mongoose');

const SubTopicSchema = new mongoose.Schema({
    subTopic : {
        type: String,
        // required: true,
    },
    topicId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topics',
        // required: true
    }
});

const SubTopic = mongoose.model('SubTopic', SubTopicSchema);
module.exports = SubTopic;
