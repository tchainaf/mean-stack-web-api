var express = require('express');
var router = express.Router();
var questionService = require('services/question.service');

router.post('/', createQuestion);
router.get('/:_id', getCurrentQuestion);
router.get('/list/:userId', listQuestions);
router.put('/:_id', updateQuestion);
router.delete('/:_id', deleteQuestion);

module.exports = router;

function createQuestion(req, res) {
    questionService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrentQuestion(req, res) {
    questionService.getById(req.params._id)
        .then(function (question) {
            if (question) {
                res.send(question);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function listQuestions(req, res) {
    questionService.getList(req.params.userId)
        .then(function (questions) {
            if (questions) {
                res.send(questions);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateQuestion(req, res) {
    questionService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteQuestion(req, res) {
    questionService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}