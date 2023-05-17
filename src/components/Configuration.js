import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function Configuration( { onConfigurationSubmit } ) {
	const [ apiKey, setApiKey ] = useState( '' );

	// Fetch the saved API key when the component is mounted.
	useEffect( () => {
		apiFetch( { path: '/unblock-writer/v1/api-key' } ).then(
			( savedApiKey ) => setApiKey( savedApiKey || '' )
		);
	}, [] );

	const handleInputChange = ( event ) => {
		setApiKey( event.target.value );
	};

	const handleSubmit = ( event ) => {
		event.preventDefault();
		apiFetch( {
			path: '/unblock-writer/v1/api-key',
			method: 'POST',
			data: { apiKey },
		} );
		onConfigurationSubmit( apiKey );
	};

	return (
		<div>
			<h2 className="mt-0">Set up your OpenAI API Key</h2>
			<form onSubmit={ handleSubmit } className="flex flex-col gap-5">
				<label>OpenAI API Key:</label>
				<input
					type="text"
					value={ apiKey }
					onChange={ handleInputChange }
				/>
				<button
					type="submit"
					className="rounded-md py-2 bg-teal-600 text-slate-100"
				>
					Save
				</button>
			</form>
		</div>
	);
}
