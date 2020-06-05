const Session = require("../models/account/session");
const AccountTable = require("../models/account/table");
const { hash } = require("../models/helper/hash");
const { authenticatedAccount, setSession } = require("./helper");
const catchAsync = require("../utils/catchAsync");
const handleAsync = require("../utils/asyncHandler");
const AppError = require("../utils/appError");

exports.signup = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  const usernameHash = hash(username);
  const passwordHash = hash(password);

  const [{ account }, accountErr] = await handleAsync(
    AccountTable.getAccount({ usernameHash })
  );

  if (!account) {
    await AccountTable.storeAccount({ usernameHash, passwordHash });
  } else {
    return next(new AppError("This username already exist", 400));
  }

  if (accountErr) {
    return next(
      new AppError("There was an error in logging in please try again", 400)
    );
  }

  const [message, sessionError] = await handleAsync(
    setSession({ username, res })
  );
  if (message) res.status(200).json(message);
  if (sessionError)
    return next(
      new AppError("There was an error in singing in please try again", 400)
    );
});

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  const [{ account }, accountErr] = await handleAsync(
    AccountTable.getAccount({ usernameHash: hash(username) })
  );
  if (account && account.passwordHash === hash(password)) {
    const { sessionId } = account;
    const [message, sessionError] = await handleAsync(
      setSession({ username, res, sessionId })
    );
    if (message) res.status(200).json(message);
    if (sessionError)
      return next(
        new AppError("There was an error in singing in please try again", 400)
      );
  } else {
    return next(new AppError("Incorrect username/password", 400));
  }
});

exports.logout = catchAsync(async (req, res, next) => {
  const { username } = Session.parse(req.cookies.sessionString);
  await AccountTable.updateSessionId({
    sessionId: null,
    usernameHash: hash(username),
  });
  // Get rid of cookie
  res.clearCookie("sessionString");
  res.json({ message: "Succesful Logout" });
});

exports.authenticated = catchAsync(async (req, res, next) => {});
