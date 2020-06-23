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
			})
			res.end(JSON.stringify({
				message: `User ID ${id} does not exist.`
			}))
		//otherwise get info about relationships and events
		} else {
			let marriage_query = "SELECT parent_id as 'spouse_id', parent as 'name' FROM relationship_view WHERE relationship_type = 'married' AND child_id = ? UNION SELECT child_id as 'spouse_id', child as 'name' FROM relationship_view WHERE relationship_type = 'married' AND parent_id = ?"
			let event_query = "SELECT event_name, text, date FROM events INNER JOIN event_types ON event_types.id = events.event_type WHERE person_id = ? ORDER BY date"
			
			db.all("SELECT child_id as id, child as name FROM relationship_view WHERE relationship_type = 'child' AND parent_id = ?", id, (err, children) => {
				db.all("SELECT parent_id as id, parent as name FROM relationship_view WHERE relationship_type = 'child' AND child_id = ? ORDER BY parent_id", id, (err, parents) => {
					db.all(marriage_query, [id, id], (err, spouse) => {
						db.all(event_query, id, (err, events) => {
							//info for drop down boxes
							db.all("SELECT user_id, id, first_name || ' ' || last_name as name FROM people WHERE id != ?", id, (err, people) => {
								res.end(JSON.stringify({
									name: person[0].first_name +  " " + person[0].last_name,
									info: person[0],
									children: children,
									parents: parents,
									marriage: spouse,
									events: events,
									people: people
								}))
							})
						})
					})
				})
			})
		}
	})
}

export function post(req, res, next) {
	res.setHeader('Content-Type', 'application/json')
	var req_array = [
		req.body.first_name,
		req.body.last_name,
		req.body.gender,
		req.body.birth_date,
		req.body.death_date,
		req.body.birth_location,
		req.body.death_location,
		req.body.id,
		req.body.user_id
	]
	//update people info
	db.run(`UPDATE people SET first_name = ?, last_name = ?, gender = ?, birth_date = ?, death_date = ?, 
	birth_location = ?, death_location = ? WHERE id = ? AND user_id = ?`, req_array, (err) => {
		if(err) {
			return res.end(JSON.stringify({ message: "Sorry, failed to update person" }))
		} else {
			//remove existing parent relationships
			db.all(`DELETE FROM relationships WHERE child_id = ? AND relationship_type = 'child'`, req.body.id, (err, parents) => {
				//insert new parents
				if(req.body.parent1 != '') {
					db.run(`INSERT INTO relationships VALUES (?, ?, 'child')`, [req.body.parent1, req.body.id], (err) => {
						if(err) {
							return res.end(JSON.stringify({ message: "Error in updating parents" }))
						}
					})
				}
				if(req.body.parent2 != '' && req.body.parent1 != req.body.parent2) {
					db.run(`INSERT INTO relationships VALUES (?, ?, 'child')`, [req.body.parent2, req.body.id], (err) => {
						if(err) {
							return res.end(JSON.stringify({ message: "Error in updating parents" }))
						}
					})
				}
				//remove existing marriages
				db.all(`DELETE FROM relationships WHERE child_id = ? AND relationship_type = 'married'`, req.body.id, (err) => {
					//add marriage to relationships table
					if(req.body.marriage != '') {
						db.run(`INSERT INTO relationships VALUES (?, ?, 'married')`, [req.body.marriage, req.body.id], (err) => {
							if(err) {
								return res.end(JSON.stringify({ message: "Failed to add spouse" }))
							}
						})
					}
				})
				//remove existing child relationships
				db.all(`DELETE FROM relationships WHERE parent_id = ? AND relationship_type = 'child'`, req.body.id, (err, parents) => {
					//add children to relationships table
					for(let i=0; i < Object.keys(req.body.children).length; i++) {
						db.run(`INSERT INTO relationships VALUES (?, ?, 'child')`, [req.body.id, req.body.children[i].__value], (err) => {
							if(err) {
								return res.end(JSON.stringify({ message: "Failed to add children" }))
							}
						})
					}
				})
				return res.end(JSON.stringify({ message: "Update successful!" }))
			})
		}
	})
}

