
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

    const body = req.body || {};

    const clean = value =>
      typeof value === "string" ? value.trim() : "";

    const name = clean(body.name);
    const email = clean(body.email).toLowerCase();
    const subject = clean(body.subject);
    const service = clean(body.service);
    const projectType = clean(body.project_type);
    const budget = clean(body.budget);
    const timeline = clean(body.timeline);
    const message = clean(body.message);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const allowedServices = [
      "Web Development",
      "UI / UX Design",
      "Brand Identity",
      "Digital Strategy",
      "E-Commerce",
      "Creative Solutions",
      "Not sure yet"
    ];

    const allowedProjectTypes = [
      "New project",
      "Redesign",
      "Improvement",
      "Consultation",
      "Other"
    ];

    const allowedBudgets = [
      "Not decided yet",
      "Under $100",
      "$100 – $300",
      "$300 – $700",
      "$700 – $1500",
      "$1500+",
      "Discuss first"
    ];

    const allowedTimelines = [
      "As soon as possible",
      "Within 2 weeks",
      "Within 1 month",
      "Within 2–3 months",
      "Flexible"
    ];

    if (
      name.length < 2 ||
      name.length > 100 ||
      email.length > 254 ||
      !emailPattern.test(email) ||
      subject.length > 200 ||
      !allowedServices.includes(service) ||
      !allowedProjectTypes.includes(projectType) ||
      !allowedBudgets.includes(budget) ||
      !allowedTimelines.includes(timeline) ||
      message.length < 5 ||
      message.length > 5000
    ) {
      return res.status(400).json({
        success: false,
        message: "Please check all inquiry details."
      });
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/inquiries`,
      {
        method: "POST",
        headers: {
          apikey: supabaseSecret,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify({
          name,
          email,
          subject: subject || null,
          service,
          project_type: projectType,
          budget,
          timeline,
          message,
          status: "new"
        })
      }
    );

    if (!response.ok) {
      const details = await response.text();

      console.error("Supabase insert failed:", details);

      return res.status(502).json({
        success: false,
        message: "Unable to save your inquiry right now."
      });
    }

    return res.status(201).json({
      success: true,
      message: "Your project inquiry has been submitted successfully."
    });

  } catch (error) {
    console.error("Inquiry API error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again."
    });
  }
};
