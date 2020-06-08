const Session = require("../models/account/session");
const AccountTable = require("../models/account/table");
const { hash } = require("../models/helper/hash");
const handleAsync = require("../utils/asyncHandler");

const setSession = async ({ username, res, sessionId }) => {
  let session, sessionString;
  // if session already exist
  if (sessionId) {
    // use same session
    sessionString = Session.sessionString({ username, id: sessionId });
    // store the session in the cookie
    setSessionCookie({ sessionString, res });
    return { message: "Session restored" };
  } else {
    // if session does not exist
    // Creates Session Cookie

    session = new Session({ username });
    sessionString = session.toString();

    // Update sessionId in the database
    const [user, userErr] = await handleAsync(
      AccountTable.updateSessionId({
        sessionId: session.id,
        usernameHash: hash(username),
      })
    );

    if (user === undefined) throw new Error("Could not update user session");
    if (userErr) throw new Error("Could not update user session");
    // store the session in the cookie
    setSessionCookie({ sessionString, res });
    // promise returns a message
    return { message: "session created" };
  }
};

// function that stores session in the cookies
// req.cookies.sessionString
// Writes the cookie
const setSessionCookie = ({ sessionString, res }) => {
  res.cookie("sessionString", sessionString, {
    expire: Date.now() + 360000, //expires after 1 hour
    httpOnly: true, // use http
    // secure: true // use with https
  });
};

const authenticatedAccount = async ({ sessionString }) => {
  if (!sessionString || !Session.verify(sessionString)) {
    return Promise.reject("Invalid Session");
  } else {
    const { username, id } = Session.parse(sessionString);

    const [{ account }, accountErr] = await handleAsync(
      AccountTable.getAccount({
        usernameHash: hash(username),
      })
    );

    const authenticated = account.sessionId === id;
    if (accountErr)
      return Promise.reject("Could not authenticate user session");
    return Promise.resolve({ account, authenticated, username });
  }
};

module.exports = { setSession, authenticatedAccount };

// async function testAuth() {
//   const [authAccount, authAccountErr] = await handleAsync(
//     authenticatedAccount({
//       sessionString:
//         "Hello|cac6483a-2497-4cd6-a417-1a45c939a265|c045b1713710c0b05aaccd97de6e6fc5d6fb4a5dd90e5b7c65fe1b26dee5ea84",
//     })
//   );
//   // console.log(authAccountErr);
//   if (authAccountErr) throw new Error(authAccountErr);
//   if (!authAccount.authenticated) throw new Error("Session expired");
//   if (authAccount) return authAccount.authenticated;
// }
// testAuth()
//   .then((res) => console.log("res", res))
//   .catch((err) => console.log(err));

// authenticatedAccount({
//   sessionString:
//     "Hello|f3e94589-4852-4240-a68a-8438ac5062c4|74b4dfbab060c185c57cfb4a30b4bc8b33f367f868b8eb3ccfbedfd3379089ad",
// })
//   .then(({ authenticated }) => console.log({ authenticated }))
//   .catch((err) => console.log(err));

// async function test() {
//   const [message, sessionError] = await handleAsync(
//     setSession({ username: "Hello" })
//   );
//   if (message) {
//     console.log(message);
//   }
//   console.log(sessionError);
// }
// test();