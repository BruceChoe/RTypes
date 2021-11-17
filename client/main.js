const input = document.getElementById('fileinput');
const res = await fetch(`${baseUrl}/api/upload`, {
	method: 'POST',
	body: input.files[0]
});