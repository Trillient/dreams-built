import express from "express";
const router = express.Router();

router.route("/").get();
router.route("/:id").get().post().delete().put();

export default router;
