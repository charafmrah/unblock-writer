import { useState } from '@wordpress/element';

export default function Topic( { onTopicSubmit } ) {
	const [ topic, setTopic ] = useState( '' );

	const handleInputChange = ( event ) => {
		setTopic( event.target.value );
	};

	const handleSubmit = ( event ) => {
		event.preventDefault();
		onTopicSubmit( topic );
	};

	return (
		<div>
			<h2 className="mt-0">What topic do you want to write about?</h2>
			<form onSubmit={ handleSubmit } className="flex flex-col gap-5">
				<label>Topic:</label>
				<input
					type="text"
					value={ topic }
					onChange={ handleInputChange }
				/>
				<button
					type="submit"
					className="rounded-md py-2 bg-teal-600 text-slate-100"
				>
					Submit
				</button>
			</form>
		</div>
	);
}
