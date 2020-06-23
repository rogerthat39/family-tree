const sqlite3 = require('sqlite3')
let db = new sqlite3.Database('src/database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message)
    }
})

export function get(req, res, next) {
	const { session_id } = req;

	db.all(`SELECT user_id, id, first_name || ' ' || last_name as name, birth_date, death_date, gender FROM people`, (err, people) => {
		res.writeHead(200, {
			'Content-Type': 'application/json'
		})
		res.end(JSON.stringify({people}))
	})
}
