import { useState, useEffect } from '@wordpress/element';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function Outline({ outline, onOutlineSubmit }) {
	const [newOutline, setNewOutline] = useState([]);

	useEffect(() => {
		if (typeof outline === 'string') {
			const lines = outline.split('\n');
			const parsedOutline = lines.map((line, index) => {
				const isHeading = line.match(/^[IVXLCDM]+\./);
				return {
					id: `item-${index}`,
					text: line.trim(),
					level: isHeading ? 'h2' : 'h3',
				};
			});
			setNewOutline(parsedOutline);
		}
	}, [outline]);

	const handleDragEnd = (result) => {
		if (!result.destination) return;
		const items = Array.from(newOutline);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);
		setNewOutline(items);
	};

	const handleSubmit = () => {
		onOutlineSubmit(newOutline);
	};

	return (
		<div>
			<h2>Outline</h2>
			<DragDropContext onDragEnd={handleDragEnd}>
				<Droppable droppableId="outline">
					{(provided) => (
						<ul
							{...provided.droppableProps}
							ref={provided.innerRef}
						>
							{newOutline.map(({ id, text, level }, index) => (
								<Draggable
									key={id}
									draggableId={id}
									index={index}
								>
									{(provided) => (
										<li
											{...provided.draggableProps}
											{...provided.dragHandleProps}
											ref={provided.innerRef}
										>
											{level === 'h2' ? (
												<h2>{text}</h2>
											) : (
												<h3>{text}</h3>
											)}
										</li>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</ul>
					)}
				</Droppable>
			</DragDropContext>
			<button onClick={handleSubmit}>Submit Outline</button>
		</div>
	);
}

export default Outline;
