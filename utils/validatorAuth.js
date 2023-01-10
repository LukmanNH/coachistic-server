class Validator {
  static checkSignUp(nama, no_telp, email, password) {
    try {
      if (!nama || !email || !no_telp || !password) {
        throw new Error("Name, email, telp and password are required");
      } else if (password.length < 6) {
        throw new Error(
          "Password is required and must be min 6 character long."
        );
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  static checkSignIn(email, password) {
    try {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default Validator;
