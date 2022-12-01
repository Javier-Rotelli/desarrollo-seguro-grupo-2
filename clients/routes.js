import express from 'express'
import passport from 'passport'

import { createClient } from './db.js'

const router = express.Router()

// creates a new client for this user
router.post('/',
  passport.authenticate('bearer', { session: false }),
  (req, res) => {
    const { newClient, plainSecret } = createClient(req.user.username, req.body.app)

    res.json({ ...newClient, plainSecret })
  }
)

export default router