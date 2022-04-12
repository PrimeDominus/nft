const express = require('express')
const router = express.Router()
const { auth } = require('../../middleware/auth')
const { success } = require('../../function/response')

exports.test = async (req, res) => {
    try {
        success(res,'hello')
    } catch (e) {
        console.log(e)
    }

}