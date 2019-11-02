function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log(profile.getEmail());
}