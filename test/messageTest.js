const sendWhatsAppTemplate = async ({ accessToken, phoneNumber }) => {
  try {
    const response = await fetch(
      "https://graph.facebook.com/v25.0/1046115278592153/messages",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phoneNumber,
          type: "template",
          template: {
            name: "hello_world",
            language: {
              code: "en_US",
            },
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    console.log("Message sent:", data);
    return data;
  } catch (error) {
    console.error("Error sending WhatsApp message:", error.message);
    throw error;
  }
};

// Example usage
sendWhatsAppTemplate({
  accessToken: "EAA8Hx5kvjdsBRQyZCiuHpiPRyPbO9dMLUJ8GZCzEWzGaGWHUq5Rlhkkv3niZCJwlJhhg8oz0n7YZAPDi7MP6CZCs6JyaC3AZCeVmpLKuaRHRlCTqjaIb4QX4QBxvXQjyqKMVDdHi7VoZCQMl7CBI3ZCfiZBSGX9pbxCf61gZCeIUzGz2P1cbFAUU3TmEyCzN7VoQZDZD",
  phoneNumber: "919170599651",
});