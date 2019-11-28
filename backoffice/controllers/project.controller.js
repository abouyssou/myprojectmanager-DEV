const mongoose = require('mongoose');
require('../models/project');
require('../models/user');

const Project = mongoose.model('Project');
const User = mongoose.model('User');

module.exports.getAllProjects = (req, res) => {
    Project.find({})
        .populate('issues')
        .populate('creator')
        .populate('tasks')
        .populate('sprints')
        .populate('tests')
        .populate('releases')
        .populate('documentations')
        .populate('contributors')
        .exec(function (err, projects) {
            if (err) res.json({ error: 'error' });
            res.json({ result: projects, idlogged: req._id });
        });
};

module.exports.getProjectDetails = (req, res) => {
    Project.findOne({ _id: req.params.id })
        .populate('creator')
        .populate('contributors')
        .exec(function (err, project) {
            if (err) res.json({ error: 'error' });
            res.json({ project: project });
        });

};

module.exports.insertProject = (req, res) => {
    User.findOne({ _id: req._id }, (err, user) => {
        if (!user) res.status(404).json({ status: false, message: 'Utilisateur non trouvé' });
        else {
            const project = new Project();
            project.title = req.body.title;
            project.description = req.body.description;
            project.status = req.body.status;
            project.creator = user;
            project.save(function (err) {
                if (!err)
                    res.send(project);
            });
        }
    });
};
module.exports.editProject = (req, res) => {
    Project.findOne({ _id: req.params.id }, (err, project) => {
        if (!project) res.status(404).json({ status: false, message: 'Projet non trouvé' });
        else {
            project.title = req.body.title;
            project.description = req.body.description;
            project.status = req.body.status;
            project.save(function (err) {
                if (!err)
                    res.send({ success: 'Updated with success' });
            });
        }
    });
};

module.exports.deleteProject = (req, res,) => {
    Project.deleteOne({ _id: req.params.id }, function (err) {
        if (err) res.json(err);
        res.json({ success: 'deleted with success' });
    });
};
