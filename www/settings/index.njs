if(notLoggedIn(this)) {
	return;
}
this.title = "Settings";
this.description = "Set your settings.";
this.tags = ["settings", "preferences", "account", "user"];
this.value = (await load("www/load/head", this)).value;
/*this.value += html`
		<link rel="stylesheet" href="index.css">`;*/
this.value += (await load("www/load/body", this)).value;
const user = await users.findOne({
	_id: this.req.session.user
});
this.value += html`
			<div id="content">
				<form id="settings">
					<div class="mdc-text-field mdc-text-field--disabled">
						<input name="email" class="mdc-text-field__input" type="email" value="$${user.email}" required disabled>
						<label class="mdc-floating-label alwaysfloat" for="email">Email</label>
						<div class="mdc-line-ripple"></div>
					</div><button class="mdc-fab mdc-fab--mini material-icons editfield spaced">
						<span class="mdc-fab__icon">edit</span>
					</button><br>
					<div class="mdc-text-field mdc-text-field--disabled">
						<input name="username" class="mdc-text-field__input" type="text" value="$${user.name}" maxlength="32" required disabled>
						<label class="mdc-floating-label" for="username">Username</label>
						<div class="mdc-line-ripple"></div>
					</div><button class="mdc-fab mdc-fab--mini material-icons editfield spaced">
						<span class="mdc-fab__icon">edit</span>
					</button><br>
					<div class="mdc-text-field mdc-text-field--disabled">
						<input name="birthday" class="mdc-text-field__input" type="date" value="${inputDate(new Date(user.birth))}" max="${inputDate(new Date())}" required disabled>
						<label class="mdc-floating-label alwaysfloat" for="birthday">Birthday</label>
						<div class="mdc-line-ripple"></div>
					</div><button class="mdc-fab mdc-fab--mini material-icons editfield spaced">
						<span class="mdc-fab__icon">edit</span>
					</button>
				</form>
			</div>`;
this.value += (await load("www/load/belt", this)).value;
this.value += html`
		<script src="index.js"></script>`;
this.value += (await load("www/load/foot", this)).value;
this.done();
