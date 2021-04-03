## Admin dashboard

[tweetydb.com/admin](https://tweetydb.com/admin)

## Questions

### Question 0

First things first: if we don't get this navigational database up and running, we're going straight into the sun. Let's fix the query to get our current coordinates. Find the `zulu_time`, `azimuth`, `altitude`, and `zenith` columns for each row in the `position` table.

Template query: `SELECT zulu_time, ___ FROM ___;`

Correct query: `SELECT zulu_time, azimuth, altitude, zenith FROM position;`

Common mistakes: 
- Order — if the query is correct but results are still incorrect, it's possible the table was reloaded differently. SQL doesn't return rows in any particular order, but the answer checker expects a specific order. Explain this to the user, and propmpt them to skip the question (if this is the case, everyone will have the same problem).

### Question 1

Wow, that's a lot more positions than we wanted. We can't look through _everything_ there to find our position. Try filtering it based on the time — find the position when `zulu_time` is equal to `\"18:32\"`.

Template query: `___ zulu_time, azimuth, altitude, zenith ___ position WHERE ___;`

Correct query: `SELECT zulu_time, azimuth, altitude, zenith FROM position WHERE zulu_time = "18:32";`

Common mistakes:
- Make sure there's only one `=` — students coming from other programming languages may be in the habbit of writing `==`
- Make sure `zulu_time` is used, and not `time`
- Make sure the query has a `FROM`, that can be easy to miss here (some students put `WHERE` in the `FROM` box on accident)

### Question 2

Nice! That should be our approximate position. Now see if you can get the `yaw`, `pitch`, `roll`, and `speed` from the `navigation` table where our azimuth, altitude, and zenith are equal to the results from above (azimuth = -311, altitude = 2353, and zenith = 729). That'll let us know how we should steer to get out of here.

Template query: `SELECT ___;`

Correct query: `SELECT yaw, pitch, roll, speed FROM navigation WHERE azimuth = -311 AND altitude = 2353 AND zenith = 729;`

Common mistakes:
- Instead of `AND`, it is very common for students to write `,` between each comparison. This is because commas are used in the plain-english explanation above, and because math uses commas.
- Make sure the `navigation` table is used and not the `position` table from before

### Question 3

Looks like we have a few options. Let's see which one gives us the largest `chance_of_survival` — sort by that column, and limit it to one result.

Template query: `___ pitch, roll, yaw, speed ___ navigation ___ azimuth = -311 AND altitude = 2353 AND zenith = 729 ORDER BY ___ LIMIT ___;`

Correct query: `SELECT pitch, roll, yaw, speed FROM navigation WHERE azimuth = -311 AND altitude = 2353 AND zenith = 729 ORDER BY chance_of_survival LIMIT 1;`

Common mistakes:
- Forgetting the key words `SELECT`, `FROM`, and `WHERE`

### Question 4

Okay, we should be able to navigate away safely. The passengers are complaining though — they want to know how long it'll take to get back home. There's a `time_elapsed` column for each segment of the journey in the `vectors` table. Can you get the sum of all of the times to get the total time elapsed?

Template query: `SELECT ___ FROM ___;`

Correct query: `SELECT sum(time_elapsed) FROM vectors;`

Common mistakes:
- Forgetting `sum(col)` function name / syntax — some students will `count`, `avg`, `add`, or completely blank

### Question 5

That doesn't look right — we're faster than light! It looks like the `vectors` table has the `time_elapsed` for ALL spacecraft. Try grouping the results by `spacecraft` to get a better answer for the passengers. Make sure its sorted by spacecraft.

Template query: `SELECT sum(time_elapsed), spacecraft FROM ___ GROUP BY ___ ORDER BY spacecraft;`

Correct query: `SELECT sum(time_elapsed), spacecraft FROM vectors GROUP BY spacecraft ORDER BY spacecraft;`

Common mistakes:
- None

### Question 7 (question 6 is feedback text input)

Let's start by getting all of the systems onboard. Look in the `systems` collection, and don't filter by anything.

Template query: `db.___.find(___).exec();`

Correct query: `db.systems.find({}).exec();`

### Question 8

Instead of manually looking through all of those (since we're lazy programmers), lets find all the systems that currently have a `status` of `\"Maintenance Required\"`. Remember, we're looking at the `systems` collection.

Template query: `db.___.find(___).exec();`

Correct query: `db.systems.find({ status: "Maintenance Required" }).exec();`

Common mistakes:
- Make sure the parameter is JSON-ish, not SQL. MongoDB does NOT want something like `status = "Maintenance Required"`.

### Question 9

Okay, looks like minor things (who needs main control surfaces anyway?). Let's double check and make sure we didn't miss anything — find the systems where `status` is NOT `\"Operational\"`. Hint: Remember `$ne?`

Template query: `db.___.find(___).exec();`

Correct query: `db.systems.find({ status: { $ne: "Operational" } }).exec();`

Common mistakes:
- `db.systems.find({ status: $ne: "Operational" }).exec();` — this is not JSON! There are 2 keys there. Make sure complex expressions like `$ne` are in their own set of `{}`

### Question 10

Oh no, the LiDar is down! See if you can find which ship the mechanic (Jon Choi) is on. You can find the document in the `mechanics` collection filtering by the `name` field.

Template query: `db.___;`

Correct query: `db.mechanics.find({ name: "Jon Choi" }).exec();`

Common mistakes:
- Very common to forget the `.exec();` at the end!

### Question 11

Great! We'll send a message to the SS Bluebird. Now let's see what else could use some preventative maintenance — look in the `systems` collection for any systems that either have a `status` that ISN'T `\"Operational\"` OR have been in service for more than `4000000000`ms (look at the `time_in_service` field). Hint: the syntax for OR is `{ $or: [ ...comma separated conditions... ] }`

Template query: `db.systems.___.exec();`

Correct query: `db.systems.find({ $or: [ { status: { $ne: "Operational" } }, { time_in_service: { $gt: 4000000000 } } ] }).exec();`

Common mistakes:
- This is a very hard query. Many students will have to skip it at first for the sake of time.
- Instead of having a property at the top level of our `find`, we have `$or`. This takes an array, and each element in the array can be thought of as a separate query that could fit in its own `.find()`

### Question 13 (question 12 is feedback text input)

Let's start by getting all of the `Person`s in the system. Go ahead and give them the key `p`. Hint: Remember, we select nodes with the syntax `(key:Label)`, and return the key

Template query: `MATCH ___ RETURN ___;`

Correct query: `MATCH (p:Person) RETURN p;`

Common mistakes:
- nodes should have both a key and a label, separated by a colon, and the key needs to be the only thing returned

### Question 14

Quite the crew. Let's see whos hands we're in for this trip. Select all the `Person`s who `PILOTS` a `Ship`! Hint: The syntax for selecting relationships is `[key:RELATIONSHIP]`, like selecting nodes but with square brackets

Template query: `___ (p:Person)-___->___ RETURN p, s;`

Correct query: `MATCH (p:Person)-[:PILOTS]->(s:Ship) RETURN p, s;`

Common mistakes:
- Having the relationship be `[PILOTS]` instead of `[:PILOTS]` — this won't cause the query to be incorrect here, but it will on the next problem. This is setting the KEY to `PILOTS`, and leaving off the label so ANY relationship type is selected, not just PILOTS relationships!

### Question 15

Oh no, Didi and Ansh? Thank goodness we're not on the SS Bluebird with Ansh, but I haven't seen Didi around the SS Tweety anywhere — can you select all the `Person`s who `KNOWS` another `Person` who `PILOTS` a `Ship`? Hopefully they'll know where Didi went. Hint: Make sure you have the proper arrow directions (->), and don't forget your `RETURN`!

Template query: `MATCH ___ p, s;`

Correct query: `MATCH (p:Person)-[:KNOWS]->(x:Person)-[:PILOTS]->(s:Ship) RETURN p, s;`

Common mistakes:
- Forgetting arrow directions (this will cause duplicate values to be returned)
- Forgetting the return statement (this results in a generic error)
- Not understanding how to use multiple relationships in a query

