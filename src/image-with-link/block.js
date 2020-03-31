/**
 * BLOCK: gostudy-block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';
import ICONS from '../icons.js';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { PanelColorSettings, InspectorControls, RichText, ColorPalette, MediaUpload, PlainText, InnerBlocks, getColorClass, getFontSizeClass, withColors,withFontSizes } = wp.editor;
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
registerBlockType( 'cgb/gostudy-image-with-link', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Image link' ), // Block title.
	icon: 'format-image', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'GSA', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'image link' )
	],
	attributes: {
		title: {
		  source: 'text',
		  selector: '.image-link__title'
		},
		imageAlt: {
		  attribute: 'alt',
		  selector: '.image-link__image'
		},
		imageUrl: {
		  attribute: 'src',
		  selector: '.image-link__image'
		},
		bgColor: {
			type: 'string',
			default: '#007380'
		},
		titleColor:{
			type: 'string',
			default: '#ffffff'
		},
		headerIcon: {
			type: 'string',
			default: 'plusCircleOutline',
		},
		link:{
			type: 'string',
			default: '#',
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
			bgColor,
			title,
			headerIcon,
			titleColor
		} = attributes;
		const focusedEditable = focus ? focus.editable || 'title' : null;
		const setTitleColor = (value) => {
			setAttributes({titleColor : value || 'transparent' });
			//console.log(value)
		};
		const setBgColor = (value) => {
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
					<PanelColorSettings title={ __( 'Color Settings' ) } initialOpen={ false } colorSettings={ [
						{
							value: titleColor,
							onChange: ( colorValue ) => setAttributes( { titleColor: colorValue || 'transparent' } ),
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
					<PanelBody title={ __( 'Header Icon' ) }>
						<BaseControl label={ __( 'Icon Style' ) }>
							<div className="advgb-icon-items-wrapper">
								<div className="advgb-icon-item">
									<span className={ false === headerIcon ? 'active' : '' }
										onClick={ () => setAttributes( { headerIcon: false } ) }>
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"></svg>
									</span>
								</div>
								{Object.keys( ICONS ).map( ( key, index ) => (
									<div className="advgb-icon-item" key={ index }>
										<span className={ key === headerIcon ? 'active' : '' }
											onClick={ () => setAttributes( { headerIcon: key || null } ) }>
												<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
													{ ICONS[key] }
												</svg>
										</span>
									</div>
								) ) }
							</div>
						</BaseControl>


					</PanelBody>



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
				<div class="overlay" style={ { background : attributes.bgColor} }></div>
				<h5 className="text-light-gray">Image link</h5>
				<span style={ {color: attributes.titleColor} }>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
						{ ICONS[attributes.headerIcon] }
					</svg>
					<PlainText
						onChange={ content => setAttributes({ title: content || null }) }
						value={ attributes.title }
						placeholder="Link text"
						className="heading"
						style={ {color: attributes.titleColor} }
					/>
					<PlainText
						onChange={ content => setAttributes({ link: content || null }) }
						value={ attributes.link }
						placeholder="Link url"
						className="heading"
						style={ {color: attributes.titleColor} }
					/>
				</span>

				{ /*
				<InnerBlocks allowedBlocks={ ALLOWED_BLOCKS } defaultBlock={ 'cgb/gostudy-carousel-element-block' } />

				*/}

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
		let wrapperClasses = 'image-link';

		if(attributes.imageUrl){
			wrapperClasses += ' has-bg-image';
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
		const linkAttr = ( src) => {
			if(!src) src = "#";
			return src;

		}
		const bannerImage = (src, alt) => {
			if(!src) return null;

			if(alt) {
			  return (
					<div className="image-link__image__wrapper">
						<img
							className="image-link__image"
							src={ src }
							alt={ alt }
						/>
					</div>
			  );
			}

			// No alt set, so let's hide it from screen readers
			return (
				<div className="image-link__image__wrapper">
					<img
					className="image-link__image"
					src={ src }
					alt=""
					aria-hidden="true"
					/>
				</div>
			);
		};

		return (
			<div className={wrapperClasses + " wp-block-cgb-gostudy-image-link"}>
				<a href={linkAttr(attributes.link)} >
					{ bannerImage(attributes.imageUrl, attributes.imageAlt) }
					{ attributes.bgColor && attributes.bgColor.length >0 && attributes.bgColor != 'transparent' && <div className="banner__bg__overlay" style={ { background : attributes.bgColor } } ></div>}
					<div className="image-link__container">
						<div className="image-link__row">
							<div className="image-link__content">

								{attributes.title && attributes.title.length > 0 && <span className="image-link__title" style={ {color: attributes.titleColor} }>
									{attributes.headerIcon &&
									<span className="image-link-icon">
										<svg fill={ attributes.titleColor } xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
											{ ICONS[attributes.headerIcon] }
										</svg>
									</span>
									}
									{ attributes.title }
								</span> }

							</div>
						</div>

					</div>
				</a>
			</div>
		);
	},
} );
