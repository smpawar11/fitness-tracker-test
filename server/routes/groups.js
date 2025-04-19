const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');
const Group = require('../models/Group');
const User = require('../models/User');
require('dotenv').config();

// @route   POST api/groups
// @desc    Create a new group
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Simple validation
    if (!name) {
      return res.status(400).json({ msg: 'Please provide a group name' });
    }
    
    // Create a new group
    const newGroup = new Group({
      name,
      description: description || '',
      admin: req.user.id,
      members: [req.user.id] // Add creator as first member
    });
    
    const group = await newGroup.save();
    
    // Add group to user's groups array
    const user = await User.findById(req.user.id);
    user.groups.push(group._id);
    await user.save();
    
    res.json(group);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/groups
// @desc    Get all groups the user is a member of
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('groups');
    res.json(user.groups);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/groups/:id
// @desc    Get group by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('admin', ['username', 'realName'])
      .populate('members', ['username', 'realName'])
      .populate('goals');
    
    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }
    
    // Check if user is a member of the group
    if (!group.members.some(member => member._id.toString() === req.user.id)) {
      return res.status(401).json({ msg: 'Not a member of this group' });
    }
    
    res.json(group);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Group not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/groups/:id
// @desc    Update group details
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Find group
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }
    
    // Check if user is admin
    if (group.admin.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized - only admin can update group details' });
    }
    
    // Update fields
    if (name) group.name = name;
    if (description !== undefined) group.description = description;
    
    await group.save();
    
    res.json(group);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Group not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/groups/:id
// @desc    Delete a group
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }
    
    // Check if user is admin
    if (group.admin.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized - only admin can delete the group' });
    }
    
    // Remove group from all members' groups array
    for (let memberId of group.members) {
      const member = await User.findById(memberId);
      if (member) {
        member.groups = member.groups.filter(g => g.toString() !== req.params.id);
        await member.save();
      }
    }
    
    // Delete the group
    await group.remove();
    
    res.json({ msg: 'Group removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Group not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/groups/invite/:id
// @desc    Generate invite code and send email invitation
// @access  Private
router.post('/invite/:id', auth, async (req, res) => {
  try {
    const { emails } = req.body;
    
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ msg: 'Please provide at least one email address' });
    }
    
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }
    
    // Check if user is admin or member of the group
    if (!group.members.includes(req.user.id)) {
      return res.status(401).json({ msg: 'Not authorized - not a member of this group' });
    }
    
    // Get sender information
    const sender = await User.findById(req.user.id);
    
    // Create transporter object using SMTP transport
    // In a production environment, use a proper email service
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
      port: process.env.EMAIL_PORT || 2525,
      auth: {
        user: process.env.EMAIL_USER || 'testuser',
        pass: process.env.EMAIL_PASS || 'testpass'
      }
    });
    
    const inviteUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/join-group/${group.inviteCode}`;
    
    // Send emails
    const sentEmails = [];
    for (let email of emails) {
      try {
        await transporter.sendMail({
          from: `"Health Tracker" <noreply@healthtracker.com>`,
          to: email,
          subject: `${sender.realName} invited you to join ${group.name} on Health Tracker`,
          text: `Hi there!
          
${sender.realName} (${sender.username}) has invited you to join their health and fitness group "${group.name}" on Health Tracker.

Group Description: ${group.description}

To join this group, click the link below:
${inviteUrl}

If you don't have an account yet, you'll need to sign up first.

Stay healthy!
The Health Tracker Team`,
          html: `<p>Hi there!</p>
          <p>${sender.realName} (${sender.username}) has invited you to join their health and fitness group "<strong>${group.name}</strong>" on Health Tracker.</p>
          <p><strong>Group Description:</strong> ${group.description}</p>
          <p>To join this group, click the button below:</p>
          <p><a href="${inviteUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Join Group</a></p>
          <p>If you don't have an account yet, you'll need to sign up first.</p>
          <p>Stay healthy!<br>The Health Tracker Team</p>`
        });
        sentEmails.push(email);
      } catch (emailErr) {
        console.error(`Failed to send email to ${email}:`, emailErr);
      }
    }
    
    res.json({
      inviteCode: group.inviteCode,
      inviteUrl,
      sentEmails
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/groups/join/:inviteCode
// @desc    Join a group using invite code
// @access  Private
router.post('/join/:inviteCode', auth, async (req, res) => {
  try {
    const group = await Group.findOne({ inviteCode: req.params.inviteCode });
    
    if (!group) {
      return res.status(404).json({ msg: 'Invalid invite code' });
    }
    
    // Check if user is already a member
    if (group.members.includes(req.user.id)) {
      return res.status(400).json({ msg: 'You are already a member of this group' });
    }
    
    // Add user to group members
    group.members.push(req.user.id);
    await group.save();
    
    // Add group to user's groups
    const user = await User.findById(req.user.id);
    user.groups.push(group._id);
    await user.save();
    
    res.json(group);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/groups/:id/leave
// @desc    Leave a group
// @access  Private
router.delete('/:id/leave', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }
    
    // Check if user is a member
    if (!group.members.includes(req.user.id)) {
      return res.status(400).json({ msg: 'You are not a member of this group' });
    }
    
    // Admin can't leave; they must delete the group or transfer admin rights
    if (group.admin.toString() === req.user.id) {
      return res.status(400).json({ msg: 'As the admin, you cannot leave the group. You must either delete it or transfer admin rights.' });
    }
    
    // Remove user from group members
    group.members = group.members.filter(member => member.toString() !== req.user.id);
    await group.save();
    
    // Remove group from user's groups
    const user = await User.findById(req.user.id);
    user.groups = user.groups.filter(g => g.toString() !== req.params.id);
    await user.save();
    
    res.json({ msg: 'You have left the group' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Group not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/groups/:id/admin/:userId
// @desc    Transfer group admin rights to another member
// @access  Private
router.put('/:id/admin/:userId', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }
    
    // Check if current user is admin
    if (group.admin.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized - only admin can transfer admin rights' });
    }
    
    // Check if target user exists and is a member
    if (!group.members.some(member => member.toString() === req.params.userId)) {
      return res.status(400).json({ msg: 'Target user is not a member of this group' });
    }
    
    // Transfer admin rights
    group.admin = req.params.userId;
    await group.save();
    
    res.json(group);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Group or user not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;