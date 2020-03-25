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
registerBlockType( 'cgb/gostudy-cta', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Call to Action' ), // Block title.
	icon: 'megaphone', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'GSA', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'banner' ), __( 'cta' ),__( 'call to action' )
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


		const {
			bannerBgColor,
			mainColor
		} = attributes;
		console.log(bannerBgColor);
		const focusedEditable = focus ? focus.editable || 'title' : null;
		const setBackgroundColor = (value) => {
			setAttributes({bannerBgColor : value || 'transparent'});
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
		let classes='banner container';
		if(attributes.imageUrl){
			classes += ' has-bg-image';
		}
		if(attributes.bannerBgColor.length && attributes.bannerBgColor != 'transparent'){
			classes += ' has-overlay';
		}
		if(attributes.mainColor == 'orange'){
			classes += ' content-orange';
		}else if(attributes.mainColor == 'cyan'){
			classes += ' content-cyan';
		}
		return (
			<Fragment>
				<InspectorControls>
					<RadioControl
							label="Text and button color"
							help=""
							selected={ mainColor }
							options={ [
									{ label: 'White', value: 'white' },
									{ label: 'Orange', value: 'orange' },
									{ label: 'Cyan', value: 'cyan' }
							] }
							onChange={ content => setAttributes({mainColor : content || null }) }
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
					{attributes.imageUrl && attributes.imageUrl.length > 0 && <Button
						onClick={ media => { setAttributes({ imageAlt: null, imageUrl: null }); } }
						className="button button-large"
					>
						Remove image
					</Button>}
					{/*
					<PanelBody title={ __( 'Banner Settings' ) }>
						<PanelColor title={ __( 'Background Color' ) } colorValue={ bannerBgColor } initialOpen={ false }>
							<ColorPalette
								value={ bannerBgColor }
								onChange={ ( value ) => setAttributes( { bannerBgColor: value } ) }
							/>
						</PanelColor>
					</PanelBody>
					*/}
				</InspectorControls>

			<div className={classes}  style={ {background: "url("+attributes.imageUrl+")" } }>
				<div class="overlay" style={ { background : attributes.bannerBgColor || 'transparent' } }></div>
				<h5 className="text-light-gray">Call to Action</h5>
				<span className="banner__title">
					<PlainText
						onChange={ content => setAttributes({ title: content || null }) }
						value={ attributes.title }
						placeholder="Call to Action title"
						className="heading"
					/>
				</span>
				<RichText
					onChange={ content => setAttributes({ body: content || null }) }
					value={ attributes.body }
					multiline="p"
					placeholder="Call to Action text"
				/>
				<div className="banner__btn btn btn-outline-light">
					<PlainText
							onChange={ content => setAttributes({ btnText: content || null }) }
							value={ attributes.btnText }
							placeholder="Your button text"
							className=""
					/>
					<PlainText
							onChange={ content => setAttributes({ btnUrl: content || null}) }
							value={ attributes.btnUrl }
							placeholder="Your button url"
							className=""
					/>
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
			//<div className={classes}>
      <div className='wp-block-cgb-gostudy-banner banner'>
				{ bannerImage(attributes.imageUrl, attributes.imageAlt) }
				<div className="banner__bg__overlay" style={ { background : attributes.bannerBgColor} } ></div>
				<div className="banner__content" >
					<div className="banner__content__inner" >
						<span className="banner__title">{ attributes.title }</span>
						<div className="banner__body">
							{ attributes.body }
						</div>
					</div>
					<div className="banner__button__wrapper">
						{bannerBtn(attributes.btnText, attributes.btnUrl)}
					</div>
				</div>
			</div>
		);
	},
} );
