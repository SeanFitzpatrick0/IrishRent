import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_USERNAME,
		pass: process.env.EMAIL_PASSWORD,
	},
});

export function sendFeedbackEmail(
	feedback: string,
	sentFromUrl?: string
): void {
	const from = process.env.EMAIL_USERNAME;
	const to = process.env.EMAIL_USERNAME;
	const subject = "Web Feedback from Irishrent.ie";
	const html = `
    <div>
        <h1>${subject}</h1>
		<hr />
		<p><b>Feedback: </b> ${feedback}</p>
        ${sentFromUrl ? `<p><b>Sent from URL: </b> ${sentFromUrl}</p>` : ""}
    </div>`;

	transporter.sendMail({ from, to, subject, html }, (error, data) => {
		if (error)
			console.error(
				`ERROR: Unable to send feedback email.\n ${{
					feedback,
					sentFromUrl,
					error,
				}}`
			);
	});
}
