/**
 * BLOCK: gostudy-block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';
import ICONS from '../icons.js';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { Component, Fragment } = wp.element;
const { InspectorControls, RichText, ColorPalette, MediaUpload, PlainText, InnerBlocks, getColorClass, getFontSizeClass, withColors,withFontSizes, PanelColorSettings } = wp.editor;
const { RangeControl, PanelBody, BaseControl , SelectControl, Dashicon, Tooltip, Button } = wp.components;
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks

const accordionBlockIcon = (
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="2 2 22 22">
			<path fill="none" d="M0,0h24v24H0V0z"/>
			<rect x="3" y="17" width="18" height="2"/>
			<path d="M19,12v1H5v-1H19 M21,10H3v5h18V10L21,10z"/>
			<rect x="3" y="6" width="18" height="2"/>
	</svg>
);
/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'cgb/gostudy-carousel-element-block', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Carousel element' ), // Block title.
	icon: 'shield', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'Carousel element' )
	],
	parent: [ 'cgb/gostudy-carousel-small-block' ],
	attributes: {
		title: {
			source: 'text',
			selector: '.carousel__element__title'
		},
		headerTextColor: {
			type: 'string',
			default: '#007380',
		},
		headerIcon: {
			type: 'string',
			default: 'plusCircleOutline',
		},
		
	},
	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit({ attributes, className, setAttributes, focus }) {
		//const ALLOWED_BLOCKS = [ 'advgb/list', 'advgb/button', 'core/paragraph', 'cgb/gostudy-labeled-element' ];
		const {
			
			headerTextColor,
			headerIcon,
			//headerIconColor,
				
		} = attributes;
		
		return (
			<Fragment>
				<InspectorControls>
					<PanelColorSettings
						title={ __( 'Color Settings' ) }
						initialOpen={ false }
						colorSettings={ [
							{
								value: headerTextColor,
								onChange: ( colorValue ) => setAttributes( { headerTextColor: colorValue || 'transparent' } ) ,
								label: __( 'Text Color' ),
							},
							
						] }
					>
					</PanelColorSettings>
					<PanelBody title={ __( 'Header Icon' ) }>
						<BaseControl label={ __( 'Icon Style' ) }>
							<div className="advgb-icon-items-wrapper">
								{Object.keys( ICONS ).map( ( key, index ) => (
									<div className="advgb-icon-item" key={ index }>
										<span className={ key === headerIcon ? 'active' : '' }
											onClick={ () => setAttributes( { headerIcon: key || null } ) }>
												<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
													{ ICONS[key] }
												</svg>
										</span>
									</div>
								) ) }
							</div>
						</BaseControl>
						
					</PanelBody>
				</InspectorControls>
				<div className="container">
					<div className="gostudy-carousel-element-icon">
						<svg fill={ headerTextColor } xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
							{ ICONS[headerIcon] }
						</svg>
					</div>
					<div className="gostudy-carousel-element-header" style={ { borderBottomColor : headerTextColor } }>
						<h5 style={ {color: headerTextColor} }>
							
							<PlainText
							onChange={ content => setAttributes({ title: content || null }) }
							value={ attributes.title }
							placeholder="Carousel element title"
							className="heading"
						/>
						</h5>
					</div>
					
				</div>
			</Fragment>
		);
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save({ attributes }) {
	//save: function( { attributes } ) {
		
		
		return (
			<div className="carousel-card">
				<svg fill={ attributes.headerTextColor } xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
					{ ICONS[attributes.headerIcon] }
				</svg>
				
				<h6 className="carousel__element__title" style={ {color: attributes.headerTextColor} }>
					{ attributes.title }
				</h6>
				

				
			</div>


			
		);
	},
} );

