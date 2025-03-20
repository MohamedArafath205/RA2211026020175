const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.get("/users", async (req, res) => {
  try {
    const response = await axios.get("http://20.244.56.144/test/users", {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const users = response.data;

    const topUsers = users
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 5);
    res.json(topUsers);
  } catch (error) {
    console.error(
      "API Error:",
      error.response ? error.response.data : error.message
    );
  }
});

app.get("/posts", async (req, res) => {
  const { type } = req.query;
  if (!["latest", "popular"].includes(type)) {
    return res
      .status(400)
      .json({ error: "Invalid type parameter. Use latest or popular." });
  }

  try {
const response = await axios.get("http://20.244.56.144/test/posts", {
  headers: { Authorization: `Bearer ${authToken}` },
});    const posts = response.data;

    let result;
    if (type === "latest") {
      result = posts
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);
    } else {
      const maxComments = Math.max(...posts.map((post) => post.commentCount));
      result = posts.filter((post) => post.commentCount === maxComments);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
