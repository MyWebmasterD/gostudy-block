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
const { Component, Fragment } = wp.element;
const { InspectorControls, RichText, ColorPalette, MediaUpload, PlainText, InnerBlocks, getColorClass, getFontSizeClass, withColors,withFontSizes,PanelColorSettings } = wp.editor;
const { RangeControl, PanelBody, BaseControl , SelectControl, Dashicon, Tooltip, Button, RadioControl } = wp.components;
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks

const stripBlockIcon = (
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
registerBlockType( 'cgb/gostudy-strip-element-block', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Strip element' ), // Block title.
	icon: 'minus', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'GSA', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'strip element' )
	],
	//parent: [ 'cgb/gostudy-strip-block' ],
	attributes: {
		title: {
			source: 'text',
			selector: '.strip__element__title'
		},
		bgColor: {
			type: 'string',
			default: '#007380',
		},
		headerTextColor: {
			type: 'string',
			default: '#007380',
		},
		headerIcon: {
				type: 'string',
				default: 'plusCircleOutline',
		},
		headerIconColor: {
				type: 'string',
				default: '#007380',
		},
		titleSize: {
			type: 'string',
			default: 'h4'
		},
		hasDownTriangle: {
			type: 'string',
			default: 'false'
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
		//const ALLOWED_BLOCKS = [ 'advgb/list', 'advgb/button', 'core/paragraph', 'cgb/gostudy-labeled-element' ];
		const ALLOWED_BLOCKS = [ 'advgb/list', 'advgb/button', 'core/paragraph', 'cgb/gostudy-strip-element-block', 'core/columns', 'core/heading', 'core/image' ];
		const {

			headerTextColor,
			headerIcon,
			headerIconColor,
			bgColor,
			titleSize,
			hasDownTriangle

		} = attributes;

		return (
			<Fragment>
				<InspectorControls>
					<PanelColorSettings title={ __( 'Color Settings' ) } initialOpen={ false } colorSettings={ [
													{
														value: headerIconColor,
														onChange: ( colorValue ) => setAttributes( { headerIconColor: colorValue || 'transparent' } ),
														label: __( 'Icon Color' ),
													},
													{
														value: headerTextColor,
														onChange: ( colorValue ) => setAttributes( { headerTextColor: colorValue || 'transparent'} ),
														label: __( 'Text Color' ),
													},
													{
														value: bgColor,
														onChange: ( colorValue ) => setAttributes( { bgColor : colorValue || 'transparent' } ),
														label: __( 'Background Color' ),
													},

												] } >

					</PanelColorSettings>
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
							label="Down triangle"
							help=""
							selected={ hasDownTriangle }
							options={ [
									{ label: 'true', value: 'true' },
									{ label: 'false', value: 'false' },
							] }
							onChange={ content => setAttributes({hasDownTriangle : content || null }) }
					/>

					<PanelBody title={ __( 'Header Icon' ) }>
						<BaseControl label={ __( 'Icon Style' ) }>
							<div className="advgb-icon-items-wrapper">
								{Object.keys( ICONS ).map( ( key, index ) => (
									<div className="advgb-icon-item" key={ index }>
										<span className={ key === headerIcon ? 'active' : '' }
											onClick={ () => setAttributes( { headerIcon: key } ) }>
												<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
													{ ICONS[key] }
												</svg>
										</span>
									</div>
								) ) }
							</div>
							</BaseControl>


						</PanelBody>

				</InspectorControls>
				<div className="container" style={ {background:  attributes.bgColor} }>
					<h5 className="text-light-gray">Strip element</h5>
					<div className="gostudy-strip-element-header" style={ { borderBottomColor : headerTextColor } }>
						<h5 style={ {color: headerTextColor} }>
							<span className="advgb-strip-header-icon">
								<svg fill={ headerIconColor } xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
									{ ICONS[headerIcon] }
								</svg>
							</span>
							<PlainText
							onChange={ content => setAttributes({ title: content || null }) }
							value={ attributes.title }
							placeholder="strip element title"
							className="heading"
						/>
						</h5>
					</div>
					<div className="gutenberg-innerblocks">
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
		let classes = 'strip-element container';

	//save: function( { attributes } ) {
		const getTitle = (text, color,size) => {
			if(size == 'h4'){
				return ( <h4 className="strip__element__title" style={ {color: color} }>{ text }</h4>);
			}else if(size == 'h3'){
				return ( <h3 className="strip__element__title" style={ {color: color} }>{ text }</h3>);
			}else if(size == 'h2'){
				return ( <h2 className="strip__element__title" style={ {color: color} }>{ text }</h2>);
			}else{
				return ( <h1 className="strip__element__title" style={ {color: color} }>{ text }</h1>);
			}
		};

		return (
			<div className={classes}>
				{ attributes.bgColor && attributes.bgColor.length > 0 && attributes.bgColor != 'transparent' && <div className="section__bg__overlay" style={ { background : attributes.bgColor} } ></div> }
				{ attributes.hasDownTriangle == 'true' && attributes.bgColor && attributes.bgColor.length > 0 && attributes.bgColor != 'transparent' && <div className="section__bg__overlay down-triangle" style={ { background : attributes.bgColor} } ></div> }
				<div className="row" style={ { background : attributes.bgColor} }>
					<div className="strip-element-header col-4" style={ { borderBottomColor : attributes.headerTextColor } } >

								<span className="strip-element-header-icon">
									<svg fill={ attributes.headerIconColor } xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
										{ ICONS[attributes.headerIcon] }
									</svg>
								</span>

						{ attributes.title && attributes.title.length && getTitle(attributes.title,attributes.headerTextColor,attributes.titleSize) }
					</div>

					<div className="strip-element-body col-8">
							<InnerBlocks.Content />
					</div>
				</div>
			</div>


		);
	},
} );
