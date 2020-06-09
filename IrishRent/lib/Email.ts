import sgMail from "@sendgrid/mail";

const CONTACT_EMAIL = "contact@irishrent.ie";
sgMail.setApiKey(getEmailApiKey());

function getEmailApiKey() {
	const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
	if (SENDGRID_API_KEY) return SENDGRID_API_KEY;
	else throw new Error("Unable to access SENDGRID_API_KEY");
}

export async function sendFeedbackEmail(
	feedback: string,
	sentFromUrl?: string
) {
	const to = CONTACT_EMAIL;
	const from = CONTACT_EMAIL;
	const subject = "Web Feedback from Irishrent.ie";
	const html = `
    <div>
        <h1>${subject}</h1>
		<hr />
		<p><b>Feedback: </b> ${feedback}</p>
        ${sentFromUrl ? `<p><b>Sent from URL: </b> ${sentFromUrl}</p>` : ""}
	</div>`;
	const message = { to, from, subject, html };

	try {
		await sgMail.send(message);
		console.log("Feedback email successfully sent");
	} catch (error) {
		console.error(
			`Unable to send feedback email. ${JSON.stringify(
				{
					feedback,
					sentFromUrl,
					error,
				},
				null,
				2
			)}`
		);
	}
}
