const express = require('express');
const { 
  scheduleMeeting, 
  respondToMeeting, 
  getUserMeetings 
} = require('../controllers/meetingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Yeh routes sirf login kiye hue users access kar sakte hain
router.get('/user/:userId', protect, getUserMeetings);
router.put('/:id/respond', protect, respondToMeeting);

// Yeh route sirf login kiye hue 'Investor' role wale users ke liye hai
router.post('/schedule', protect, authorize('Investor'), scheduleMeeting);

module.exports = router;