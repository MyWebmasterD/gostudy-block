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
registerBlockType( 'cgb/gostudy-slider-block', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'slider ' ), // Block title.
	icon: 'slides', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'GSA', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'Slider' )
	],
	attributes: {
		imageAlt: {
			attribute: 'alt',
			selector: '.slider__bg__image'
		},
		imageUrl: {
			attribute: 'src',
			selector: '.slider__bg__image'
		},
		titleTextColor: {
			type: 'string',
			default: '#007380'
		},
		bgColor: {
			type: 'string',
			default: 'transparent'
		},
		title: {
		  source: 'text',
		  selector: '.slider-heading__title'
		},
		body: {
		  type: 'array',
		  source: 'children',
		  selector: '.slider-heading__body'
		},
		sliderType: {
			type: 'string',
			default: 'standard'
		},
		controlsColor: {
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
		const ALLOWED_BLOCKS = [ 'cgb/gostudy-slider-element-block' ];
		const {

			titleTextColor,
			bgColor,
			sliderType,
			controlsColor

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
		let classes='image-link container';
		if(attributes.imageUrl){
			classes += ' has-bg-image';
		}
		if(attributes.bgColor.length && attributes.bgColor != 'transparent'){
			classes += ' has-overlay';
		}
		return (
			<Fragment>
				<InspectorControls>

				<RadioControl
							label="Type of slider"
							help=""
							selected={ sliderType }
							options={ [
									{ label: 'Standard Slider', value: 'standard' },
									{ label: 'Numbered Slider', value: 'numbered' },
									{ label: 'Logo Slider', value: 'logo' },
									{ label: 'Vertical Slider', value: 'vertical' },
									{ label: 'Top 5 slider', value: 'top5' },
							] }
							onChange={ content => setAttributes({sliderType : content || null }) }
					/>
					<RadioControl
							label="Controls color"
							help=""
							selected={ controlsColor }
							options={ [
									{ label: 'Orange', value: 'orange' },
									{ label: 'Cyan', value: 'cyan' },
							] }
							onChange={ content => setAttributes({controlsColor : content || null }) }
					/>
					<PanelColorSettings title={ __( 'Color Settings' ) } initialOpen={ false } colorSettings={ [
						{
							value: titleTextColor,
							onChange: ( colorValue ) => setAttributes( { titleTextColor: colorValue || 'transparent' } ),
							label: __( 'Title Color' ),
						},
						{
							value: bgColor,
							onChange: ( colorValue ) => setAttributes( { bgColor: colorValue || 'transparent'} ),
							label: __( 'Backround Color' ),
						},
					] } ></PanelColorSettings>

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
				</InspectorControls>
				<div className={classes}  style={ {background: "url("+attributes.imageUrl+")" } }>
					<div class="overlay" style={ { background : attributes.bgColor} }></div>
					<h5 className="text-light-gray">Slider</h5>
					<h3 style={ {color: titleTextColor} }>
						<PlainText
							onChange={ content => setAttributes({ title: content || null}) }
							value={ attributes.title }
							placeholder="Slider title"
							className="heading"
						/>
					</h3>
					<RichText
						onChange={ content => setAttributes({ body: content || null }) }
						value={ attributes.body }
						multiline="p"
						placeholder="Slider heading text"
					/>
					<div className="gutenberg-innerblocks">
						<InnerBlocks allowedBlocks={ ALLOWED_BLOCKS } defaultBlock={ 'cgb/gostudy-slider-element-block' } />
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
		let classes='section';
		if(attributes.imageUrl){
			classes += ' has-bg-image';
		}
		if(attributes.sliderType == 'logo'){
			classes += ' logo-slider';
		}else if(attributes.sliderType == 'vertical'){
			classes += ' vertical-slider';
		}else if(attributes.sliderType == 'numbered'){
			classes += ' numbered-slider';
		}else if(attributes.sliderType == 'top5'){
			classes += ' top5-slider';
		}
		if(attributes.controlsColor == 'cyan'){
			classes += ' controls-cyan';
		}
		const sliderImage = (src, alt) => {
			if(!src) return null;

			if(alt) {
			  return (
				<img
				  className="slider__bg__image"
				  src={ src }
				  alt={ alt }
				/>
			  );
			}

			// No alt set, so let's hide it from screen readers
			return (
			  <img
				className="slider__bg__image"
				src={ src }
				alt=""
				aria-hidden="true"
			  />
			);
		};

		return (
			<div className={classes}>
				{ sliderImage(attributes.imageUrl, attributes.imageAlt) }
				{ attributes.bgColor && attributes.bgColor.length > 0 && attributes.bgColor != 'transparent' && <div className="slider__bg__overlay" style={ { background : attributes.bgColor} } ></div> }
				<div className="slider-container">
					{ (attributes.title && attributes.title.length > 0 || attributes.body && attributes.body.length > 0 ) && <div className="slider-heading">
						{ attributes.title && attributes.title.length > 0 && <h3 className="slider-heading__title" style={ { color: attributes.titleTextColor } }>{ attributes.title }</h3> }
						{ attributes.body && attributes.body.length > 0 && <div className="slider-heading__body">
							{ attributes.body }
						</div> }
					</div> }
					<div className="slider">
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		);
	},
} );
