/**
 * BLOCK: gostudy-block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';
import SelectPostTypeNCat from '../SelectPostTypeNCat.js';

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
registerBlockType( 'cgb/gostudy-event-card', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Event Card' ), // Block title.
	icon: 'calendar', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'GSA', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	render_callback : 'gostudy_event_card_render_block',
	keywords: [
		__( 'Event Card' ),
	],
	attributes: {

	},
	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	/*
	edit: withSelect( ( select ) => {
		const { getCategories, isRequestingCategories } = select( 'core' );
		return {
			categories: getCategories(),
			posts: select( 'core' ).getEntityRecords( 'postType', 'post' )
		};
	} )( ( { posts, className, attributes, setAttributes, focus } ) => {
		*/
	edit({ attributes, className, setAttributes, focus }) {
		//console.log(posts);
		//console.log(categories);
		const {


		} = attributes;

		const getImageButton = (openEvent) => {
			if(attributes.imageUrl) {
			  return (
				<img
				  src={ attributes.imageUrl }
				  onClick={ openEvent }
				  className="image"
				/>
			  );
			}
			else {
			  return (
				<div className="button-container">
				  <Button
					onClick={ openEvent }
					className="button button-large"
				  >
					Pick an image
				  </Button>
				</div>
			  );
			}
		};
		return (
			<Fragment>
				<InspectorControls>

				</InspectorControls>

			<div className="container"  >

				<h1>
					{__('Event card block')}
				</h1>
				<h5>{__('This block is handled by ACF, check in the footer for the fields')}</h5>

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
		/* not used */
		let classes='banner';
		if(attributes.imageUrl){
			classes += ' has-bg-image';
		}
		if(attributes.mainColor == 'orange'){
			classes += ' content-orange';
		}else if(attributes.mainColor == 'cyan'){
			classes += ' content-cyan';
		}
	//save: function( { attributes } ) {
		const bannerImage = (src, alt) => {
			if(!src) return null;

			if(alt) {
			  return (
				<img
				  className="card__image"
				  src={ src }
				  alt={ alt }
				/>
			  );
			}

			// No alt set, so let's hide it from screen readers
			return (
			  <img
				className="card__image"
				src={ src }
				alt=""
				aria-hidden="true"
			  />
			);
		};
		const bannerBtn = (text, src) => {
			if(!text) return null;
			if(!src) src = "#";
			return (
			  <a
				className="banner__btn btn btn-outline-light"
				src={ src }
				>{text}</a>

			);

		}
		return (
			<div className={classes}>

			</div>
		);
	},

} );
