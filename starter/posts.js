const express = require('express');
const mongoose = require('mongoose');

const Post = require('../models/Post');

const router = express.Router();

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

router.post('/', async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Tietojen hakeminen epäonnistui' });
  }
});

router.get('/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid post id' });
  }
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Postausta ei löytynyt' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Tietojen hakeminen epäonnistui' });
  }
});

router.put('/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid post id' });
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ error: 'Postausta ei löytynyt' });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid post id' });
  }
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ error: 'Postausta ei löytynyt' });
    }
    res.status(200).json({ message: 'Postaus poistettu onnistuneesti' });
  } catch (error) {
    res.status(500).json({ error: 'Poistaminen epäonnistui' });
  }
});

module.exports = router;