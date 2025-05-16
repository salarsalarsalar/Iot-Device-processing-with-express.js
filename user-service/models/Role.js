const {  mongoose } = require('mongoose');

const RoleSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false
    }
}, {
    timestamps: false,
    collection: 'roles'
});

const Role = mongoose.model('Role', RoleSchema);
module.exports = Role; 