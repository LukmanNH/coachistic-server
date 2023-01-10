class Validator {
  static checkMakeInstructor(discord, instagram, expertise, summary) {
    try {
      if (!discord || !instagram || !expertise || !summary) {
        throw new Error(
          "Discord, instagram, expertise and summary are required"
        );
      }
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default Validator;
