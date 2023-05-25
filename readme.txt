=== UnblockWriter ===
Contributors:      Web Pangolin
Tags:              Gutenberg, Block, AI, Writing, OpenAI
Tested up to:      6.1
Stable tag:        0.1.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A WordPress Gutenberg block plugin that helps writers overcome writer's block by using the power of OpenAI's ChatGPT.

== Description ==

Unblock Writer is a plugin designed to utilize the power of OpenAI's ChatGPT, providing an intuitive and streamlined writing experience. This tool offers an interactive interface within a Gutenberg block, designed to guide users through an AI-assisted writing process.

How the Plugin Works:

- Add the Unblock Writer Block: Users add the "Unblock Writer" Gutenberg block to their post.
- Configuration: Inside the block, users input their OpenAI API key (if not already stored) and enter a topic into a text field.
- Generate an Outline: Upon submitting the topic, the plugin makes an API call to ChatGPT, which generates an outline based on the chosen topic. The outline is presented within the block as draggable cards containing H2 & H3 headers.
- Modify and Finalize the Outline: Users can rearrange the outline's structure by dragging the cards. Once satisfied, they submit the final outline.
- Generate the Content: The plugin sends the finalized outline to ChatGPT via another API call, receiving the fleshed-out content in response.
- Insert the Content: The received content is programmatically inserted into the post as native Gutenberg blocks (header and paragraph blocks).

Unblock Writer's goal is to make the blog writing process smoother and more efficient by reducing the initial effort required to create an outline and comprehensive content. By managing different states (configuration, loading, outline, and submission) using React's useState hook, Unblock Writer ensures a user-friendly experience with an appropriate UI for each state.

== Installation ==

1.Activate the plugin through the 'Plugins' screen in WordPress
1. Upload unblock-writer to the /wp-content/plugins/ directory.
2. Activate the plugin through the 'Plugins' menu in WordPress.
3. Navigate to a post and click 'Add Block'. Search for 'Unblock Writer' and add the block to your post.
4. Enter your OpenAI API key and the topic you wish to write about. The plugin will guide you through the rest of the process.


== Frequently Asked Questions ==

= Does this plugin work with the latest version of WordPress? =

Yes, Unblock Writer is fully compatible with the latest version of WordPress.

= Do I need an OpenAI API key to use this plugin? =

Yes, you will need an OpenAI API key to use Unblock Writer as it relies on the ChatGPT model to generate outlines

== Screenshots ==

1. This screen shot description corresponds to screenshot-1.(png|jpg|jpeg|gif). Note that the screenshot is taken from
the /assets directory or the directory that contains the stable readme.txt (tags or trunk). Screenshots in the /assets
directory take precedence. For example, `/assets/screenshot-1.png` would win over `/tags/4.3/screenshot-1.png`
(or jpg, jpeg, gif).
2. This is the second screen shot

== Changelog ==

= 0.1.0 =
* Release
