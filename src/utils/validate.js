const validator = require("validator");
const validateUser = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    throw new Error("All fields are mandatory");
  }
  if (firstName.length < 2 || firstName.length > 100) {
    throw new Error("First name must be between 2 and 100 characters.")
  }
   if (lastName.length < 2 || lastName.length > 100) {
    throw new Error("Last name must be between 2 and 100 characters.")
  }
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email format");
  }
  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
  ) {
    throw new Error(
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
    );
  }
};

module.exports = validateUser;
