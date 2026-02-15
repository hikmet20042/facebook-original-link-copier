document.addEventListener("DOMContentLoaded", () => {
	const popupRoot = document.getElementById("popupRoot");
	const statusText = document.getElementById("statusText");

	popupRoot?.classList.add("ready");

	if (statusText) {
		statusText.textContent = "Ready • Open Facebook and use Copy Original URL";
	}
});