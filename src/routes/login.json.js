import SHA512 from 'crypto-js/sha512';

const sqlite3 = require('sqlite3')
let db = new sqlite3.Database('src/database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message)
    }
})

export function post(req, res, next) {
	res.setHeader('Content-Type', 'application/json')

	//get salt of user
	db.get(`SELECT salt FROM users WHERE username = ?`, req.body.username, (err, result) => {
		if(err || result == undefined) {
			return res.end(JSON.stringify({ message: "Incorrect login credentials" }))
		}

		//calculate hash password
		let hash = SHA512(result.salt + req.body.password).toString()
		
		//check if hashed password matches one in DB
		db.all(`SELECT * FROM users WHERE username = ? AND password = ?`, [req.body.username, hash], (err, user) => {
			if(err || user.length == 0) {
				return res.end(JSON.stringify({ message: "Incorrect login credentials" }))
			} else {
				return res.end(JSON.stringify({ message: "Login successful!", id: user[0].id}))
			}
		})
	})
}
