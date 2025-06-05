export async function getUser(req, res) {
  try {
    const { id } = req.user;
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      return formatResponse(
        res,
        403,
        STANDARD_MESSAGES["UNAUTHORIZED"],
        {
          message: "Not authorized",
        }
      );
    }
    delete user.password;
    delete user.googleId;
    return formatResponse(
      res,
      200,
      STANDARD_MESSAGES["FETCH_SUCCESS"],
      user
    );
  } catch (error) {
    console.error(error);
    return serverError(res);
  }
}
