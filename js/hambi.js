$(document).ready(function () {
	// navigációs menü lenyitása
	$('#nav-icon3').click(function () {
		$(this).toggleClass('open');
	});
	// hamburger ikon animáció
	$("#nav-icon3").click(function () {
		$("#menu-panel").slideToggle("slow");
	});
	// index - kezdő üzenet elrejtése
	$("#canvas").click(function () {
		$("#section").hide();
	});
	$("main").click(function () {
		$("#section").hide();
	});
});


