const express = require("express");
const router = express.Router();
const controller = require("../controllers/categoriesController");
const { validateCategory } = require("../middleware/recordValidation");

router.get("/", controller.index);
router.get("/:id", controller.show);
router.post("/", validateCategory, controller.create);
router.put("/:id", validateCategory, controller.update);
router.delete("/:id", controller.destroy);

module.exports = router;