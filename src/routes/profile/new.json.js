const sqlite3 = require('sqlite3')
let db = new sqlite3.Database('src/database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message)
    }
})

export function get(req, res, next) {
	//info for drop down boxes
	db.all("SELECT user_id, id, first_name || ' ' || last_name as name FROM people", (err, people) => {
		if(err) {
			res.end(JSON.stringify({ message: err }))
		} else {
			res.end(JSON.stringify({ people: people }))
		}
	})
}

export function post(req, res, next) {
	res.setHeader('Content-Type', 'application/json')
  	var req_array = [
		  req.body.user_id,
		  req.body.first_name,
		  req.body.last_name,
		  req.body.gender,
		  req.body.birth_date,
		  req.body.death_date,
		  req.body.birth_location,
		  req.body.death_location
	]
	//add data to person table
	db.run(`INSERT INTO people (user_id, first_name, last_name, gender, birth_date, death_date, birth_location,
		 death_location) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`, req_array, (err) => {
		if (err) {
			return res.end(JSON.stringify({ message: "Sorry, failed to create person" }))
		} else {
			//add parents to relationships table 
			//assumes child is the latest id in people table
			if(req.body.parent1 != '') {
				db.run(`INSERT INTO relationships (relationship_type, parent_id, child_id) VALUES 
				('child', ?, (SELECT id FROM people ORDER BY id desc LIMIT 1))`, req.body.parent1, (err) => {
					if(err) {
						return res.end(JSON.stringify({ message: "Failed to add parents" }))
					} 
				})
			}
			if(req.body.parent2 != '' && req.body.parent1 != req.body.parent2) {
				db.run(`INSERT INTO relationships (relationship_type, parent_id, child_id) VALUES 
				('child', ?, (SELECT id FROM people ORDER BY id desc LIMIT 1))`, req.body.parent2, (err) => {
					if(err) {
						return res.end(JSON.stringify({ message: "Failed to add parents" }))
					}
				})
			}
			//add marriage to relationships table
			if(req.body.marriage != '') {
				db.run(`INSERT INTO relationships (relationship_type, parent_id, child_id) VALUES 
				('married', ?, (SELECT id FROM people ORDER BY id desc LIMIT 1))`, req.body.marriage, (err) => {
					if(err) {
						return res.end(JSON.stringify({ message: "Failed to add spouse" }))
					}
				})
			}
			//add children to relationships table
			for(let i=0; i < Object.keys(req.body.children).length; i++) {
				console.log(req.body.children[i].__value)
				db.run(`INSERT INTO relationships (relationship_type, child_id, parent_id) VALUES 
				('child', ?, (SELECT id FROM people ORDER BY id desc LIMIT 1))`, req.body.children[i].__value, (err) => {
					if(err) {
						return res.end(JSON.stringify({ message: "Failed to add children" }))
					}
				})
			}
			return res.end(JSON.stringify({ message: "New person created!" }))
		}
	})
}