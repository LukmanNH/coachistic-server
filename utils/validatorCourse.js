class Validator {
  static checkGetCourseById(slug) {
    try {
      if (!slug) {
        throw new Error("Slug is required");
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  static checkAddLesson(title, description, video) {
    try {
      if (!title || !description || !video) {
        throw new Error("Title, description and video_url are required");
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  static checkUpdateLessons(title, description, video_url) {
    try {
      if (!title || !description || !video_url) {
        throw new Error("Title, description and video_url are required");
      }
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default Validator;
