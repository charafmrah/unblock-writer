import { useState, useEffect } from '@wordpress/element';
import { DndContext } from '@dnd-kit/core';
import { SortableTree } from './DnD/Tree/SortableTree';
import outlineToTree from '../utils/outlineToTree';

function Outline({ outline, onOutlineSubmit }) {
	const [h1, setH1] = useState('');
	const [newOutline, setNewOutline] = useState([]);

	useEffect(() => {
		if (typeof outline === 'string') {
			const { h1, tree } = outlineToTree(outline);
			setH1(h1);
			setNewOutline(tree);
		}
	}, [outline]);

	const handleChange = ({ items }) => {
		setNewOutline(items);
	};

	const handleSubmit = () => {
		const outlineObject = {
			h1: h1,
			outline: newOutline,
		};
		onOutlineSubmit(outlineObject);
	};

	return (
		<>
			<h1 className="my-0">{h1}</h1>
			<div className="flex flex-col gap-5">
				<div className="text-sm text-gray-600">
					Edit the outline below to change the order of your blog
					post.
				</div>
				<div className="flex flex-col gap-3">
					<DndContext>
						<SortableTree
							defaultItems={newOutline}
							onChange={handleChange}
						/>
					</DndContext>
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
