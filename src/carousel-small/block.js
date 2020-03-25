/**
 * BLOCK: gostudy-block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { InspectorControls, RichText, ColorPalette, MediaUpload, PlainText, InnerBlocks, getColorClass, getFontSizeClass, withColors,withFontSizes, PanelColorSettings } = wp.editor;
const { RangeControl, PanelBody, BaseControl , SelectControl, Dashicon, Tooltip, Button } = wp.components;
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { Component, Fragment } = wp.element;

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
registerBlockType( 'cgb/gostudy-carousel-small-block', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Carousel' ), // Block title.
	icon: 'shield', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'Carousel small' )
	],
	attributes: {
		title: {
			source: 'text',
			selector: '.carousel-small-title'
		},
		titleTextColor: {
			type: 'string',
			default: '#ffffff'
		}
		
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
		const ALLOWED_BLOCKS = [ 'cgb/gostudy-carousel-element-block' ];
		const {
			
			titleTextColor,
			
				
		} = attributes;
		return (
			<Fragment>
				<InspectorControls>
					
					<PanelColorSettings
						title={ __( 'Color Settings' ) }
						initialOpen={ false }
						colorSettings={ [
							{
								value: titleTextColor,
								onChange: ( colorValue ) => setAttributes( { titleTextColor: colorValue || 'transparent'} ) ,
								label: __( 'Title Color' ),
							},
							
						] }
					>
					</PanelColorSettings>
					
				</InspectorControls>
				<div className="container">
					<h5 className="text-light-gray">Carousel</h5>
					<h4 style={ {color: titleTextColor} }>
						<PlainText
							onChange={ content => setAttributes({ title: content || null }) }
							value={ attributes.title }
							placeholder="Your carousel title"
							className="heading"
						/>
					</h4>
					<div className="gutenberg-innerblocks carousel__inner">
						<InnerBlocks allowedBlocks={ ALLOWED_BLOCKS } defaultBlock={ 'cgb/gostudy-carousel-element-block' } />
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
			<div className="carousel-small-wrapper">
				<h4 style={ {color: attributes.titleTextColor} } className="carousel-small-title">{attributes.title}</h4>
				<div className="carousel">
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
} );

