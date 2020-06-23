const sqlite3 = require('sqlite3')
let db = new sqlite3.Database('src/database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message)
    }
})

export function get(req, res) {
	const { id } = req.params
	db.run("DELETE FROM people WHERE id = ?", id, (err1) => {
		db.run("DELETE FROM relationships WHERE child_id = ? OR parent_id = ?", [id,id], (err2) => {
			if(err1 || err2) {
				res.end(JSON.stringify({ message: `Sorry, User ID ${id} was not deleted.` }))
			} else {
				res.end(JSON.stringify({ message: "Delete successful" }))
			}
		})				
	})	
}
