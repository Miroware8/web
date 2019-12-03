if (testEmail(this.req.body.email)) {
	const user = await users.findOne({
		email: this.req.body.email.trim().toLowerCase()
	});
	if (user) {
		if (user.emailCode) {
			verifyEmail(user, this.update.$set);
		} else {
			this.value = {
				error: "You cannot resend verification if your email is already verified."
			};
			this.status = 422;
		}
	} else {
		this.value = {
			error: "That email is not registered."
		};
		this.status = 422;
	}
} else {
	this.value = {
		error: "That is not a valid email."
	};
	this.status = 400;
}
this.done();