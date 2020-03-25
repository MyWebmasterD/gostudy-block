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
registerBlockType( 'cgb/gostudy-image-and-text', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Image and text' ), // Block title.
	icon: 'media-document', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'GSA', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'image and text' ), __( 'magazine' )
	],
	attributes: {
		alignement:{
			type: 'string',
			default: 'left'
		},
		offgrid: {
			type: 'string',
			default: 'ingrid'
		},
		title: {
		  source: 'text',
		  selector: '.imagentext__title'
		},
		kicker: {
		  source: 'text',
		  selector: '.imagentext__kicker'
		},
		subtitle: {
		  type: 'text',
		  selector: '.imagentext__subtitle'
		},
		imageAlt: {
		  attribute: 'alt',
		  selector: '.imagentext__image'
		},
		imageUrl: {
		  attribute: 'src',
		  selector: '.imagentext__image'
		},
		titleColor: {
			type: 'string',
			default: '#007380'
		},
		titleSize:{
			type: 'string',
			default: 'h1'
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
			titleSize,
			subtitle,
			kicker,
			alignement,
			offgrid
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
		let classes='image-and-text container';
		if(attributes.alignement == 'right'){
			classes += ' image-right';
		}
		return (
			<Fragment>
				<InspectorControls>
					<RadioControl
							label="Title size"
							help=""
							selected={ titleSize }
							options={ [
									{ label: 'h1', value: 'h1' },
									{ label: 'h2', value: 'h2' },
									{ label: 'h3', value: 'h3' },
									{ label: 'h4', value: 'h4' },
							] }
							onChange={ content => setAttributes({titleSize : content || null }) }
					/>
					<RadioControl
							label="Offgrid"
							help="Should the image go offgrid?"
							selected={ offgrid }
							options={ [
									{ label: 'Offgrid', value: 'offgrid' },
									{ label: 'In grid', value: 'ingrid' },
							] }
							onChange={ content => setAttributes({offgrid : content || null }) }
					/>
					<RadioControl
							label="Align image"
							help="Wich side should the image be aligned to? "
							selected={ alignement }
							options={ [
									{ label: 'Left', value: 'left' },
									{ label: 'RIght', value: 'right' },
							] }
							onChange={ content => setAttributes({alignement : content || null }) }
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

			<div className={classes} >
				<h5 className="text-light-gray">Image and text</h5>
				{attributes.imageUrl && attributes.imageUrl.length > 0 && <div className="image-and-text__image" style={ {background: "url("+attributes.imageUrl+")" } } ></div>}
				<div className="image-and-text__content">

					<h6>
						<PlainText
							onChange={ content => setAttributes({ kicker: content || null }) }
							value={ attributes.kicker }
							placeholder="Section kicker"
							className="heading"
						/>
					</h6>
					<h1 style={ {color: attributes.titleColor} }>
						<PlainText
							onChange={ content => setAttributes({ title: content || null }) }
							value={ attributes.title }
							placeholder="Section title"
							className="heading"
						/>
					</h1>
					<h3>
						<PlainText
							onChange={ content => setAttributes({ subtitle: content || null }) }
							value={ attributes.subtitle }
							placeholder="Section subtitle"
							className="heading"
						/>
					</h3>

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
		let wrapperClasses;
		if(attributes.alignement == 'right'){
			if(attributes.offgrid == 'offgrid'){
				wrapperClasses = 'imagentext imagentext-right imagentext-offgrid';
			}else{
				wrapperClasses = 'imagentext imagentext-right';
			}
		}else{
			if(attributes.offgrid == 'offgrid'){
				wrapperClasses = 'imagentext imagentext-left imagentext-offgrid';
			}else{
				wrapperClasses = 'imagentext imagentext-left';
			}
		}
		const bannerImage = (src, alt) => {
			if(!src) return null;

			if(alt) {
			  return (
					<div className="imagentext__image__wrapper">
						<img
							className="imagentext__image"
							src={ src }
							alt={ alt }
						/>
					</div>
			  );
			}

			// No alt set, so let's hide it from screen readers
			return (
				<div className="imagentext__image__wrapper">
					<img
					className="imagentext__image"
					src={ src }
					alt=""
					aria-hidden="true"
					/>
				</div>
			);
		};
		const getTitle = (text, color,size) => {
			if(size == 'h4'){
				return ( <h4 className="imagentext__title" style={ {color: color} }>{ text }</h4>);
			}else if(size == 'h3'){
				return ( <h3 className="imagentext__title" style={ {color: color} }>{ text }</h3>);
			}else if(size == 'h2'){
				return ( <h2 className="imagentext__title" style={ {color: color} }>{ text }</h2>);
			}else{
				return ( <h1 className="imagentext__title" style={ {color: color} }>{ text }</h1>);
			}
		};
		return (
			<div className={wrapperClasses}>
				{ bannerImage(attributes.imageUrl, attributes.imageAlt) }
				<div className="imagentext__content">
					{attributes.kicker && attributes.kicker.length > 0 && <h6 className="imagentext__kicker">{ attributes.kicker }</h6> }
					{ attributes.title && attributes.title.length && getTitle(attributes.title,attributes.titleColor,attributes.titleSize) }
					{attributes.subtitle && attributes.subtitle.length > 0 && <h3 className="imagentext__subtitle">{ attributes.subtitle }</h3> }
					<div className="imagentext__body">
						<InnerBlocks.Content />
					</div>

				</div>
			</div>
		);
	},
} );
