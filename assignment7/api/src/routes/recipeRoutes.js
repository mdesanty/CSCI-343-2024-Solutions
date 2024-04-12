const express = require("express");
const router = express.Router();
const controller = require("../controllers/recipesController");
const { validateRecipe } = require("../middleware/recordValidation");

router.get("/", controller.index);
router.get("/:id", controller.show);
router.post("/", validateRecipe, controller.create);
router.put("/:id", validateRecipe, controller.update);
router.delete("/:id", controller.destroy);

module.exports = router;