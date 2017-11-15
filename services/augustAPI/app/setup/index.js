const mongoose = require('mongoose');

require('@augustModels/user');
require('@augustModels/manager');
require('@augustModels/contact');
require('@augustModels/lead');
require('@augustModels/status');

module.exports = {
    User:    mongoose.model('User'),
    Manager: mongoose.model('Manager'),
    Contact: mongoose.model('Contact'),
    Lead:    mongoose.model('Lead'),
    Status:  mongoose.model('Status')
}