<?php
/**
 * Plugin Name:       UnblockWriter
 * Description:       A Gutenberg block for unblocking writers through the power of ChatGPT.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Web Pangolin
 * Author URI:        https://webpangolin.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       unblock-writer
 *
 * @package           create-block
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_unblock_writer_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'create_block_unblock_writer_block_init' );

function unblock_writer_get_api_key() {
	return get_option( 'unblock_writer_api_key', '' );
}

function unblock_writer_set_api_key( WP_REST_Request $request ) {
	update_option( 'unblock_writer_api_key', $request['apiKey'] );
	return new WP_REST_Response( null, 204 );
}

add_action( 'rest_api_init', function () {
	register_rest_route( 'unblock-writer/v1', '/api-key', array(
		'methods'  => 'GET',
		'callback' => 'unblock_writer_get_api_key',
	) );
	register_rest_route( 'unblock-writer/v1', '/api-key', array(
		'methods'  => 'POST',
		'callback' => 'unblock_writer_set_api_key',
		'args'     => array(
			'apiKey' => array(
				'required'          => true,
				'validate_callback' => function ( $param ) {
					return is_string( $param );
				},
			),
		),
	) );
} );