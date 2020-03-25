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
const { RangeControl, PanelBody, BaseControl , SelectControl, Dashicon, Tooltip, Button,RadioControl } = wp.components;
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
registerBlockType( 'cgb/gostudy-section-row', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Section' ), // Block title.
	icon: 'align-center', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'GSA', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'Section' ),
	],
	attributes: {
		title: {
		  source: 'text',
		  selector: '.section__title'
		},
		titleColor: {
			type: 'string',
			default: '#FF7F30'
		},
		bgColor: {
			type: 'string',
			default: '#ffffff'
		},
		imageAlt: {
		  attribute: 'alt',
		  selector: '.imagentext__image'
		},
		imageUrl: {
		  attribute: 'src',
		  selector: '.imagentext__image'
		},
		verticalAlignement: {
			type: 'string',
			default: 'top'
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
		//const ALLOWED_BLOCKS = [ 'advgb/list', 'advgb/button', 'core/paragraph', 'core/columns', 'core/heading', 'core/image' ];
		const ALLOWED_BLOCKS = [ 'advgb/list', 'advgb/button', 'core/paragraph', 'cgb/gostudy-strip-element-block', 'core/columns', 'core/heading', 'core/image','acf/package','acf/link-grid-9','acf/about-slider','acf/icon-label-content','acf/stories-social-wall','acf/slider-team' ];

		const {
			titleColor,
			title,
			bgColor,
			imageAlt,
			imageUrl,
			verticalAlignement
		} = attributes;
		const focusedEditable = focus ? focus.editable || 'title' : null;
		const setBackgroundColor = (value) => {
			//console.log('--');
			//console.log(attributes.bgColor);
			setAttributes({bgColor : value || 'transparent'});
			//console.log(attributes.bgColor);
			//console.log('--');
			//console.log(value)
		};
		const setTitleColor = (value) => {
			setAttributes({titleColor : value || 'transparent' });
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
		let classes = 'gutenberg__inner__content';
		if(attributes.imageUrl){
			classes += ' has-bg-image';
		}
		return (
			<Fragment>
				<InspectorControls>
					<RadioControl
							label="Vertical alignement"
							help=""
							selected={ verticalAlignement }
							options={ [
									{ label: 'Top', value: 'top' },
									{ label: 'Center', value: 'center' },
									{ label: 'Bottom', value: 'bottom' },
							] }
							onChange={ content => setAttributes({verticalAlignement : content || null }) }
					/>
					<MediaUpload
						onSelect={ media => { setAttributes({ imageAlt: media.alt, imageUrl: media.url }); } }
						type="image"
						value={ attributes.imageID }
						render={ ({ open }) => getImageButton(open) }
					/>
					{attributes.imageUrl && attributes.imageUrl.length > 0 && <Button
						onClick={ media => { setAttributes({ imageAlt: null, imageUrl: null }); } }
						className="button button-large"
					>
						Remove image
					</Button>}
					<PanelColorSettings
						title={ __( 'Color Settings' ) }
						initialOpen={ false }
						colorSettings={ [
							{
								value: titleColor,
								onChange: setTitleColor,
								label: __( 'Title Color' ),
							},
							{
								value: bgColor,
								onChange: setBackgroundColor,
								label: __( 'Background Color' ),
							},
						] }
					>
					</PanelColorSettings>

					{/*
					<PanelBody title={ __( 'Banner Settings' ) }>
						<PanelColorSettings title={ __( 'Background Color' ) } colorValue={ titleColor } initialOpen={ false }>
							<ColorPalette
								value={ titleColor }
								onChange={ ( value ) => setAttributes( { titleColor: value } ) }
							/>
						</PanelColorSettings>
					</PanelBody>
					*/}
				</InspectorControls>

			<div className="container">
				{ attributes.imageUrl && attributes.imageUrl.length && <img
					className="gutenberg__bg__image"
					src={ attributes.imageUrl }
					alt=""
					aria-hidden="true"
				/> }
				<div className="gutenberg__bg__overlay" style={ { background : attributes.bgColor} }></div>
				<h5 className="text-light-gray">Section</h5>
				<div className={classes} >
					<h3 style={ { color : attributes.titleColor } }>
						<PlainText
							onChange={ content => setAttributes({ title: content || null }) }
							value={ attributes.title }
							placeholder="Your section title"
							className="heading"
						/>
					</h3>
					<div className="gutenberg-innerblocks">
						<InnerBlocks allowedBlocks={ ALLOWED_BLOCKS } />
					</div>
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
		let classes='section';
		if(attributes.imageUrl){
			classes += ' has-bg-image';
		}
		if(attributes.verticalAlignement == 'top'){
			classes += ' ';
		}else if(attributes.verticalAlignement == 'center'){
			classes += ' v-middle';
		}else if(attributes.verticalAlignement == 'bottom'){
			classes += ' v-bottom';
		}

		const bannerImage = (src, alt) => {
			if(!src) return null;

			if(alt) {
			  return (
					<div className="section__image__wrapper">
						<img
							className="section__image"
							src={ src }
							alt={ alt }
						/>
					</div>
			  );
			}

			// No alt set, so let's hide it from screen readers
			return (
				<div className="section__image__wrapper">
					<img
					className="section__image"
					src={ src }
					alt=""
					aria-hidden="true"
					/>
				</div>
			);
		};
	//save: function( { attributes } ) {
		//console.log(attributes.bgColor);
		return (
			//<div className={classes}>
      <div className='wp-block-cgb-gostudy-section section'>
				{ bannerImage(attributes.imageUrl, attributes.imageAlt) }
				{ attributes.bgColor && attributes.bgColor.length > 0 && attributes.bgColor != 'transparent' && <div className="section__bg__overlay" style={ { background : attributes.bgColor} } ></div> }
				<div className="section__content" >
					<div className="section__content__inner" >
						{ attributes.title && attributes.title.length > 0 && <h3 className="section__title" style={ { color : attributes.titleColor} }>{ attributes.title }</h3> }
						<div className="section__body">
							<InnerBlocks.Content />
						</div>
					</div>
				</div>
			</div>
		);
	},
} );
