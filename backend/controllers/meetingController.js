const Meeting = require('../models/Meeting');

// @desc    Schedule a new meeting
// @route   POST /api/meetings/schedule
const scheduleMeeting = async (req, res) => {
  try {
    const { entrepreneurId, investorId, startTime, endTime } = req.body;

    // Basic validation
    if (!entrepreneurId || !investorId || !startTime || !endTime) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Conflict Detection: Check if either user already has a meeting in this time frame
    const conflictingMeeting = await Meeting.findOne({
      $or: [
        { investor: investorId },
        { entrepreneur: entrepreneurId }
      ],
      status: { $ne: 'Rejected' }, // Ignore rejected meetings
      $and: [
        { startTime: { $lt: endTime } },
        { endTime: { $gt: startTime } }
      ]
    });

    if (conflictingMeeting) {
      return res.status(400).json({ 
        message: 'Conflict detected: One of the participants is already booked in this time slot.' 
      });
    }

    // Create and save the new meeting
    const meeting = new Meeting({
      investor: investorId,
      entrepreneur: entrepreneurId,
      startTime,
      endTime
    });

    const createdMeeting = await meeting.save();
    res.status(201).json(createdMeeting);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Accept or Reject a meeting
// @route   PUT /api/meetings/:id/respond
const respondToMeeting = async (req, res) => {
  try {
    const { status } = req.body; // 'Accepted' or 'Rejected'
    
    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status response.' });
    }

    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found.' });
    }

    meeting.status = status;
    
    // Optional: Add a generated video call link if accepted
    if (status === 'Accepted') {
      meeting.meetingLink = `/room/${meeting._id}`;
    }

    const updatedMeeting = await meeting.save();
    res.json(updatedMeeting);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all meetings for a specific user (Investor or Entrepreneur)
// @route   GET /api/meetings/user/:userId
const getUserMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({
      $or: [
        { investor: req.params.userId },
        { entrepreneur: req.params.userId }
      ]
    }).populate('investor', 'name email').populate('entrepreneur', 'name email');

    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  scheduleMeeting,
  respondToMeeting,
  getUserMeetings
};