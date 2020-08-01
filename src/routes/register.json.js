import SHA512 from 'crypto-js/sha512';

const sqlite3 = require('sqlite3')
let db = new sqlite3.Database('src/database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message)
    }
})

function createRandomSalt(length) {
	var salt = "";
    var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(var i = 0; i < length; i++) {
        salt += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return salt;
}

export function post(req, res, next) {
	res.setHeader('Content-Type', 'application/json')

	let salt = createRandomSalt(20)
	let hash = SHA512(salt + req.body.password).toString()

	//check if hashed password matches one in DB
	db.all(`INSERT INTO users (username, password, salt) VALUES(?, ?, ?)`, [req.body.username, hash, salt], (err) => {
		if(err) {
			return res.end(JSON.stringify({ message: err }))
		} else {
			return res.end(JSON.stringify({ message: "Successfully created user. You can now log in."}))
		}
	})
}
