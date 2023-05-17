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
import Configuration from './components/Configuration';
import Topic from './components/Topic';
import Loading from './components/Loading';
import Outline from './components/Outline';
import Submission from './components/Submission';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit() {
	const [ state, setState ] = useState( 'configuration' );
	const [ apiKey, setApiKey ] = useState( '' );
	const [ topic, setTopic ] = useState( '' );
	const [ outline, setOutline ] = useState( [] );
	const [ content, setContent ] = useState( '' );

	const handleConfigurationSubmit = ( apiKey ) => {
		// save apiKey
		setApiKey( apiKey );
		// switch to topic state
		setState( 'topic' );
	};

	const handleTopicSubmit = ( topic ) => {
		// save topic
		setTopic( topic );
		// switch to loading state
		setState( 'loading' );
		// here you would make the API call to GPT-4 to get the outline
		// then switch to the outline state and set the outline
	};

	const handleOutlineSubmit = ( outline ) => {
		// save the outline
		setOutline( outline );
		// switch to loading state
		setState( 'loading' );
		// here you would make the API call to GPT-4 to get the content
		// then switch to the submission state and set the content
	};

	// render the appropriate component for the current state
	return (
		<div
			{ ...useBlockProps( {
				className:
					'prose flex flex-col justify-center items-middle w-full h-full bg-slate-100 p-2 text-slate-800 rounded-md shadow-md',
			} ) }
		>
			{ ( () => {
				switch ( state ) {
					case 'CONFIGURATION':
						return (
							<Configuration
								onSuccess={ () => setState( 'TOPIC' ) }
							/>
						);
					case 'LOADING':
						return <Loading />;
					case 'TOPIC':
						return (
							<Topic onSuccess={ () => setState( 'OUTLINE' ) } />
						);
					case 'OUTLINE':
						return (
							<Outline
								onSuccess={ () => setState( 'SUBMISSION' ) }
							/>
						);
					case 'SUBMISSION':
						return (
							<Submission
								onSuccess={ () => setState( 'CONFIGURATION' ) }
							/>
						);
					default:
						return (
							<Configuration
								onSuccess={ () => setState( 'TOPIC' ) }
							/>
						);
				}
			} )() }
		</div>
	);
}
