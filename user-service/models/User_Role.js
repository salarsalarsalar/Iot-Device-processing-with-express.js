const mongoose = require('mongoose');

const UserRoleSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    }
}, {
    timestamps: false,
    collection: 'user_roles'
});
const User_Role = mongoose.model('User_Role', UserRoleSchema);
module.exports = User_Role; 