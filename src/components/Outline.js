import { useState, useEffect } from '@wordpress/element';
import { DndContext } from '@dnd-kit/core';
import { SortableTree } from './DnD/Tree/SortableTree';
import outlineToTree from '../utils/outlineToTree';
import treeToOutline from '../utils/treeToOutline';

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
		onOutlineSubmit(h1 + '\n' + treeToOutline(newOutline));
	};

	return (
		<div>
			<h2>Outline</h2>
			<h1>{h1}</h1>
			<DndContext>
				<SortableTree
					defaultItems={newOutline}
					onChange={handleChange}
				/>
			</DndContext>
			<button
				onClick={handleSubmit}
				type="submit"
				className="w-full p-2 bg-teal-600 rounded-md hover:bg-teal-700 text-slate-100"
			>
				Generate Blog Post
			</button>
		</div>
	);
}

export default Outline;
