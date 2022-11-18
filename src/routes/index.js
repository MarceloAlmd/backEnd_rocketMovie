const {Router} = require("express");
const router = Router()

const usersRoutes = require("./user.routes");
const notesRoutes = require("./note.routes");
const tagsRoutes = require("./tag.router");

router.use("/users", usersRoutes)
router.use("/notes", notesRoutes)
router.use("/tags", tagsRoutes)

module.exports = router;
