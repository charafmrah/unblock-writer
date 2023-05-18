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

function unblock_writer_get_api_key() {
    return get_option( 'unblock_writer_api_key', '' );
}

function unblock_writer_set_api_key( WP_REST_Request $request ) {
    update_option( 'unblock_writer_api_key', $request['apiKey'] );
    return new WP_REST_Response( null, 204 );
}
