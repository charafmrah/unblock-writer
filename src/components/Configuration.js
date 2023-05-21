import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function Configuration({ onConfigurationSubmit }) {
	const [apiKey, setApiKey] = useState('');
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
			// If there's an error, set the error message
			setErrorMessage(error.message);
		}
	};

	return (
		<div>
			<h2 className="mt-0">Set up your OpenAI API Key</h2>
			<form onSubmit={handleSubmit} className="flex flex-col gap-5">
				<label>OpenAI API Key:</label>
				<input
					type="text"
					value={apiKey}
					onChange={handleInputChange}
				/>
				<button
					type="submit"
					className="py-2 bg-teal-600 rounded-md hover:bg-teal-700 text-slate-100"
				>
					Verify Key
				</button>
				{errorMessage && (
					<p className="error text-red-500 font-bold">
						{errorMessage}
					</p>
				)}
			</form>
		</div>
	);
}
