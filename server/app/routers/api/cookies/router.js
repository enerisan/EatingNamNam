const express = require("express");
const {
  setCookieConsent,
  getCookieConsent,
} = require("../../../controllers/cookieConsentActions");

const router = express.Router();

router.post("/set-cookie-consent", setCookieConsent);
router.get("/get-cookie-consent", getCookieConsent);

module.exports = router;
