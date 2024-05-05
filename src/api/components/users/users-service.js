const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers(sort, search, pageNumber = 1, pageSize = 10) {
  try {
    const users = await usersRepository.getUsers();
    if (isValidSortParameter(sort)) {
      const [field, order] = sort.split(':');
      users.sort((a, b) => compareUsers(a, b, field, order));
    }

    const filteredUsers = applySearchFilter(users, search);
    const totalItems = filteredUsers.length;
    if (!isValidPageSize(pageSize)) {
      pageSize = totalItems;
    }
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    const formattedUsers = paginatedUsers.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
    }));

    return {
      page_number: pageNumber,
      page_size: pageSize,
      count: formattedUsers.length,
      total_pages: totalPages,
      has_previous_page: pageNumber > 1,
      has_next_page: endIndex < totalItems,
      data: formattedUsers,
    };
  } catch (error) {
    throw new Error('Failed to fetch users: ' + error.message);
  }
}

function isValidSortParameter(sort) {
  if (!sort || typeof sort !== 'string') {
    return false;
  }

  const [field, order] = sort.split(':');
  return (
    field &&
    ['email', 'name'].includes(field) &&
    ['asc', 'desc'].includes(order)
  );
}

function compareUsers(userA, userB, field, order) {
  const valueA = userA[field];
  const valueB = userB[field];
  return order === 'asc'
    ? valueA.localeCompare(valueB)
    : valueB.localeCompare(valueA);
}

function applySearchFilter(users, search) {
  if (!search || typeof search !== 'string') {
    return users;
  }

  const [searchField, searchTerm] = search.split(':');
  if (!searchField || !['email', 'name'].includes(searchField)) {
    return users;
  }

  const searchRegex = new RegExp(searchTerm, 'i');
  return users.filter((user) =>
    user[searchField]?.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

function isValidPageSize(pageSize) {
  return pageSize && typeof pageSize === 'number' && pageSize > 0;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
};
