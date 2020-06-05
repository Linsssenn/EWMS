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
    const error = new Error("Invalid session");
    error.statusCode = 400;
    throw error;
  } else {
    const { username, id } = Session.parse(sessionString);

    const [{ account }, userErr] = await handleAsync(
      AccountTable.getAccount({
        usernameHash: hash(username),
      })
    );

    const authenticated = account.sessionId === id;
    if (userErr) throw new Error("Could not authenticate user session");
    return { account, authenticated, username };
  }
};

module.exports = { setSession, authenticatedAccount };

// authenticatedAccount({
//   sessionString:
//     "Hello|ac30143b-82b3-4edd-88bd-3999854e4f73|278e617ba628655a4896ec81ad3b6483c2715ee219f00c4302eca296857ad6b8",
// })
//   .then((res) => console.log(res))
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
