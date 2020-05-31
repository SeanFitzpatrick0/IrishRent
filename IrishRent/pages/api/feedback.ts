import { NextApiRequest, NextApiResponse } from "next";
import { sendFeedbackEmail } from "../../lib/Email";

export default (req: NextApiRequest, res: NextApiResponse) => {
	// Check Method
	if (req.method === "POST") {
		// Validate Body Parameters
		const body = req.body ? JSON.parse(req.body) : {};
		if (!("feedback" in body))
			return res
				.status(400)
				.end('Missing required body parameter "feedback".');
		else if (body.feedback.length === 0)
			return res
				.status(400)
				.end('Required body parameter "feedback" must not be empty.');
		else if ("sentFromUrl" in body && body.sentFromUrl.length === 0)
			return res
				.status(400)
				.end(
					'Optional body parameter "sentFromUrl" must not be empty if given.'
				);
		else {
			// Send Email
			const feedback = body.feedback;
			const sentFromUrl = body.sentFromUrl;
			sendFeedbackEmail(feedback, sentFromUrl);

			return res.status(200).end();
		}
	} 
	// Invalid Methods
	else {
		res.setHeader("Allow", ["POST"]);
		return res.status(405).end(`Method ${req.method} Not Allowed`);
	}
};
