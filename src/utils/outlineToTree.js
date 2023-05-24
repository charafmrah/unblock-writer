/**
 * Convert outline string to tree structure.
 *
 * @param {string} outline - The outline string.
 * @returns {Object} The tree structure.
 */
function outlineToTree(outline) {
	const lines = outline.split('\n');
	let tree = [];
	let h1 = '';
	let currentSection;
	let idCounter = 0;

	lines.forEach((line) => {
		if (line.startsWith('# ')) {
			// This is an H1 element.
			h1 = line.slice(2);
		} else if (line.startsWith('## ')) {
			// This is an H2 element.
			if (currentSection) {
				tree.push(currentSection);
			}
			currentSection = {
				id: line.slice(3),
				children: [],
			};
		} else if (line.startsWith('### ')) {
			// This is an H3 element.
			if (currentSection) {
				currentSection.children.push({
					id: line.slice(4),
					children: [],
				});
			}
		}
	});

	// Push the last section into the tree.
	if (currentSection) {
		tree.push(currentSection);
	}

	return { h1, tree };
}

export default outlineToTree;
