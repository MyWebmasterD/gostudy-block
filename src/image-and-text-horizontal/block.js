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
registerBlockType( 'cgb/gostudy-image-and-text-horizontal', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Image and text horizontal' ), // Block title.
	icon: 'media-spreadsheet', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'GSA', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'image and text' ), __( 'subheader' ), __( 'header' )
	],
	attributes: {
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
		subtitleColor: {
			type: 'string',
			default: '#000000'
		},
		bgColor: {
			type: 'string',
			default: '#transparent'
		},
		titleSize:{
			type: 'string',
			default: 'h1'
		},
		subtitleSize:{
			type: 'string',
			default: 'h3'
		},
		bodyGrid:{
			type: 'string',
			default: '6'
		},
		childrenGrid:{
			type: 'string',
			default: '6'
		},
		bgStyle:{
			type: 'string',
			default: 'white-gradient'
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

		const ALLOWED_BLOCKS = [ 'advgb/list', 'advgb/button', 'core/paragraph', 'cgb/gostudy-strip-element-block', 'core/columns', 'core/heading', 'core/image', 'core/quote','acf/package','acf/link-grid-9','acf/about-slider','acf/icon-label-content','acf/stories-social-wall','acf/slider-team' ];
		const {
			titleColor,
			subtitle,
			kicker,
			alignement,
			offgrid,
			titleSize,
			subtitleColor,
			subtitleSize,
			bgColor,
			bodyGrid,
			childrenGrid,
			bgStyle
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
		let classes='image-and-text-horizontal container';
		if(attributes.imageUrl){
			classes += ' has-bg-image-2';
		}
		if(attributes.bgColor && attributes.bgColor.length > 0 && attributes.bgColor != 'transparent' && attributes.bgStyle == 'solid'){
			classes += ' has-overlay';
		}
		const bannerImage = (src, alt) => {
			if(!src) return null;

			if(alt) {
			  return (

					<img
							className="imagentext__image"
							src={ src }
							alt={ alt }
						/>
			  );
			}

			// No alt set, so let's hide it from screen readers
			return (

					<img
					className="imagentext__image"
					src={ src }
					alt=""
					aria-hidden="true"
					/>
			);
		};
		/*
		if(attributes.bannerBgColor.length && attributes.bannerBgColor != 'transparent'){
			classes += ' has-overlay';
		}

		if(attributes.mainColor == 'orange'){
			classes += ' content-orange';
		}else if(attributes.mainColor == 'cyan'){
			classes += ' content-cyan';
		}
		*/
		return (
			<Fragment>
				<InspectorControls>
					<PanelColorSettings title={ __( 'Color Settings' ) } initialOpen={ false } colorSettings={ [
						{
							value: titleColor,
							onChange: ( colorValue ) => setAttributes( { titleColor: colorValue || 'transparent' } ),
							label: __( 'Title Color' ),
						},
						{
							value: subtitleColor,
							onChange: ( colorValue ) => setAttributes( { subtitleColor: colorValue || 'transparent'} ),
							label: __( 'Subtitle Color' ),
						},
						{
							value: bgColor,
							onChange: ( colorValue ) => setAttributes( { bgColor: colorValue || 'transparent' } ),
							label: __( 'Backround Color' ),
						},
					] } ></PanelColorSettings>
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
							onChange={ content => setAttributes({titleSize : content || null}) }
					/>
					<RadioControl
							label="Subtitle size"
							help=""
							selected={ subtitleSize }
							options={ [
									{ label: 'h3', value: 'h3' },
									{ label: 'h4', value: 'h4' },
									{ label: 'h5', value: 'h5' },
									{ label: 'h6', value: 'h6' },
									{ label: 'p', value: 'p' },
							] }
							onChange={ content => setAttributes({subtitleSize : content || null }) }
					/>
					<RadioControl
							label="Body grid"
							help=""
							selected={ bodyGrid }
							options={ [
								{ label: 'Small', value: '6' },
								{ label: 'Medium', value: '8' },
								{ label: 'Large', value: '10' },
								{ label: 'ExtraLarge', value: '12' }
							] }
							onChange={ content => setAttributes({bodyGrid : content || null }) }
					/>
					<RadioControl
							label="Children grid"
							help=""
							selected={ childrenGrid }
							options={ [
								{ label: 'Small', value: '6' },
								{ label: 'Medium', value: '8' },
								{ label: 'Large', value: '10' },
								{ label: 'ExtraLarge', value: '12' }
							] }
							onChange={ content => setAttributes({childrenGrid : content || null }) }
					/>
					<RadioControl
							label="Background style"
							help=""
							selected={ bgStyle }
							options={ [
								{ label: 'White gradient', value: 'white-gradient' },
								{ label: 'White gradient & white container', value: 'white-gradient-2' },
								{ label: 'Solid', value: 'solid' },

							] }
							onChange={ content => setAttributes({ bgStyle : content || null }) }
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

			<div className={classes}  >
				<h5 className="text-light-gray">Image and text horizontal</h5>
				{ bannerImage(attributes.imageUrl, attributes.imageAlt) }
				{ attributes.bgColor && attributes.bgColor.length > 0 && attributes.bgColor != 'transparent' && attributes.bgStyle == 'solid' && <div className="section__bg__overlay" style={ { background : attributes.bgColor} } ></div> }

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
						style={ {color: attributes.titleColor} }
					/>
				</h1>
				<h3 style={ {color: attributes.subtitleColor} }>
					<PlainText
						onChange={ content => setAttributes({ subtitle: content || null }) }
						value={ attributes.subtitle }
						placeholder="Section subtitle"
						className="heading"
						style={ {color: attributes.subtitleColor} }
					/>
				</h3>

				<InnerBlocks allowedBlocks={ ALLOWED_BLOCKS }  />



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
		let wrapperClasses = 'imagentext-horizontal';
		if(attributes.bgStyle == 'solid'){
			wrapperClasses += ' has-solid-bg';
		}else if(attributes.bgStyle == 'white-gradient-2'){
			wrapperClasses += ' has-white-gradient-2-bg';
		}
		if(attributes.imageUrl){
			wrapperClasses += ' has-bg-image';
		}
		if(attributes.bgStyle == 'solid'){
			wrapperClasses += ' has-bg-overlay';
		}
		if(attributes.bodyGrid == '12'){
			wrapperClasses += ' grid-12';
		}else if(attributes.bodyGrid == '8'){
			wrapperClasses += ' grid-8';
		}else if(attributes.bodyGrid == '10'){
			wrapperClasses += ' grid-10';
		}
		let childrenClasses = 'imagentext__body';
		if(attributes.childrenGrid == '12'){
			childrenClasses += ' grid-12';
		}else if(attributes.childrenGrid == '8'){
			childrenClasses += ' grid-8';
		}else if(attributes.childrenGrid == '10'){
			childrenClasses += ' grid-10';
		}

		/*
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
		*/
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
		const getSubTitle = (text, color,size) => {
			let style = null
			if(color != '#000000'){
				style = {color: color};
			}
			if(size == 'h4'){
				return ( <h4 className="imagentext__subtitle" style={ style }>{ text }</h4>);
			}else if(size == 'h5'){
				return ( <h5 className="imagentext__subtitle" style={ style }>{ text }</h5>);
			}else if(size == 'h6'){
				return ( <h6 className="imagentext__subtitle" style={ style }>{ text }</h6>);
			}else if(size == 'p'){
				return ( <p className="imagentext__subtitle" style={ style }>{ text }</p>);
			}else{
				return ( <h3 className="imagentext__subtitle" style={ style }>{ text }</h3>);
			}
		};
		let style = null

		return (
			<div className={wrapperClasses}>
				{ bannerImage(attributes.imageUrl, attributes.imageAlt) }
				{ attributes.bgColor && attributes.bgColor.length > 0 && attributes.bgColor != 'transparent' && attributes.bgStyle == 'solid' && <div className="section__bg__overlay" style={ { background : attributes.bgColor} } ></div> }
				<div className="imagentext__container">
					<div className="imagentext__row">
						<div className="imagentext__content">
							{attributes.kicker && attributes.kicker.length > 0 && <h6 className="imagentext__kicker">{ attributes.kicker }</h6> }
							{ attributes.title && attributes.title.length && getTitle(attributes.title,attributes.titleColor,attributes.titleSize) }

							{attributes.subtitle && attributes.subtitle.length > 0 && getSubTitle(attributes.subtitle,attributes.subtitleColor,attributes.subtitleSize) }
							<div className={childrenClasses}>
								<InnerBlocks.Content />
							</div>
						</div>
					</div>

				</div>
			</div>
		);
	},
} );
