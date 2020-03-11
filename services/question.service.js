var config = require('config.json');
var _ = require('lodash');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('questions');

var service = {};

service.getById = getById;
service.getList = getList;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function getById(_id) {
    var deferred = Q.defer();

    db.questions.findById(_id, function (err, question) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve();
    });

    return deferred.promise;
}

function getList(username) {
    var deferred = Q.defer();

    db.questions.find({ username: username }, function (err, question) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve();
    });

    return deferred.promise;
}

function create(questionParam) {
    var deferred = Q.defer();

    // validation
    db.questions.findOne(
        { question: questionParam.question },
        function (err, question) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (question) {
                deferred.reject('Question "' + questionParam.question + '" is already taken');
            } else {
                db.questions.insert(
                    questionParam,
                    function (err, doc) {
                        if (err) deferred.reject(err.name + ': ' + err.message);

                        deferred.resolve();
                    });
            }
        });
    return deferred.promise;
}

function update(_id, questionParam) {
    var deferred = Q.defer();

    // validation
    db.questions.findById(_id, function (err, question) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (questionParam.question !== question.question) {
            // username has changed so check if the new username is already taken
            db.questions.findOne(
                { question: questionParam.question },
                function (err, question) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (question) {
                        // username already exists
                        deferred.reject('Question "' + req.body.question + '" is already taken')
                    } else {
                        updateQuestion();
                    }
                });
        } else {
            updateQuestion();
        }
    });

    function updateQuestion() {
        // fields to update
        var set = {
            question: questionParam.question,
            username: questionParam.username,
        };

        db.questions.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.questions.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}