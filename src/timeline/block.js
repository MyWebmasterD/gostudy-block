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
const { RangeControl, PanelBody, BaseControl , SelectControl, Dashicon, Tooltip, Button, RadioControl } = wp.components;
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
registerBlockType( 'cgb/gostudy-timeline-block', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Timeline' ), // Block title.
	icon: 'align-right', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'GSA', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'Timeline' )
	],
	attributes: {

		mainColor: {
			type: 'string',
			default: 'orange'
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
		const ALLOWED_BLOCKS = [ 'cgb/gostudy-timeline-element-block' ];
		const {

			mainColor,


		} = attributes;
		let classes = 'container timeline-wrapper ';
		if(attributes.mainColor == 'cyan'){
			classes += ' content-cyan';
		}else{
			classes += ' content-orange';
		}
		return (
			<Fragment>
				<InspectorControls>
					<RadioControl
							label="Text and button color"
							help=""
							selected={ mainColor }
							options={ [

									{ label: 'Orange', value: 'orange' },
									{ label: 'Cyan', value: 'cyan' }
							] }
							onChange={ content => setAttributes({mainColor : content || 'transparent' }) }
					/>

				</InspectorControls>
				<div className={classes}>
					<h5 className="text-light-gray">
						Timeline wrapper
					</h5>
					<div className="gutenberg-innerblocks">
						<InnerBlocks allowedBlocks={ ALLOWED_BLOCKS } defaultBlock={ 'cgb/gostudy-timeline-element-block' } />
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
		let classes = "timeline-wrapper";
		if(attributes.mainColor == 'cyan'){
			classes += " timeline-cyan";
		}

		return (
			<div className={classes}>

				<div className="timeline-body">
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
} );
