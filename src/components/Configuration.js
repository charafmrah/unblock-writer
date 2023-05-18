import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function Configuration({ onConfigurationSubmit }) {
	const [apiKey, setApiKey] = useState('');

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
		const response = await fetch('/wp-json/unblock-writer/v1/openai', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				apiKey: apiKey,
				prompt: 'Test prompt',
			}),
		})
			.then((res) => {
				// TODO: If API Key is valid, save it

				onConfigurationSubmit(apiKey);
			})
			.catch((err) => {
				throw new Error(err);
			});
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
					Save
				</button>
			</form>
		</div>
	);
}
