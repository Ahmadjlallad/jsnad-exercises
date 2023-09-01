'use strict'
const {Router} = require('express')
const router = Router()

router.get('/', (req, res) => {
    const greeting = 'greeting' in req.query ?
        req.query.greeting :
        'Hello';
    res.render('hello', {greeting: greeting, title: 'Hello'});
})

module.exports = router
