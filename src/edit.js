/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.css';
import { useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import Error from './components/Error';
import Configuration from './components/Configuration';
import Topic from './components/Topic';
import Loading from './components/Loading';
import Outline from './components/Outline';
import Submission from './components/Submission';
import * as marked from 'marked';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit() {
	const [state, setState] = useState('CONFIGURATION');
	const [apiKey, setApiKey] = useState('');
	const [topic, setTopic] = useState('');
	const [outline, setOutline] = useState('');
	const [content, setContent] = useState('');

	const handleConfigurationSubmit = (apiKey) => {
		setApiKey(apiKey);

		setState('TOPIC');
	};

	const handleTopicSubmit = async (topic) => {
		setTopic(topic);

		// making the API call to GPT-4 to get the outline
		const outlineResponse = await fetch(
			'/wp-json/unblock-writer/v1/generate-outline',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': unblockWriter.nonce,
				},
				body: JSON.stringify({
					prompt: topic,
					apiKey: apiKey,
				}),
			}
		);

		if (!outlineResponse.ok) {
			// handle the error
			return;
		}

		const outline = await outlineResponse.json();

		// switch to the outline state and set the outline
		setOutline(outline);
		setState('OUTLINE');
	};

	const { insertBlocks } = useDispatch('core/block-editor');

	const handleOutlineSubmit = async (outline) => {
		setOutline(outline);

		// making the API call to GPT-4 to get the content
		const contentResponse = await fetch(
			'/wp-json/unblock-writer/v1/generate-content',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': unblockWriter.nonce,
				},
				body: JSON.stringify({
					outline: JSON.stringify(outline), // stringify the outline before passing it
					apiKey: apiKey,
				}),
			}
		);

		if (!contentResponse.ok) {
			// TODO: handle the error
			return;
		}

		const content = await contentResponse.json();
		// parse the markdown content into tokens
		const tokens = marked.lexer(content);

		const blocks = tokens
			.map((token) => {
				let block;
				if (token.type === 'heading') {
					block = wp.blocks.createBlock('core/heading', {
						content: token.text,
						level: token.depth,
					});
				} else if (token.type === 'paragraph') {
					block = wp.blocks.createBlock('core/paragraph', {
						content: token.text,
					});
				}
				// Add more block types based on the tokens as needed
				return block;
			})
			.filter(Boolean); // filter out undefined blocks

		// insert the blocks into the editor
		insertBlocks(blocks);

		// switch to the submission state
		// setState('SUBMISSION');
	};

	return (
		<div
			{...useBlockProps({
				className:
					'flex flex-col justify-center items-middle w-full h-full bg-slate-100 p-2 text-slate-800 rounded-md shadow-md',
			})}
		>
			{(() => {
				switch (state) {
					case 'CONFIGURATION':
						return (
							<Configuration
								onConfigurationSubmit={
									handleConfigurationSubmit
								}
							/>
						);
					case 'LOADING':
						return <Loading />;
					case 'TOPIC':
						return <Topic onTopicSubmit={handleTopicSubmit} />;
					case 'OUTLINE':
						return (
							<Outline
								outline={outline}
								onOutlineSubmit={handleOutlineSubmit}
							/>
						);
					case 'SUBMISSION':
						return <Submission />;
					default:
						return <Error />;
				}
			})()}
		</div>
	);
}
