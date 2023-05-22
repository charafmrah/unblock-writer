import { useState } from '@wordpress/element';

export default function Topic({ onTopicSubmit }) {
	const [topic, setTopic] = useState('');

	const handleInputChange = (event) => {
		setTopic(event.target.value);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		onTopicSubmit(topic);
	};

	return (
		<div>
			<h2 className="mt-0">Topic Selection</h2>
			<form onSubmit={handleSubmit} className="flex flex-col gap-5">
				<label>What is your blog post about?</label>
				<input type="text" value={topic} onChange={handleInputChange} />
				<button
					type="submit"
					className="p-2 bg-teal-600 rounded-md hover:bg-teal-700 text-slate-100"
				>
					Generate Outline
				</button>
			</form>
		</div>
	);
}
