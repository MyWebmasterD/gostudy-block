/**
 * BLOCK: gostudy-block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';
import ICONS from '../icons';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { Component, Fragment } = wp.element;
const { InspectorControls, RichText, ColorPalette, MediaUpload, PlainText, InnerBlocks, getColorClass, getFontSizeClass, withColors,withFontSizes, PanelColorSettings } = wp.editor;
const { RangeControl, PanelBody, BaseControl , SelectControl, Dashicon, Tooltip, Button } = wp.components;
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks

const accordionBlockIcon = (
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
registerBlockType( 'cgb/gostudy-slider-element-block', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Slider element' ), // Block title.
	icon: 'slides', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'GSA', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'Slider element' )
	],
	parent: [ 'cgb/gostudy-slider-block' ],
	attributes: {
		title: {
			source: 'text',
			selector: '.slider__element__title'
		},
		number:{
			source: 'text',
			selector: '.slider__element__number'
		},
		headerTextColor: {
			type: 'string',
			default: '#007380',
		},
		body: {
			source: 'text',
			selector: '.slider__element__body'
		},
		imageAlt: {
			attribute: 'alt',
			selector: '.slider__bg__image'
		},
		imageUrl: {
			attribute: 'src',
			selector: '.slider__bg__image'
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
		const ALLOWED_BLOCKS = [ 'advgb/list', 'advgb/button', 'core/paragraph' ];
		const {

			headerTextColor,
			headerIcon,
			number,
			title
			//headerIconColor,

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
					className="sliderelement__image"
					src={ src }
					alt=""
					aria-hidden="true"
					/>
			);
		};
		return (
			<Fragment>
				<InspectorControls>
					<PanelColorSettings title={ __( 'Color Settings' ) } initialOpen={ false } colorSettings={ [
						{
							value: headerTextColor,
							onChange: ( colorValue ) => setAttributes( { headerTextColor: colorValue || 'transparent' } ),
							label: __( 'Text Color' ),
						}
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
				<div className="container slider-element">
					<h5 className="text-light-gray">Slider element</h5>

					{ bannerImage(attributes.imageUrl, attributes.imageAlt) }
					<div className="slider-element-content" >
						<div className="gostudy-slider-element-header" >
							<PlainText
								onChange={ content => setAttributes({ number: content || null}) }
								value={ attributes.number }
								placeholder="Slider element number"
								className="heading"
								style={ {color: headerTextColor} }
							/>
							<h4 style={ {color: headerTextColor} }>

								<PlainText
								onChange={ content => setAttributes({ title: content || null }) }
								value={ attributes.title }
								placeholder="Slider element title"
								className="heading"
								style={ {color: headerTextColor} }
							/>
							</h4>
							<div className="gutenberg-innerblocks">
								<InnerBlocks allowedBlocks={ ALLOWED_BLOCKS } />
							</div>
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
		let classes='slider-element';
		if(attributes.imageUrl){
			classes += ' has-bg-image';
		}
		const sliderImage = (src, alt) => {
			if(!src) return null;

			if(alt) {
			  return (
				<div className="slider-element__image__wrapper">
					<img
					className="slider-element__image"
					src={ src }
					alt={ alt }
					/>
				</div>
			  );
			}

			// No alt set, so let's hide it from screen readers
			return (
				<div className="slider-element__image__wrapper">
					<img
						className="slider-element__image"
						src={ src }
						alt=""
						aria-hidden="true"
					/>
				</div>
			);
		};

		return (
			<div className={classes}>
				{ sliderImage(attributes.imageUrl, attributes.imageAlt) }
				<div className="slider-element__content">
					{ attributes.title && attributes.title.length > 0 &&<h4 className="slider__element__title" style={ {color: attributes.headerTextColor} }>
						{ attributes.title }
					</h4> }
					{ attributes.number && attributes.number.length > 0 && <h3 className="slider__element__number" style={ {color: attributes.headerTextColor} }>{ attributes.number }</h3> }
					{ InnerBlocks.Content && InnerBlocks.Content.length && <div className="slider__element_childs">
						<InnerBlocks.Content />
					</div> }
          
          <InnerBlocks.Content />
				</div>

			</div>



		);
	},
} );
