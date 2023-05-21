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

add_action( 'init', 'create_block_unblock_writer_block_init' );
function create_block_unblock_writer_block_init() {
	register_block_type( __DIR__ . '/build' );
}

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

function generate_outline($request_data) {
    $data = $request_data->get_params();
    $body = array(
        'model' => 'gpt-3.5-turbo',
        'messages' => array(
            array(
                'role' => 'system',
                'content' => 'Create a blog post outline for this topic: ',
            ),
            array(
                'role' => 'user',
                'content' => $data['prompt'],
            ),
        ),
    );
    // Pass 'apiKey' from $data to the 'make_request_to_openai' function
    return make_request_to_openai($body, $data['apiKey']);
}

function generate_post_content($request_data) {
    $data = $request_data->get_params();
    $body = array(
        'model' => 'gpt-3.5-turbo',
        'messages' => array(
            array(
                'role' => 'system',
                'content' => 'Write a blog post based on this outline: ',
            ),
            array(
                'role' => 'user',
                'content' => $data['outline'],
            ),
        ),
    );
    // Pass 'apiKey' from $data to the 'make_request_to_openai' function
    return make_request_to_openai($body, $data['apiKey']);
}

function make_request_to_openai($body, $apiKey) {
    $headers = array(
        'Authorization' => 'Bearer ' . $apiKey,
        'Content-Type' => 'application/json',
    );
    $response = wp_remote_post(
        'https://api.openai.com/v1/engines/davinci-codex/completions',
        array(
            'method' => 'POST',
            'headers' => $headers,
            'body' => json_encode($body),
        )
    );
    if (is_wp_error($response)) {
        return $response;
    } else {
        $body = wp_remote_retrieve_body($response);
        return json_decode($body);
    }
}

add_action('rest_api_init', function () {
    register_rest_route('unblock-writer/v1', '/generate-outline', array(
        'methods' => 'POST',
        'callback' => 'generate_outline',
    ));
    register_rest_route('unblock-writer/v1', '/generate-content', array(
        'methods' => 'POST',
        'callback' => 'generate_post_content',
    ));
});
