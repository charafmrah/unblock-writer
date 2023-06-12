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
				<div className="flex flex-col gap-2">
					<label className="cursor-text">Target Keyword</label>
					<input
						type="text"
						value={topic}
						onChange={handleInputChange}
						placeholder="Enter a topic here"
						maxLength={500}
						className="w-full"
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label className="cursor-text">Tone</label>
					<select
						name="tone"
						id="tone"
						className="max-w-full cursor-pointer w-full"
					>
						<option name="friendly" value="friendly">
							Friendly
						</option>
						<option name="professional" value="professional">
							Professional
						</option>
						<option name="expert" value="expert">
							Expert
						</option>
					</select>
				</div>
				<div className="flex flex-col gap-2">
					<label className="cursor-text">Language</label>
					<select
						name="language"
						id="language"
						className="max-w-full cursor-pointer w-full"
					>
						<option name="english" value="english">
							English
						</option>
						<option name="arabic" value="arabic">
							Arabic
						</option>
						<option name="spanish" value="spanish">
							Spanish
						</option>
						<option name="french" value="french">
							French
						</option>
						<option name="german" value="german">
							German
						</option>
						<option name="italian" value="italian">
							Italian
						</option>
						<option name="portuguese" value="portuguese">
							Portuguese
						</option>
						<option name="dutch" value="dutch">
							Dutch
						</option>
						<option name="russian" value="russian">
							Russian
						</option>
						<option name="swedish" value="swedish">
							Swedish
						</option>
						<option name="japanese" value="japanese">
							Japanese
						</option>
						<option name="chinese" value="chinese">
							Chinese
						</option>
						<option name="korean" value="korean">
							Korean
						</option>
						<option name="hindi" value="hindi">
							Hindi
						</option>
						<option name="indonesian" value="indonesian">
							Indonesian
						</option>
						<option name="turkish" value="turkish">
							Turkish
						</option>
						<option name="polish" value="polish">
							Polish
						</option>
						<option name="romanian" value="romanian">
							Romanian
						</option>
						<option name="greek" value="greek">
							Greek
						</option>
						<option name="czech" value="czech">
							Czech
						</option>
						<option name="danish" value="danish">
							Danish
						</option>
						<option name="finnish" value="finnish">
							Finnish
						</option>
						<option name="norwegian" value="norwegian">
							Norwegian
						</option>
					</select>
				</div>
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
