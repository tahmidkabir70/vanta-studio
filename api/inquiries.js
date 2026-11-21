
module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");

    return res.status(405).json({
      success: false,
      message: "Method not allowed."
    });
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseSecret = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseSecret) {
      console.error("Missing Supabase environment variables.");

      return res.status(500).json({
        success: false,
        message: "Server configuration error."
      });
    }

    const {
      name,
      email,
      subject,
      message
    } = req.body || {};

    const cleanName = String(name || "").trim();
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanSubject = String(subject || "").trim();
    const cleanMessage = String(message || "").trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      cleanName.length < 2 ||
      cleanName.length > 100 ||
      cleanEmail.length > 254 ||
      !emailPattern.test(cleanEmail) ||
      cleanSubject.length > 200 ||
      cleanMessage.length < 5 ||
      cleanMessage.length > 5000
    ) {
      return res.status(400).json({
        success: false,
        message: "Please check your inquiry details."
      });
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/inquiries`,
      {
        method: "POST",
        headers: {
          apikey: supabaseSecret,
          Authorization: `Bearer ${supabaseSecret}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          subject: cleanSubject || null,
          service: cleanSubject || "General inquiry",
          message: cleanMessage
        })
      }
    );

    if (!response.ok) {
      const errorDetails = await response.text();

      console.error("Supabase insert failed:", errorDetails);

      return res.status(502).json({
        success: false,
        message: "Unable to save your inquiry right now."
      });
    }

    return res.status(201).json({
      success: true,
      message: "Your inquiry has been submitted successfully."
    });

  } catch (error) {
    console.error("Inquiry API error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again."
    });
  }
};
