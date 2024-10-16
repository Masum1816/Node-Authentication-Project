
const Topic = require('../Models/TopicSchema');
const SubTopic = require('../Models/SubTopicSchema');

const DefaultTopicController = async (req, res) => {

    console.log("DEFAULT TOPIC CONTROLLER");
    const topics = await Topic.find().populate('subTopics');
    res.render('viewTopic', {topics});

}

const AddTopicController = (req, res) => {

    console.log("ADD TOPIC CONTROLLER");
    res.render('addTopic');

}

const AddTopicFormController = async (req, res) => {

    console.log("ADD TOPIC FORM CONTROLLER");
    const topic = req.body.topic;

    const AddTopic = new Topic({
        topic
    });

    await AddTopic.save();
    res.redirect('/topic');

}

const AddSubTopicController = async (req, res) => {

    console.log("ADD SUBTOPIC CONTROLLER");

    const topics = await Topic.find();
    console.log("TOPIC : ", topics);

    res.render('addSubTopic', { topics });

}

const AddSubTopicFormController = async (req, res) => {

    console.log("ADD SUBTOPIC FORM CONTROLLER");
    const subTopic = req.body.subTopic;
    const topicId = req.body.topicId;

    const AddSubTopic = new SubTopic({
        subTopic,
        topicId
    });

    await AddSubTopic.save();

    await Topic.findByIdAndUpdate(topicId, {
        $push: { subTopics: AddSubTopic._id }
    });

    res.redirect('/topic');

}

module.exports = { DefaultTopicController, AddTopicController, AddTopicFormController, AddSubTopicController, AddSubTopicFormController };








