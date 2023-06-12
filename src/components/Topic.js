import { useState } from '@wordpress/element';
import Loading from './Loading';

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
		<>
			<h2 className="mt-0">Topic Selection</h2>
			<form onSubmit={handleSubmit} className="flex flex-col gap-5">
				<label className="cursor-text">Target Keyword</label>
				<input
					type="text"
					value={topic}
					onChange={handleInputChange}
					placeholder="Enter a topic here"
					maxLength={500}
				/>
				<button
					type="submit"
					className="p-2 bg-blue-500 rounded-md hover:bg-blue-600 text-slate-100"
				>
					Generate Outline
				</button>
			</form>
		</>
	);
}
