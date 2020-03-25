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
const { RangeControl, PanelBody, PanelColor, BaseControl , SelectControl, Dashicon, Tooltip, Button, RadioControl } = wp.components;
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
registerBlockType( 'cgb/gostudy-custom-post', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Custom post' ), // Block title.
	icon: 'shield', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'Custom post' ),
	],
	attributes: {
		title: {
		  source: 'text',
		  selector: '.banner__title'
		},
		body: {
		  type: 'array',
		  source: 'children',
		  selector: '.banner__body'
		},
		imageAlt: {
		  attribute: 'alt',
		  selector: '.banner__image'
		},
		imageUrl: {
		  attribute: 'src',
		  selector: '.banner__image'
		},
		btnUrl: {
			attribute: 'src',
			selector: '.banner__btn',
		},
		btnText: {
			type: 'text',
			selector: '.banner__btn',
		},
		bannerBgColor: {
			type: 'string',
			default: '#FF7F30'
		},
		mainColor: {
			type: 'string',
			default: 'white'
		},
		postType: {
			type: 'string',
			default: 'post'
		},
		taxonomy: {
			type: 'string',
			default: 'category'
		},
		term: {
			type: 'string',
			default: false
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
			bannerBgColor,
			mainColor
		} = attributes;
		const focusedEditable = focus ? focus.editable || 'title' : null;
		const setBackgroundColor = (value) => {
			setAttributes({bannerBgColor : value});
			//console.log(value)
		};
		// Creates a <p class='wp-block-cgb-block-gostudy-block'></p>.
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
					<PanelBody title={ __( 'Choose a post type' ) }>
						<SelectPostTypeNCat
							onChange={ result => setAttributes( { /* postID: result.id, postType: result.type */ } ) }
						/>
					</PanelBody>
					<RadioControl
							label="Text and button color"
							help=""
							selected={ mainColor }
							options={ [
									{ label: 'White', value: 'white' },
									{ label: 'Orange', value: 'orange' },
									{ label: 'Cyan', value: 'cyan' }
							] }
							onChange={ content => setAttributes({mainColor : content}) }
					/>
					<PanelColorSettings
						title={ __( 'Color Settings' ) }
						initialOpen={ false }
						colorSettings={ [
							{
								value: bannerBgColor,
								onChange: setBackgroundColor,
								label: __( 'Background Color' ),
							},
							
						] }
					>
					</PanelColorSettings>
					<MediaUpload
						onSelect={ media => { setAttributes({ imageAlt: media.alt, imageUrl: media.url }); } }
						type="image"
						value={ attributes.imageID }
						render={ ({ open }) => getImageButton(open) }
					/>
				</InspectorControls>
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
		return null;
	}
} );
