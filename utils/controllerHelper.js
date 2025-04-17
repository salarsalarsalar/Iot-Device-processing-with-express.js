const iotModel = require('../models/iotModel');

const msg = {
  notFound: 'Data not found',
  notGotten:   'Failed to get data',
  notInserted: 'Failed to insert data',
  notUpdated:  'Failed to update data',
  notDeleted:  'Failed to delete data',
  gotten:   'Data gotten successfully',
  inserted: 'Data inserted successfully',
  updated:  'Data updated successfully',
  deleted:  'Data deleted successfully',
};

const runController = async (
  res,
  controllerFn,
  {
    successStatus = 200,
    successMessage = null,
    notFoundMessage = null,
    errorMessage = 'Server error',
    checkNotFound = true
  } = {},
  ...args
) => {
  try {
    const data = await controllerFn(...args);

    // Check for "not found" if needed
    if (checkNotFound && (!data || (Array.isArray(data) && data.length === 0))) {
      return res.status(404).json({ message: notFoundMessage || 'Not found' });
    }

    // If a message is passed, return it with the data
    if (successMessage) {
      return res.status(successStatus).json({ message: successMessage, data });
    }

    return res.status(successStatus).json(data);

  } catch (err) {
    return res.status(500).json({ message: errorMessage, error: err });
  }
};
