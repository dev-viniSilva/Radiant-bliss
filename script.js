const form = document.getElementById('quote-form');

/* -------------------------
   VALIDATION
--------------------------*/
function validate(data) {
  const nameRegex = /^[a-zA-ZÀ-ÿ\s]{2,50}$/;
  const phoneRegex = /^[0-9()+\-\s]{7,20}$/;

  if (!nameRegex.test(data.first_name)) return "Invalid first name";
  if (!nameRegex.test(data.last_name)) return "Invalid last name";
  if (!phoneRegex.test(data.phone)) return "Invalid phone number";

  if (!data.city || data.city.length < 2) return "Invalid city";
  if (!data.service_type) return "Select a service";

  if (data.message && data.message.length > 500) return "Message too long";

  return null;
}

/* -------------------------
   BACKEND (RENDER URL)
--------------------------*/
const API_URL = "https://SEU-BACKEND.onrender.com";

/* -------------------------
   FORM SUBMIT
--------------------------*/
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = form.querySelector('.btn-submit');

    const data = {
      first_name: document.getElementById("first-name").value.trim(),
      last_name: document.getElementById("last-name").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      city: document.getElementById("city").value.trim(),
      service_type: document.getElementById("service").value,
      message: document.getElementById("message").value.trim(),
    };

    const error = validate(data);
    if (error) {
      alert(error);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (result.success) {
        btn.textContent = "✓ Sent! We'll be in touch soon.";
        btn.style.background = "#4caf91";
        btn.disabled = true;
        form.reset();
      } else {
        alert(result.message || "Failed to send message");
      }

    } catch (err) {
      alert("Server error. Try again later.");
    }
  });
}