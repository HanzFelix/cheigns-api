export async function numToBase62Hash(id: number, length = 8) {
	const data = new TextEncoder().encode(id.toString());
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hash = Array.from(new Uint8Array(hashBuffer));

	const base62Chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	let num = 0n;
	for (const byte of hash.slice(0, 8)) {
		// Use first 8 bytes for ~64-bit space
		num = (num << 8n) + BigInt(byte);
	}

	let result = '';
	for (let i = 0; i < length; i++) {
		result = base62Chars[Number(num % 62n)] + result;
		num = num / 62n;
	}
	return result;
}
