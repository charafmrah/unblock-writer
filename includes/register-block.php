add_action( 'init', 'create_block_unblock_writer_block_init' );
function create_block_unblock_writer_block_init() {
    register_block_type( __DIR__ . '/../build' );
}