const { INTEGER } = require('sequelize')
const mongoose = require('../db/conn')
const { Schema } = mongoose

const Pet = mongoose.model(
    'Pet',
    new Schema({
        name: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true
        },
        Weight: {
            type: Number,
            required: true
        },
        color: {
            type: Array,
            required: true
        },
        images: {
            type: String,
            required: true
        },

        available: {
            type: Boolean
        },
        user: Object,
        adpter: Object

    },
        /* define quando o dado foi criado ou atualizado */
        { timestamps: true },



    ),
)

module.exports = Pet