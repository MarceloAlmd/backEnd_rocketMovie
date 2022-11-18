const TagsController = require("../controller/TagsController")
const {Router} = require("express");

const tagsRouter = Router()

const tagsController = new TagsController;

tagsRouter.get("/:user_id", tagsController.index)

module.exports = tagsRouter;