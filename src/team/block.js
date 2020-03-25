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
const { RangeControl, PanelBody, BaseControl , SelectControl, Dashicon, Tooltip, Button } = wp.components;
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
registerBlockType( 'cgb/gostudy-team', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Team' ), // Block title.
	icon: 'shield', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'Team' ),
	],
	attributes: {
		kicker: {
			source: 'text',
		  selector: '.team__kicker'
		},
		title: {
		  source: 'text',
		  selector: '.team__title'
		},
		imageAlt: {
		  attribute: 'alt',
		  selector: '.team__image'
		},
		imageUrl: {
		  attribute: 'src',
		  selector: '.team__image'
		},
		btnUrl: {
			attribute: 'src',
			selector: '.team__btn',
		},
		btnText: {
			type: 'text',
			selector: '.team__btn',
		},
		bannerBgColor: {
			type: 'string',
			default: '#007380'
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
		
		//const ALLOWED_BLOCKS = [ 'advgb/list', 'advgb/button', 'core/paragraph', 'core/heading', 'cgb/gostudy-team-carousel' ];
		const ALLOWED_BLOCKS = [ 'advgb/list', 'advgb/button', 'core/paragraph', 'cgb/gostudy-team-carousel', 'cgb/gostudy-strip-element-block', 'core/columns', 'core/heading', 'core/image' ];
		const {
			bannerBgColor
		} = attributes;
		//console.log(bannerBgColor);
		const focusedEditable = focus ? focus.editable || 'title' : null;
		const setBackgroundColor = (value) => {
			setAttributes({bannerBgColor : value || 'transparent' });
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
		let classes='team-block container';
		if(attributes.imageUrl){
			classes += ' has-bg-image'; 
		}
		if(attributes.bannerBgColor.length && attributes.bannerBgColor != 'transparent'){
			classes += ' has-overlay';
		}
		return (
			<Fragment>
				<InspectorControls>
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
				<div class="overlay" style={ { background : attributes.bannerBgColor} }></div>
			  <h5 className="text-light-gray">Team Block</h5>
				<h6>
					<PlainText
						onChange={ content => setAttributes({ kicker: content || null }) }
						value={ attributes.kicker }
						placeholder="Team block kicker"
						className="heading"
					/>
				</h6>
				<h1>
					<PlainText
						onChange={ content => setAttributes({ title: content || null }) }
						value={ attributes.title }
						placeholder="Team block title"
						className="heading"
					/>
				</h1>
				<div className="team__btn btn ">
					<PlainText
							onChange={ content => setAttributes({ btnText: content || null }) }
							value={ attributes.btnText }
							placeholder="Button text"
							className=""
					/>
					<PlainText
							onChange={ content => setAttributes({ btnUrl: content || null }) }
							value={ attributes.btnUrl }
							placeholder="Button url"
							className=""
					/>
				</div>
				<InnerBlocks allowedBlocks={ ALLOWED_BLOCKS } />
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
				className="team__btn btn btn-outline-light" 
				src={ src }
				>{text}</a>
			   
			);

		}
		return (
			<div className={classes}>
				{ bannerImage(attributes.imageUrl, attributes.imageAlt) }
				<div className="team__bg__overlay" style={ { background : attributes.bannerBgColor} } ></div>
				<div className="team__content" >
					<div className="team__content__inner" >
						{ attributes.kicker && attributes.kicker.length > 0 && <h6 className="team__kicker">{ attributes.kicker }</h6> }
						{ attributes.title && attributes.title.length > 0 && <h1 className="team__title">{ attributes.title }</h1> }
						
						{ attributes.btnText && attributes.btnText.length > 0 && <div className="team__button_wrapper">
							{bannerBtn(attributes.btnText, attributes.btnUrl)}
						</div> }
					</div>
					<div className="team__secondary__wrapper">
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		);
	},
} );
