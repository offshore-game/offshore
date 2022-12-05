import express from 'express'
import { routeType } from '../types'

export default {
    route: '/',
    callback: async (req, res) => {
        res.send("Hello World!")
    }
} as routeType
