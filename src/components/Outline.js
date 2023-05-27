import { useState, useEffect, useRef } from '@wordpress/element';
import { DndContext } from '@dnd-kit/core';
import { SortableTree } from './DnD/Tree/SortableTree';
import outlineToTree from '../utils/outlineToTree';

function Outline({ outlineString, onOutlineSubmit }) {
	const [h1, setH1] = useState('');
	const [outline, setOutline] = useState([]);
	const newHeadingRef = useRef(null);

	useEffect(() => {
		if (typeof outlineString === 'string') {
			const { h1, tree } = outlineToTree(outlineString);
			setH1(h1);
			setOutline(tree);
		}
	}, []);

	const handleSubmit = () => {
		const outlineObject = {
			h1: h1,
			outline: outline,
		};
		console.log(outline);
		onOutlineSubmit(outlineObject);
	};

	const handleNewHeading = (e) => {
		e.preventDefault();
		// Add a new heading to the outline
		const newHeadingValue = newHeadingRef.current.value;
		const newHeading = {
			id: newHeadingValue,
			children: [],
		};
		setOutline([...outline, newHeading]);
		newHeadingRef.current.value = ''; // Clear the input field
	};

	return (
		<>
			<h1 className="my-0">{h1}</h1>
			<div className="flex flex-col gap-5">
				<div className="text-sm text-gray-600">
					Edit the outline below to change the order of your blog
					post.
				</div>
				<div className="flex flex-col">
					<DndContext>
						<SortableTree
							outline={outline}
							setOutline={setOutline}
							removable={true}
							indicator={true}
						/>
					</DndContext>
					<form className="mt-3 mb-6">
						<label className="text-sm text-gray-600">
							Add a new heading
						</label>
						<div className="grid grid-cols-4 gap-5">
							<input
								type="text"
								className="w-full col-span-3 p-2 border border-gray-300 rounded-md"
								ref={newHeadingRef}
							/>
							<button
								onClick={handleNewHeading}
								className="w-full p-2 bg-teal-500 rounded-md hover:bg-teal-600 text-slate-100"
							>
								Add Heading
							</button>
						</div>
					</form>
				</div>
			</div>
			<button
				onClick={handleSubmit}
				type="submit"
				className="w-full p-2 bg-blue-500 rounded-md hover:bg-blue-600 text-slate-100"
			>
				Generate Blog Post
			</button>
		</>
	);
}

export default Outline;
