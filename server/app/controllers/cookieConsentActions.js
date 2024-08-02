const setCookieConsent = async (req, res, next) => {
  const { consent } = req.body;

  if (consent !== "true" && consent !== "false") {
    return res.status(400).json({ message: "Invalid consent value" });
  }

  try {
    res.cookie("userConsent", consent, {
      maxAge: 365 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
    });

    return res.status(200).json({ message: "Cookie consent set successfully" });
  } catch (err) {
    next(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getCookieConsent = (req, res) => {
  const { userConsent } = req.cookies;

  if (userConsent === undefined) {
    return res.status(200).json({ consent: null });
  }

  return res.status(200).json({ consent: userConsent });
};

module.exports = {
  setCookieConsent,
  getCookieConsent,
};
