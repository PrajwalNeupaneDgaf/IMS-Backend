const User = require('../models/User');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}); // Fetch all users from the database
    res.status(200).json(users); // Respond with the list of users
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  const { id } = req.params; // Extract user ID from request parameters
  try {
    if(req.user.role!='admin'){
      return res.status(403).json({ message: 'Forbidden', error: 'You do not have permission to delete users' });
        

    }
    const user = await User.findByIdAndDelete(id); // Delete the user
    if (!user) {
      return res.status(404).json({ message: 'User not found' }); // If user not found
    }
    res.status(200).json({ message: 'User deleted successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

// Change a user's role (promote/demote)
const changeUserRole = async (req, res) => {
  const { id } = req.params; // Extract user ID from request parameters
  const { role } = req.body; // Extract new role from request body
  try {
    if (!['user', 'employee', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    const user = await User.findById(id); // Find the user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if(req.user.role!='admin'){
      return res.status(404).json({ message: 'Only Admin Has Right' });
    }

    user.role = role; // Update the user's role
    await user.save(); // Save the changes to the database
    res.status(200).json({ message: 'Role updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating role', error: error.message });
  }
};

module.exports = { getAllUsers, deleteUser, changeUserRole };
