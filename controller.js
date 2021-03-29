const service = require("./service");

const validateUser = async (req, res) => {
  try {
    const { params } = req;
    const result = await service.validateUser(params);
    res.status(200).json({ message: result });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const addUser = async (req, res) => {
  try {
    const { body } = req;
    let result = await service.addUser(body);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const removeUser = async (req, res) => {
  try {
    const { params } = req;
    await service.removeUser(params);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = {
  addUser,
  removeUser,
  validateUser
};
