const { Post, Reaction } = require("../models");
const { formatPost } = require("../utils/formatPost");

async function list(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit, 10) || 10),
    );
    const offset = (page - 1) * limit;
    const posts = await Post.findAll({
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });
    return res.json({ success: true, posts: posts.map(formatPost) });
  } catch (err) {
    console.error("List posts error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

async function getOne(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid post id" });
    }
    const post = await Post.findByPk(id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    return res.json({ success: true, post: formatPost(post) });
  } catch (err) {
    console.error("Get post error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

async function react(req, res) {
  try {
    const postId = parseInt(req.params.id, 10);
    if (isNaN(postId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid post id" });
    }
    const post = await Post.findByPk(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    const reaction_type = req.body.reaction;
    const user_identifier =
      req.body.user_identifier ||
      req.headers["x-user-identifier"] ||
      req.ip ||
      "anonymous";

    const reactionCol = (type) =>
      type === "thumbs_up"
        ? "thumbs_up_count"
        : type === "thumbs_down"
          ? "thumbs_down_count"
          : "heart_count";

    const previous = await Reaction.findOne({
      where: { post_id: postId, user_identifier },
    });
    if (previous) {
      const col = reactionCol(previous.reaction_type);
      post[col] = Math.max(0, (post[col] || 0) - 1);
      await post.save();
    }

    const [reaction] = await Reaction.findOrCreate({
      where: { post_id: postId, user_identifier },
      defaults: { reaction_type },
    });
    if (reaction.reaction_type !== reaction_type) {
      reaction.reaction_type = reaction_type;
      await reaction.save();
    }

    const col = reactionCol(reaction_type);
    post[col] = (post[col] || 0) + 1;
    await post.save();

    const updated = await Post.findByPk(postId);
    return res.json({ success: true, post: formatPost(updated) });
  } catch (err) {
    console.error("React error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = {
  list,
  getOne,
  react,
};
