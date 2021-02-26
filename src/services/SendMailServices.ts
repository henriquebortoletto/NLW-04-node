import nodeMailer, { Transporter } from 'nodemailer'

class SendMailServices {
	private client: Transporter

	constructor() {
		nodeMailer.createTestAccount().then(account => {
			const transporter = nodeMailer.createTransport({
				host: account.smtp.host,
				port: account.smtp.port,
				secure: account.smtp.secure,
				auth: {
					user: account.user,
					pass: account.pass,
				},
			})
			this.client = transporter
		})
	}

	async execute(to: string, subject: string, body: string) {
		const message = await this.client.sendMail({
			to,
			subject,
			html: body,
			from: 'NPS <noreplay@nps.com.br>',
		})

		console.log('Message sent: %s', message.messageId)
		// Preview only available when sending through an Ethereal account
		console.log('Preview URL: %s', nodeMailer.getTestMessageUrl(message))
	}
}

export default new SendMailServices()
