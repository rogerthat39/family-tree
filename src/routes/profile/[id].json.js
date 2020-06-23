const sqlite3 = require('sqlite3')
let db = new sqlite3.Database('src/database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message)
    }
})

export function get(req, res, next) {
	const { id } = req.params;

	db.all("SELECT * FROM people WHERE id = ?", id, (err, person) => {
		//display error if no results for that id
		if((person).length == 0) {
			res.writeHead(404, {
				'Content-Type': 'application/json'
			});
			res.end(JSON.stringify({
				message: `User ID ${id} does not exist.`
			}));
		//otherwise get events, children, parents, and spouse/s of person
		} else {
			let marriage_query = "SELECT parent_id as 'spouse_id', parent as 'name' FROM relationship_view WHERE relationship_type = 'married' AND child_id = ? UNION SELECT child_id as 'spouse_id', child as 'name' FROM relationship_view WHERE relationship_type = 'married' AND parent_id = ?"
			let event_query = "SELECT event_name, text, date FROM events INNER JOIN event_types ON event_types.id = events.event_type WHERE person_id = ? ORDER BY date"
			
			db.all("SELECT child_id as id, child as name FROM relationship_view WHERE relationship_type = 'child' AND parent_id = ?", id, (err, children) => {
				db.all("SELECT parent_id as id, parent as name FROM relationship_view WHERE relationship_type = 'child' AND child_id = ?", id, (err, parents) => {
					db.all(marriage_query, [id, id], (err, spouse) => {
						db.all(event_query, id, (err, events) => {
							res.writeHead(200, {
								'Content-Type': 'application/json'
							})
							res.end(JSON.stringify({
								id: person[0].id,
								name: person[0].first_name +  " " + person[0].last_name,
								info: person[0],
								children: children,
								parents: parents,
								marriage: spouse,
								events: events
							}))
						})
					})
				})
			})
		}
	})
}
