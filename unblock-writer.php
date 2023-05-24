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

add_action( 'init', 'create_block_unblock_writer_block_init' );
function create_block_unblock_writer_block_init() {
	register_block_type( __DIR__ . '/build' );
}

function unblock_writer_get_api_key() {
    return get_option( 'unblock_writer_api_key', '' );
}

function unblock_writer_set_api_key( WP_REST_Request $request ) {
    $apiKey = $request['apiKey'];
    $testBody = array(
        'model' => 'gpt-3.5-turbo',
        'messages' => array(
            array(
                'role' => 'system',
                'content' => 'You are a helpful assistant.',
            ),
            array(
                'role' => 'user',
                'content' => 'Who are you?',
            ),
        ),
    );
    $testResponse = make_request_to_openai($testBody, $apiKey);
    
    // If there's an error or the API key isn't working, return an error response
    if (is_wp_error($testResponse) || $testResponse->error) {
        return new WP_Error( 'bad_api_key', 'The provided API key is invalid or not working.', array( 'status' => 400 ) );
    }
    
    // If the test request is successful, save the API key
    update_option( 'unblock_writer_api_key', $apiKey );
    return new WP_REST_Response( null, 204 );
}

function generate_outline($request_data) {
    $data = $request_data->get_params();
    $body = array(
        'model' => 'gpt-3.5-turbo',
        'messages' => array(
            array(
                'role' => 'system',
                'content' => 'Create a blog post headers outline for this topic (use and return markdown headers only, NO BULLET POINTS, only headers). Only return H2, H3 and H4 level headers with no explanations. Again, only return markdown headers in the form # (H1 title), ## (for H2), and ### (for H3) ONLY, no bullet points. If the topic is vague, return an outline for a closely related topic: ',
            ),
            array(
                'role' => 'user',
                'content' => $data['prompt'],
            ),
        ),
    );
    return make_request_to_openai($body, $data['apiKey']);
}

function generate_post_content($request_data) {
    $data = $request_data->get_params();
    $body = array(
        'model' => 'gpt-3.5-turbo',
        'messages' => array(
            array(
                'role' => 'system',
                'content' => 'Write a blog post based on this outline (use markdown): ',
            ),
            array(
                'role' => 'user',
                'content' => $data['outline'],
            ),
        ),
    );
    return make_request_to_openai($body, $data['apiKey']);
}

function make_request_to_openai($body, $apiKey) {
    $headers = array(
        'Authorization' => 'Bearer ' . $apiKey,
        'Content-Type' => 'application/json',
    );
    $response = wp_remote_post(
        'https://api.openai.com/v1/chat/completions',
        array(
            'method' => 'POST',
            'headers' => $headers,
            'body' => json_encode($body),
            'timeout' => 60,
        )
    );
    if (is_wp_error($response)) {
        return $response;
    } else {
        $body = wp_remote_retrieve_body($response);
        $parsedBody = json_decode($body);
        // If the response from OpenAI is correctly structured
    if (isset($parsedBody->choices[0]->message->content)) {
        return $parsedBody->choices[0]->message->content;
    } else {
        return new WP_Error( 'unexpected_response', 'The response from OpenAI was not in the expected format.', array( 'status' => 500 ) );
    }
}
}

function unblock_writer_permissions_check() {
    // Here 'publish_posts' capability allows admins, editors, and authors.
    return current_user_can( 'publish_posts' );
}

add_action( 'init', 'enqueue_unblock_writer_script' );
function enqueue_unblock_writer_script() {
    $script_path = 'build/index.js';
    wp_register_script(
        'unblock-writer-script',
        plugins_url($script_path, __FILE__),
        array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-data', 'wp-i18n'),
        filemtime(plugin_dir_path(__FILE__) . $script_path)
    );
    wp_localize_script(
        'unblock-writer-script',
        'unblockWriter',
        array(
            'nonce' => wp_create_nonce( 'wp_rest' ),
        )
    );
    register_block_type('unblock-writer/unblock-writer-block', array(
        'editor_script' => 'unblock-writer-script',
    ));
}


add_action( 'rest_api_init', function () {
    register_rest_route( 'unblock-writer/v1', '/api-key', array(
        'methods'  => 'GET',
        'callback' => 'unblock_writer_get_api_key',
        'permission_callback' => 'unblock_writer_permissions_check',  
    ));

    register_rest_route( 'unblock-writer/v1', '/api-key', array(
         'methods'  => 'POST',
        'callback' => 'unblock_writer_set_api_key',
        'permission_callback' => 'unblock_writer_permissions_check',  
        'args'     => array(
            'apiKey' => array(
                'required'          => true,
                'validate_callback' => function ( $param ) {
                    return is_string( $param );
                },
            ),
        ),
    ));

    register_rest_route('unblock-writer/v1', '/generate-outline', array(
        'methods' => 'POST',
        'callback' => 'generate_outline',
        'permission_callback' => 'unblock_writer_permissions_check',  
    ));

    register_rest_route('unblock-writer/v1', '/generate-content', array(
        'methods' => 'POST',
        'callback' => 'generate_post_content',
        'permission_callback' => 'unblock_writer_permissions_check',  
    ));
});
