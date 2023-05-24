// File: /src/utils/treeToOutline.js

/**
 * Convert tree structure to outline string.
 *
 * @param {Array} tree - The tree structure.
 * @returns {string} The outline string.
 */
function treeToOutline(tree) {
	let outline = '';

	tree.forEach((section) => {
		if (section.type === 'h2') {
			outline += `## ${section.text}\n`;
			section.children.forEach((item) => {
				if (item.type === 'h3') {
					outline += `- ${item.text}\n`;
				}
			});
		}
	});

	return outline;
}

export default treeToOutline;
