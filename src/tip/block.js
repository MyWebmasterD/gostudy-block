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
const { InspectorControls, RichText, ColorPalette, MediaUpload, PlainText, InnerBlocks, getColorClass, getFontSizeClass, withColors,withFontSizes, PanelColorSettings } = wp.editor;
const { RangeControl, PanelBody, BaseControl , SelectControl, Dashicon, Tooltip, Button } = wp.components;
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { Component, Fragment } = wp.element;

const tipBlockIcon = (
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="2 2 22 22">
			<path fill="none" d="M0,0h24v24H0V0z"/>
			<rect x="3" y="17" width="18" height="2"/>
			<path d="M19,12v1H5v-1H19 M21,10H3v5h18V10L21,10z"/>
			<rect x="3" y="6" width="18" height="2"/>
	</svg>
);
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
registerBlockType( 'cgb/gostudy-tip', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Tip' ), // Block title.
	icon: 'format-status', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'GSA', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'tip' ),
	],
	attributes: {
		title: {
		  source: 'text',
		  selector: '.tip__title'
		},
		headerIcon: {
			type: 'string',
			default: 'plusCircleOutline',
		},
		headerTextColor: {
			type: 'string',
			default: '#007380',
		},
		headerBackgroundColor:{
			type: 'string',
			default: '#ff7f2f'
		},
		body: {
		  type: 'array',
		  source: 'children',
		  selector: '.tip__body'
		},
		imageAlt: {
		  attribute: 'alt',
		  selector: '.tip__image'
		},
		imageUrl: {
		  attribute: 'src',
		  selector: '.tip__image'
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
		let classes='tip-block container';
		if(attributes.imageUrl){
			classes += ' has-bg-image';
		}
		return (
			<Fragment>
				<InspectorControls>

					<PanelColorSettings
						title={ __( 'Color Settings' ) }
						initialOpen={ false }
						colorSettings={ [
							{
								value: attributes.headerTextColor,
								onChange: ( colorValue ) => setAttributes( { headerTextColor: colorValue || 'transparent'} ),
								label: __( 'Title color' ),
							},
							{
								value: attributes.headerBackgroundColor,
								onChange: ( colorValue ) => setAttributes( { headerBackgroundColor: colorValue || 'transparent' } ),
								label: __( 'Title background color' ),
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
					<PanelBody title={ __( 'Header Icon' ) }>
						<BaseControl label={ __( 'Icon Style' ) }>
							<div className="advgb-icon-items-wrapper">
								{Object.keys( ICONS ).map( ( key, index ) => (
									<div className="advgb-icon-item" key={ index }>
										<span className={ key === attributes.headerIcon ? 'active' : '' }
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
					<PanelBody title={ __( 'tip Settings' ) }>
						<PanelColorSettings title={ __( 'Background Color' ) } colorValue={ tipBgColor } initialOpen={ false }>
							<ColorPalette
								value={ tipBgColor }
								onChange={ ( value ) => setAttributes( { tipBgColor: value } ) }
							/>
						</PanelColorSettings>
					</PanelBody>
					*/}
				</InspectorControls>

			<div className={classes}  style={ {background: "url("+attributes.imageUrl+")" } }>

				<h5 className="text-light-gray">tip</h5>
				<div className="tip-wrapper">
					<h4 style={ {background: attributes.headerBackgroundColor, color: attributes.headerTextColor, marginBottom: 0} }>
						<span className="gostudy-tip-header-icon">
									<svg fill={ attributes.headerTextColor } xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
										{ ICONS[attributes.headerIcon] }
									</svg>
						</span>
						<PlainText
							onChange={ content => setAttributes({ title: content || null }) }
							value={ attributes.title }
							placeholder="Tip title"
							className="heading"
							style={ {color: attributes.headerTextColor} }
						/>
					</h4>
					<div className="tip-content">
					<RichText
						onChange={ content => setAttributes({ body: content || null }) }
						value={ attributes.body }
						multiline="p"
						placeholder="tip text"
					/>
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
	//save: function( { attributes } ) {
		const tipImage = (src, alt) => {
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
		console.log( ICONS[attributes.headerIcon]);
		if( attributes.headerBackgroundColor == '#ff7f2f' ){
			return (
				<div className="tip">
					{ tipImage(attributes.imageUrl, attributes.imageAlt) }
					<div className="tip__content">

						<span className="tip__header">
								<span className="advgb-accordion-header-icon">
									<svg fill={ attributes.headerTextColor } xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
										{ attributes.headerIcon != 'plusCircleOutline' && <Fragment> {ICONS[attributes.headerIcon]}</Fragment> }
									</svg>
								</span>
							<span className="tip__title" style={ {color: attributes.headerTextColor} }>{ attributes.title }</span>
						</span>

						<div className="tip__body">
							{ attributes.body }
						</div>
					</div>
				</div>
			);
		}else{
			return (
				<div className="tip">
					{ tipImage(attributes.imageUrl, attributes.imageAlt) }
					<div className="tip__content">

						<span className="tip__header" style={ { background : attributes.headerBackgroundColor }}>
								<span className="advgb-accordion-header-icon">
									<svg fill={ attributes.headerTextColor } xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
										{ attributes.headerIcon != 'plusCircleOutline' && <Fragment> {ICONS[attributes.headerIcon]}</Fragment> }
									</svg>
								</span>
							<span className="tip__title" style={ {color: attributes.headerTextColor} }>{ attributes.title }</span>
						</span>

						<div className="tip__body">
							{ attributes.body }
						</div>
					</div>
				</div>
			);
		}
	},
} );
