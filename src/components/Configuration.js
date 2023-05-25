import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function Configuration({ onConfigurationSubmit }) {
	const [apiKey, setApiKey] = useState('');
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null); // Add a state for error message

	// Fetch the saved API key when the component is mounted.
	useEffect(() => {
		apiFetch({ path: '/unblock-writer/v1/api-key' }).then((savedApiKey) =>
			setApiKey(savedApiKey || '')
		);
	}, []);

	const handleInputChange = (event) => {
		setApiKey(event.target.value);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setLoading(true);
		setErrorMessage(null);
		// make a request to your own server to test the API key
		try {
			const response = await fetch('/wp-json/unblock-writer/v1/api-key', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': unblockWriter.nonce,
				},
				body: JSON.stringify({
					apiKey: apiKey,
					prompt: 'Test prompt',
				}),
			});
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(`Error: ${errorData.message}`);
			}
			// if no error, call the callback function
			onConfigurationSubmit(apiKey);
		} catch (error) {
			setLoading(false);
			setErrorMessage(error.message);
		}
	};

	return (
		<>
			<h2 className="mt-0">Connect ChatGPT</h2>
			<form onSubmit={handleSubmit} className="flex flex-col gap-5">
				{errorMessage && (
					<p className="error text-red-500 font-bold">
						{errorMessage}
					</p>
				)}
				<label htmlFor="api-key" className="cursor-text">
					Insert your OpenAI API key:
				</label>
				<input
					type="text"
					value={apiKey}
					onChange={handleInputChange}
					name="api-key"
					placeholder="sk-XXXXXXXXXXXXXXX"
				/>
				{!loading ? (
					<button
						type="submit"
						className="py-2 bg-blue-500 rounded-md hover:bg-blue-600 text-slate-100"
					>
						Verify Key
					</button>
				) : (
					<button
						className="py-2 bg-gray-950 rounded-md  text-slate-100"
						disabled
					>
						Verifying...
					</button>
				)}
			</form>
		</>
	);
}
