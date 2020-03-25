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
registerBlockType( 'cgb/gostudy-white-card', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'White card' ), // Block title.
	icon: 'tablet', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'GSA', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'white card' ),
	],
	attributes: {
		title: {
		  source: 'text',
		  selector: '.whitecard__title'
		},
		kicker: {
		  source: 'text',
		  selector: '.whitecard__kicker'
		},
		imageAlt: {
		  attribute: 'alt',
		  selector: '.whitecard__image'
		},
		imageUrl: {
		  attribute: 'src',
		  selector: '.whitecard__image'
		},
		titleColor: {
			type: 'string',
			default: '#FF7F2F'
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

		//const ALLOWED_BLOCKS = [ 'advgb/list', 'advgb/button', 'core/paragraph' ];
		const ALLOWED_BLOCKS = [ 'advgb/list', 'advgb/button', 'core/paragraph', 'cgb/gostudy-strip-element-block', 'core/columns', 'core/heading', 'core/image' ];

		const {
			titleColor,
			kicker
		} = attributes;
		const focusedEditable = focus ? focus.editable || 'title' : null;
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
		let classes='whitecard-block container';
		if(attributes.imageUrl){
			classes += ' has-bg-image';
		}
		return (
			<Fragment>
				<InspectorControls>

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

						] }
					>
					</PanelColorSettings>

					{/*
					<PanelBody title={ __( 'Banner Settings' ) }>
						<PanelColorSettings title={ __( 'Background Color' ) } colorValue={ bannerBgColor } initialOpen={ false }>
							<ColorPalette
								value={ bannerBgColor }
								onChange={ ( value ) => setAttributes( { bannerBgColor: value } ) }
							/>
						</PanelColorSettings>
					</PanelBody>
					*/}
				</InspectorControls>

			<div className={classes}  style={ {background: "url("+attributes.imageUrl+")" } }>
				<h5 className="text-light-gray">White card</h5>
				<div className="whitecard-wrapper">
					<h6>
						<PlainText
							onChange={ content => setAttributes({ kicker: content || null }) }
							value={ attributes.kicker }
							placeholder="White card kicker"
							className="heading"
						/>
					</h6>
					<h4 style={ {color: attributes.titleColor} }>
						<PlainText
							onChange={ content => setAttributes({ title: content || 'transparent' }) }
							value={ attributes.title }
							placeholder="White card title"
							className="heading"
							style={ {color: attributes.titleColor} }
						/>
					</h4>


					<InnerBlocks allowedBlocks={ ALLOWED_BLOCKS } />

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
		let wrapperClasses ="whitecard";
		/*
		if(attributes.alignement == 'right'){
			wrapperClasses = 'imagentext imagentext-right';
		}else{
			wrapperClasses = 'imagentext imagentext-left';
		}
		*/
		const bannerImage = (src, alt) => {
			if(!src) return null;

			if(alt) {
			  return (
					<div className="whitecard__image__wrapper">
						<img
							className="whitecard__image"
							src={ src }
							alt={ alt }
						/>
					</div>
			  );
			}

			// No alt set, so let's hide it from screen readers
			return (
				<div className="whitecard__image__wrapper">
					<img
					className="whitecard__image"
					src={ src }
					alt=""
					aria-hidden="true"
					/>
				</div>
			);
		};

		return (
			<div className={wrapperClasses}>
				{ bannerImage(attributes.imageUrl, attributes.imageAlt) }
				<div className="whitecard__content">
					{attributes.kicker && attributes.kicker.length > 0 && <h6 className="whitecard__kicker">{ attributes.kicker }</h6> }
					{attributes.title && attributes.title.length > 0 && <h4 className="whitecard__title" style={ {color: attributes.titleColor} }>{ attributes.title }</h4> }

					<div className="whitecard__body">
						<InnerBlocks.Content />
					</div>

				</div>
			</div>
		);
	},
} );
