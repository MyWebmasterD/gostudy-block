<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * `wp-blocks`: includes block type registration and related functions.
 *
 * @since 1.0.0
 */
function gostudy_block_cgb_block_assets() {
	// Styles.
	wp_enqueue_style(
		'gostudy_block-cgb-style-css', // Handle.
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
		array( 'wp-blocks' ) // Dependency to include the CSS after it.
		// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: filemtime — Gets file modification time.
	);
} // End function gostudy_block_cgb_block_assets().

// Hook: Frontend assets.
add_action( 'enqueue_block_assets', 'gostudy_block_cgb_block_assets' );

/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * `wp-blocks`: includes block type registration and related functions.
 * `wp-element`: includes the WordPress Element abstraction for describing the structure of your blocks.
 * `wp-i18n`: To internationalize the block's text.
 *
 * @since 1.0.0
 */
function gostudy_block_cgb_editor_assets() {
	// Scripts.
	wp_enqueue_script(
		'gostudy_block-cgb-block-js', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-editor','wp-blocks', 'wp-i18n', 'wp-element' ), // Dependencies, defined above.
		// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: filemtime — Gets file modification time.
		true // Enqueue the script in the footer.
	);

	// Styles.
	wp_enqueue_style(
		'gostudy_block-cgb-block-editor-css', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ) // Dependency to include the CSS after it.
		// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' ) // Version: filemtime — Gets file modification time.
	);
	$types_taxonomy = array();
	$types_raw = get_post_types( array( 'public' => true ), 'objects' );
    $types[] = array(
		'label' => '',
		'value' =>  null 
	);
    foreach( $types_raw as $type ) {
        // Avoid WooCommerce Products CPT
        if( $type->name == "product") {
            continue;
		}
		$taxonomy_objects_raw = get_object_taxonomies( $type->name , 'objects');
		
		
		$types_taxonomy[$type->name] = array(array("label" => "", "value" => null), array("label" => "none", "value" => "none"));
		foreach($taxonomy_objects_raw as $tax_object){
			$types_taxonomy[$type->name][] = array(
				
				'label' => $tax_object->label,
				'value' => $tax_object->name
			);
			
		}
        $types[] = array(
            'label' => $type->label,
			'value' =>  $type->name 
        );
	}
	$taxonomies_raw = get_taxonomies(array(),'objects'); 
	//var_dump($taxonomies_raw);
	$taxonomies = array();
	$terms["none"][] = array(
				
		'label' => '',
		'value' => null
	);
	$terms["none"][] = array(
				
		'label' => 'Any',
		'value' => '0'
	);
	foreach ( $taxonomies_raw as $taxonomy ) {
		if( $taxonomy->name == "nav_menu" || $taxonomy->name == 'link_category' || $taxonomy->name == 'post_format') {
            continue;
        }
		$taxonomies[] = array(
			'label' => $taxonomy->labels->name,
			'value' => $taxonomy->name
		); 
		$terms_raw = get_terms( $taxonomy->name, array(
			'hide_empty' => true,
		) );
		$terms[$taxonomy->name][] = array(
				
			'label' => '',
			'value' => null
		);
		$terms[$taxonomy->name][] = array(
				
			'label' => 'Any',
			'value' => '0'
		);
		foreach($terms_raw as $term){
			$terms[$taxonomy->name][] = array(
				
				'label' => $term->name,
				'value' => $term->term_id
			);
		}
		//$terms[$taxonomy->name] = $terms_raw;
	}
	
    wp_localize_script(
        'gostudy_block-cgb-block-js',
        'gostudyAdminData',
        array(
			'types' => json_encode( $types ),
			'taxonomies' => json_encode( $taxonomies ),
			'terms' => json_encode( $terms ),
			'types_taxonomy' => json_encode($types_taxonomy)
        )
	);
	wp_enqueue_script( 'cgb' );


} // End function gostudy_block_cgb_editor_assets().

// Hook: Editor assets.
add_action( 'enqueue_block_editor_assets', 'gostudy_block_cgb_editor_assets' );




function gostudy_block_init() {
    register_block_type( 'cgb/gostudy-custom-post', array(
		'render_callback' => 'gostudy_custom_post_render_block',
	) );
	register_block_type( 'cgb/gostudy-banner', array(
		'render_callback' => 'gostudy_banner_block_render_block',
	) );
	register_block_type( 'cgb/gostudy-course-card', array(
		'render_callback' => 'gostudy_course_card_render_block',
	) );
	register_block_type( 'cgb/gostudy-id-card', array(
		'render_callback' => 'gostudy_id_card_render_block',
	) );
	register_block_type( 'cgb/gostudy-event-card', array(
		'render_callback' => 'gostudy_event_card_render_block',
	) );
	register_block_type( 'cgb/gostudy-graph-block', array(
		'render_callback' => 'gostudy_graph_block_render_block',
	) );
	register_block_type( 'cgb/gostudy-timeline-element-block', array(
		'render_callback' => 'gostudy_timeline_element_block_render_block',
	) );
}
add_action( 'init', 'gostudy_block_init' );

function gostudy_timeline_element_block_render_block( $attributes, $content ) {
	$content = preg_split('/<div class="timeline__body__childrens">/i', $content);
	ob_start();
	//var_dump($attributes);
	//echo 'test blocco timeline';
	?>
	<div class="container timeline-block-element timeline-block-<?php echo (!empty($attributes['alignement'])) ? $attributes['alignement'] : 'left' ; ?>" >
		<div class="row jusitfy-content-center">
			<div class="col-10">
				<div class="row align-items-center">
					<div class="col-5 px-0">
						<?php if(!empty($attributes['imageUrl'])){ ?>
							<div class="shadow py-3 px-3">
								<img src="<?php echo $attributes['imageUrl'];?>">
							</div>
						<?php } ?>
					
					</div>
					<div class="col-2">
						<div class="square rounded-circle">
							<?php if(!empty($content[0]) && !empty($content[1])){ ?>
								<?php echo $content[0];?>
							<?php } ?>
						</div>
					</div>
					<div class="col-5">
						<?php if(!empty($attributes['kicker'])){ ?>
						<div><label class="text-secondary"><?php echo $attributes['kicker'];?></label></div>
						<?php } ?>
						<?php if(!empty($attributes['title'])){ ?>
						<h4 class="text-info text-uppercase"><?php echo $attributes['title'];?></h4>
						<?php } ?>
						<?php if(!empty($content[0]) && !empty($content[1])){ 
							echo '<div class="wp-block-cgb-gostudy-timeline-element-block timeline__body__childrens">'.$content[1];
						}else{
							echo $content[0];
						} ?>
					</div>
				</div>
			</div>
		</div>
	</div>
	<?php 
		//echo $content;
	$page = ob_get_contents();
	ob_end_clean();
	return $page;
}

function gostudy_graph_block_render_block( $attributes, $content ) {
	
	ob_start();
	//echo 'test blocco grafici';
	?>
	<?php 
	$page = ob_get_contents();
	ob_end_clean();
	return $page;
}

function gostudy_id_card_render_block( $attributes, $content ) {
	
	ob_start();
	?>
	<div class="id-card-block " style="background: url(<?php the_field_img('id_background');?>)">
	<div class="container ">
		<div class="row">
			<div class="col-12 pt-9 bg-dark id-card-block-inner-bg" style="background: url(<?php the_field_img('id_inner_background');?>)">
				<div class="row justify-content-center">
					<div class="col-md-9">
						<?php if(!empty(get_field('id_kicker')) || !empty(get_field('id_kicker')) ){ ?>
						<div class="id-card-intro text-center bg-primary py-2">
							<div class="row flex-column flex-nowrap flex-md-row justify-content-center align-items-center">
								<?php if(!empty(get_field('id_kicker'))){ ?>
								<div class="col-md-6 h6 text-white mb-0 text-center <?php echo (!empty(get_field('id_kicker'))) ? 'text-md-right' : '';?>"><?php the_field('id_kicker')?></div>
								<?php } ?>
								<?php if(!empty(get_field('id_kicker'))){ ?>
								<div class="col-md-6 h2 text-white mb-0 m-1 text-center <?php echo (!empty(get_field('id_kicker'))) ? 'text-md-left' : '';?>"><?php the_field('id_title')?></div>
								<?php } ?>
							</div>
						</div>
						<?php } ?>
						<?php if(!empty(get_field('id_items')) || !empty(get_field('id_image')) ){ ?>
						<div class="id-card-body bg-white pt-3 pb-5">
							<div class="row">
								<?php if(!empty(get_field('id_image'))){?>
								<div class="col-12 col-md-3">
									<div class="id-card-image">
										<div class="id-card-image-inner square" style="background: url(<?php the_field_img('id_image'); ?>);"></div>
									</div>
								</div>
								<?php } ?>
								<?php if(!empty(get_field('id_items'))){?>
								<div class="col-12 <?php echo (!empty(get_field('id_image'))) ? 'col-md-9' : ''; ?>">
									<?php foreach(get_field('id_items') as $k => $v){?>
									<div class="d-flex flex-wrap mb-1">
										<?php if(!empty($v['item_title'])){?>
											<div class="my-1 col-md-4 pr-md-0 text-center text-md-left">
												<span class="btn btn-outline-primary btn-no-hover text-center text-md-left"><?php echo $v['item_title']; ?></span>
											</div>
										<?php } ?>
										<div class="my-1 text-center text-md-left <?php echo (empty($v['item_title'])) ? 'col-12' : 'col-md-8'; ?>">
											<?php if(count($v['item_contet']) == 1){ 
												//var_dump($v['item_contet']);
												echo $v['item_contet'][0]['content'];
											} else {
												echo '<ul>';
												foreach($v['item_contet'] as $k2 => $v2){ ?>
													<li>
														<?php echo $v2['content']; ?>
													</li>
												<?php }
												echo '</ul>';
											}
											?>
										</div>
									</div>
									
									<?php } ?>
								</div>
								<?php } ?>
							</div>
						</div>
						<?php } ?>
					</div>
				</div>
			</div>
			<div class="col-12 bg-secondary id-footer">
				<div class="row pb-4">
					<div class="col-md-6 pt-4 text-center">
						<div class="id-footer-bg square bg-info"></div>
						<div class="id-footer-bg-inner square border border-secondary"></div>
						<div class="absolute-circle bg-secondary square"></div>
						<div class="absolute-circle-2 square"></div>
						<div class="position-relative">
							<?php if(!empty(get_field('id_footer_kicker'))){ ?>
							<h5 class="text-white"><?php the_field('id_footer_kicker');?></h5>
							<?php } ?>
							<?php if(!empty(get_field('id_footer_title'))){ ?>
							<h3 class="text-white"><?php the_field('id_footer_title');?></h3>
							<?php } ?>
						</div>
					</div>
					<div class="col-md-6 pt-4">
						<?php if(!empty(get_field('id_footer_list_title'))){ ?>
							<h4 class="text-white text-center text-md-left text-uppercase"><?php the_field('id_footer_list_title');?></h4>
						<?php } ?>
						<?php if(!empty(get_field('id_footer_list'))){ ?>
							<ul class="id-footer-list">
							<?php foreach(get_field('id_footer_list') as $k => $v){?>
								<li class="text-white">
									
									<?php echo $v['content']; ?>
								</li>
							<?php } ?>
							</ul>
						<?php } ?>
					</div>
				</div>
				
			</div>
		</div>
	</div>
	</div>
	<?php 
	$page = ob_get_contents();
	ob_end_clean();
	return $page;
}

function convertDateToTimestamp($date){
	
	$d = DateTime::createFromFormat('d/m/Y g:i a',$date);
	//var_dump($d->format('U'));
	//exit;
	return $d->format('U');
}
function convertEventDate($date){
	
	$d = DateTime::createFromFormat('d/m/Y g:i a',$date);
	//var_dump($d->format('U'));
	//exit;
	return $d->format('d M Y');
}
function convertEventTime($date){
	
	$d = DateTime::createFromFormat('d/m/Y g:i a',$date);
	//var_dump($d->format('U'));
	//exit;
	return $d->format('g:i a');
}
function convertDateToIcsFormat($date){
	
	$d = DateTime::createFromFormat('d/m/Y g:i a',$date);
	//var_dump($d->format('U'));
	//exit;
	return $d->format('U');
}

function gostudy_event_card_render_block( $attributes, $content ) {
	global $wp;
	$url = home_url( $wp->request );
	ob_start();
	//echo 'test blocco event card';
	//echo '<pre>';
	//var_dump(get_option( 'ACFGS_icon_data' ));
	//echo '</pre>';
	?>
	<div class="event-course-card-wrapper" style="background: url(<?php the_field_img('event_bg') ?>)">
		<div class="event-course-card-gradient" style="background-image: linear-gradient(-1deg, rgba(238,238,238,0.00) 22%, #FFFFFF 56%);"></div>
		<div class="container" >
			<div class="row justify-content-center">
				<div class="col-10">
					<?php 
					if(!empty(get_field('event_heading'))){
						?>
						<div class="bg-secondary py-2">
							<div class="row">
								<div class="col-12 text-center">
									<h6 class="text-white mb-0"><?php the_field('event_heading'); ?></h6>
								</div>
							</div>
						</div>
						<?php
					}
					if(!empty(get_field('event_title')) || !empty(get_field('event_features'))){
						?>
						<div class="event-course-card-header pt-4">
							<div class="event-course-card-header-bg" style="background-image: url(<?php echo ($innerBg = get_field_img('event_inner_bg')) ? $innerBg : get_global_option_img('default_post_image'); ?>)" ></div>
							<div class="row justify-content-center">
								<div class="col-10">
									<?php
										if(!empty(get_field('event_title'))){

											echo '<h3 class="text-center text-uppercase text-dark-cyan">'.get_field('event_title').'</h3>';
										}
									?>
								</div>
								<div class="col-10 mt-3">
									<?php if(!empty(get_field('event_features'))){ ?>
										<div class="event-course-card-header-features row justify-content-center">
											<?php foreach(get_field('event_features') as $k => $v){ ?>
												<div class="col-md-3 mb-4">
													<div class="event-course-card-icon"><svg version="1.1" viewBox="0 0 24 24"><?php echo str_ireplace('classname','class', $v['icon']);?></svg></div>
													<div class="bg-primary py-1">
														<div class="col-12 text-center">
															<h6 class="text-white mb-0"><?php echo $v['title'];?></h6>
														</div>
													</div>
													<?php if(!empty($v['content']) ){?>
													<div class="bg-white py-2">
														<div class="col-12 text-center">
															<?php echo $v['content'];?>
														</div>
													</div>
													<?php } ?>
													
												</div>
											<?php } ?>
										</div>
									<?php } ?>
								</div>
							</div>
						</div>
						<?php
					}
					$positions = array();
					if(!empty(get_field('event_content'))){
						?>
						<div class="bg-white">
							<?php foreach(get_field('event_content') as $k => $v){
								//var_dump($v['place']);
								if(!empty($v['place']['lat']) && !empty($v['place']['lng'])){
									$positions[] = $v['place'];
								}
								?>
							<div class="row justify-content-center pt-6">
								<div class="col-10">
									<div class="row align-items-center event-course-card-content-left-<?php echo $v['icon_title_color']; ?> mb-3">
										<div class="col-md-3">
											<div class="event-course-card-icon"><svg version="1.1" viewBox="0 0 24 24"><?php echo str_ireplace('classname','class', $v['icon']);?></svg></div>
											
										</div>
										<div class="col-md-9">
											<h4 class="event-course-card-title"><?php echo $v['title']; ?></h4>
											<div class="h5"><?php echo $v['content_text']; ?></div>
											<div class="h5">
												<?php if(!empty($v['content_list'])){?>
												<ul class="list-columns-<?php echo $v['content_list_columns'];?> list-icon-<?php echo $v['content_list_icon'];?> list-icon-color-<?php echo $v['content_icon_color'];?>">
													<?php foreach( $v['content_list'] as $k2 => $v2){?>
														<li>
															<?php if(!empty($v2['link'])){ ?>
																<a href="<?php echo $v2['link']; ?>">
															<?php } ?>
															<?php echo $v2['text'];?>
															<?php if(!empty($v2['link'])){ ?>
																</a>
															<?php } ?>
														</li>
													<?php } ?>
												</ul>
												<?php } ?>
												<div class="row">
													<div class="col-6">
														
														<a href="/ics/?location=<?php echo urlencode($v['place']['address']); ?>&description=<?php echo urlencode(substr($v['content_text'],0,70)); ?>&summary=<?php echo urlencode(substr(get_field('event_title'),0,70)); ?>&dtstart=@<?php echo urlencode(convertDateToTimestamp($v['start_date'])); ?>&dtend=@<?php echo urlencode(convertDateToTimestamp($v['end_date'])); ?>&url=<?php echo urlencode($url); ?>">iCal</a>
														
													</div>
												</div>
											</div>
										</div>
									</div>
									
								</div>
							</div>
							<?php } ?>
						</div>
						<?php
					}
					?>
					<?php if(!empty($positions)){ ?>
					<div id="event-map"></div>
					<script>
						mapWillUpdate = null;
						//google.maps.event.addDomListener(window, 'load', initMap);
						var map;
						var locations = [
							<?php foreach($positions as $k => $v){?>
							['<?php echo urlencode($v['address']);?>', <?php echo urlencode($v['lat']);?>, <?php echo urlencode($v['lng']);?>, <?php echo urlencode($k);?>],
							<?php } ?>
							
							
						];
						function initMap() {
							//console.log('init');
							if (typeof google === "undefined"){
								return null;
							}else{
								clearInterval(mapWillUpdate);
							}
							map = new google.maps.Map(document.getElementById('event-map'), {
								center: {
									lat: -25.237388,
									lng: 134.182564
								},
								maxZoom: 16, 
								zoom: 4,
								disableDefaultUI: true
							});

							var infowindow = new google.maps.InfoWindow({});
							
							var markerBounds = new google.maps.LatLngBounds();
							var marker, i;

							for (i = 0; i < locations.length; i++) {
								markerPoint = new google.maps.LatLng( locations[i][1], locations[i][2]);
								marker = new google.maps.Marker({
									position: markerPoint,
									map: map
								});
								markerBounds.extend(markerPoint);

								google.maps.event.addListener(marker, 'click', (function (marker, i) {
									return function () {
										infowindow.setContent(locations[i][0]);
										infowindow.open(map, marker);
									}
								})(marker, i));
							}
							console.log(markerBounds);
							map.fitBounds(markerBounds);
						}
						//clearTimeout(mapWillUpdate);
                		mapWillUpdate = setInterval(initMap, 500);
					</script>
					
					<?php
					}
					if(!empty(get_field('event_footer_link_title')) || !empty(get_field('event_footer_link_text'))){
					?>
					<div class="bg-primary">
						<div class="row">
							<div class="col-12 text-center py-3">
								<a href="<?php echo (empty(get_field('event_facebook_link'))) ? "#" : get_field('event_facebook_link');?>" rel="nofollow" target="_blank">
									<?php if(!empty(get_field('event_footer_link_title'))){ ?>
										<h4 class="text-uppercase text-white d-inline"><?php the_field('event_footer_link_title')?></h4>
									<?php } ?>
									<?php if(!empty(get_field('event_footer_link_text'))){ ?>
										<span class="h5 text-dark"><?php the_field('event_footer_link_text')?></span>
									<?php } ?>
								</a>
							</div>
						</div>
					</div>
					<?php
					}
					
					?>
				</div>
			</div>
		</div>
	</div>
	<?php 
	$page = ob_get_contents();
	ob_end_clean();
	return $page;
}

function gostudy_course_card_render_block( $attributes, $content ) {
	
	ob_start();
	?>
	<div class="event-course-card-wrapper" style="background: url(<?php the_field_img('course_bg') ?>)">
		<div class="event-course-card-gradient" style="background-image: linear-gradient(-1deg, rgba(238,238,238,0.00) 22%, #FFFFFF 56%);"></div>
		<div class="container" >
			<div class="row justify-content-center">
				<div class="col-11 col-md-10">
					<?php 
					if(!empty(get_field('course_heading'))){
						?>
						<div class="bg-secondary py-2">
							<div class="row">
								<div class="col-12 text-center">
									<h6 class="text-white mb-0"><?php the_field('course_heading'); ?></h6>
								</div>
							</div>
						</div>
						<?php
					}
					if(!empty(get_field('course_title')) || !empty(get_field('course_features'))){
						?>
						<div class="event-course-card-header pt-4">
							<div class="event-course-card-header-bg filter-grayscale" style="background-image: url(<?php echo ($innerBg = get_field_img('course_inner_bg')) ? $innerBg : get_global_option_img('default_post_image'); ?>)" ></div>
							<div class="row justify-content-center">
								<div class="col-10">
									<?php
										if(!empty(get_field('course_title'))){

											echo '<h3 class="text-center text-uppercase text-dark-cyan">'.get_field('course_title').'</h3>';
										}
									?>
								</div>
								<div class="col-12 col-md-10 mt-3">
									<?php if(!empty(get_field('course_features'))){ ?>
										<div class="event-course-card-header-features row justify-content-center">
											<?php foreach(get_field('course_features') as $k => $v){ ?>
												<div class="col-md-3 mb-4">
													<div class="event-course-card-icon"><svg version="1.1" viewBox="0 0 24 24"><?php echo str_ireplace('classname','class', $v['icon']);?></svg></div>
													<div class="bg-primary py-1">
														<div class="col-12 text-center">
															<h6 class="text-white mb-0"><?php echo $v['title'];?></h6>
														</div>
													</div>
													<?php if(!empty($v['content']) ){?>
													<div class="bg-white py-2">
														<div class="col-12 text-center">
															<?php echo $v['content'];?>
														</div>
													</div>
													<?php } ?>
													
												</div>
											<?php } ?>
										</div>
									<?php } ?>
								</div>
							</div>
						</div>
						<?php
					}
					if(!empty(get_field('course_content'))){
						?>
						<div class="bg-white">
							<?php foreach(get_field('course_content') as $k => $v){
								//var_dump($v['place']);
								
								?>
							<div class="row justify-content-center pt-6">
								<div class="col-10">
									<div class="row align-items-center event-course-card-content-left-<?php echo $v['icon_title_color']; ?> mb-3">
										<div class="col-md-3">
											<div class="event-course-card-icon"><svg version="1.1" viewBox="0 0 24 24"><?php echo str_ireplace('classname','class', $v['icon']);?></svg></div>
											<h4 class="text-center event-course-card-title"><?php echo $v['title']; ?></h4>
										</div>
										<div class="col-md-9">
											
											<div class="h5"><?php echo $v['content_text']; ?></div>
											<div class="h5">
												<?php if(!empty($v['content_list'])){?>
												<ul class="list-columns-<?php echo $v['content_list_columns'];?> list-icon-<?php echo $v['content_list_icon'];?> list-icon-color-<?php echo $v['content_icon_color'];?>">
													<?php foreach( $v['content_list'] as $k2 => $v2){?>
														<li>
															<?php if(!empty($v2['link'])){ ?>
																<a href="<?php echo $v2['link']; ?>">
															<?php } ?>
															<?php echo $v2['text'];?>
															<?php if(!empty($v2['link'])){ ?>
																</a>
															<?php } ?>
														</li>
													<?php } ?>
												</ul>
												<?php } ?>
												
											</div>
										</div>
									</div>
									
								</div>
							</div>
							<?php } ?>
						</div>
						<?php
					}
					?>
					
					
					<?php
					if(!empty(get_field('course_button_text'))){?>
					<div class="bg-secondary py-4 px-4">
						<a class="btn btn-light btn-block py-3 text-secondary" href="<?php echo (empty(get_field('course_button_link'))) ? "#" : get_field('course_button_link');?>">
							<?php the_field('course_button_text'); ?>
						</a>
					</div>
					<?php } 
					if(!empty(get_field('course_footer_title')) || !empty(get_field('course_footer_flag')) || !empty(get_field('course_footer_countdown'))){
					?>
					<div class="bg-info">
						<div class="row pb-3">
							<?php if(!empty(get_field('course_footer_title')) || !empty(get_field('course_footer_countdown'))){ ?>
							<div class="col-10 offset-1 <?php echo (!empty(get_field('course_footer_flag'))) ? 'col-md-6' : 'col-md-10'; ?> pt-3">
								<?php if(!empty(get_field('course_footer_title')) ){ ?>
								<h6 class="text-primary"><?php the_field('course_footer_title') ?></h6>
								<?php } ?>
								<?php if(!empty(get_field('course_footer_countdown')) ){ ?>
								<div class="h6 text-white countdown"><?php the_field('course_footer_countdown') ?></div>
								<?php } ?>
							</div>
							<?php } ?>
							<?php if(!empty(get_field('course_footer_flag'))){ ?>
							<div class="col-10 offset-1 col-md-4 <?php echo (!empty(get_field('course_footer_title'))) ? 'offset-md-1' : 'offset-md-8'; ?> pt-3">
								<div class="course-footer-flag bg-white">
									<div class="col-12 py-1 text-center">
											<h5 class="text-primary mb-0"><?php the_field('course_footer_flag') ?></h5>
									</div>
								</div>
							</div>
							<?php } ?>
						</div>
					</div>
					<?php
					}
					
					?>
				</div>
			</div>
		</div>
	</div>
	<?php 
	$page = ob_get_contents();
	ob_end_clean();
	return $page;
}

function gostudy_banner_block_render_block($attributes, $content){
	$content = preg_replace('/(<a class="banner__btn.+ )(src=")/i', '$1href="', $content);
	return $content;
}

function gostudy_custom_post_render_block( $attributes, $content ) {
	if(empty($attributes['postType'])){
		$attributes['postType'] = 'post';
	}
	if(empty($attributes['taxonomy']) || $attributes['taxonomy'] == 'none' ){
		$attributes['taxonomy'] = 'post_tag';
	}
	if($attributes['taxonomy'] && (empty($attributes['term']) || $attributes['term'] == '0' || $attributes['term'] == '-1')){
		$attributes['term'] = wp_get_post_terms(get_the_ID(), $attributes['taxonomy'], ['fields' => 'ids']);
	}
	$id = get_the_id();
	$args = array(
		'post__not_in' => array($id),
		'post_type' => $attributes['postType'],
		'posts_per_page' => 3,
		'ignore_sticky_posts' => 0,
		'orderby' => 'rand'
	);

	if($attributes['taxonomy'] && $attributes['term'] != 0 && !empty($attributes['term'])){
		$args['tax_query'] = array(
			'relation' => $attributes['relationship'] ?: 'OR',
			array(
				'taxonomy' => $attributes['taxonomy'],
				'field'    => 'term_id',
				'terms'    => $attributes['term'],
			)
		);
	}

	if($attributes['taxonomy2'] && $attributes['term2'] != 0 && !empty($attributes['term'])){
		$args['tax_query'][] = array(
			'taxonomy' => $attributes['taxonomy2'],
			'field'    => 'term_id',
			'terms'    => $attributes['term2'],
		);
	}

	$the_query = new WP_Query( $args );
	


	ob_start();

	$strings = [
		'/(<a class="banner__btn.+ )(src=")/i',
		'/<h1(\s\w+="[^"]+")* class="([\w-\s]*?)banner__title(.*)<\/h1>/i',
		'/Lorem ipsum dolor sit amet/',
	];

	$replacements = [
		'$1href="',
		'<h6$1 class="$2h1 banner__title$3</h6>',
		''
	];

	$content = preg_replace($strings, $replacements, $content);
	echo $content;
	
	?>
	<div class="custom-post-wrapper">
		<?php if(!empty($attributes['imageUrl']) ) { ?> <img class="card__image" src="<?php echo $attributes['imageUrl'];?>" alt="" aria-hidden="true" /> <?php } ?>
		<div class="banner__bg__overlay" style="background: <?php echo $attributes['bannerBgColor'] ?>; " ></div>
		<div class="container">
			<?php if ( $the_query->have_posts() ) {
				echo '<div class="row">';
				while ( $the_query->have_posts() ) {
					$the_query->the_post();
					$language = wp_get_post_terms( get_the_ID(), 'language' );
					
					if(get_post_type() == 'post'){
						get_template_part( 'loop-templates/content', get_post_format() );
					}else{
						get_template_part( 'loop-templates/content-not-post', get_post_format() );
					}
					?>
					
					<?php
				}
				echo '</div>';
				/* Restore original Post Data */
				
			} else {
				// no posts found
			} 
			wp_reset_postdata();?>
		</div>
	</div>
	<?php
	/*
	echo '<pre>';
	var_dump($attributes);
	echo '</pre>';
	*/
	?>
	<h6 class="h1 banner__title"><?php echo $attributes['title']; ?></h6>
	<?php 
	$page = ob_get_contents();
	ob_end_clean();
	   
	/*
    $recent_posts = wp_get_recent_posts( array(
        'numberposts' => 1,
        'post_status' => 'publish',
    ) );
    if ( count( $recent_posts ) === 0 ) {
        return 'No posts';
    }
    $post = $recent_posts[ 0 ];
	$post_id = $post['ID'];
	*/
    return $page;
}




