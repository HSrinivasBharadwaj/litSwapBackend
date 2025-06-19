const validateUserData = async (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    throw new Error("All are required fields");
  }
  if (firstName.length <= 1 || firstName.length > 15) {
    throw new Error("First shouldbe in between 1 to 15 characters ");
  }
  if (lastName.length <= 1 || firstName.length > 15) {
    throw new Error("Last shouldbe in between 1 to 15 characters ");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new Error(
      "Password must be at least 8 characters long and contain at least one letter and one number"
    );
  }
};

module.exports = validateUserData
